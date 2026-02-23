import { useState } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedButton } from '@/components/themed-button';

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: '',
      confirm_password: '',
  });

  const [touched, setTouched] = useState({
    password: false, 
    confirm_password: false, 
  })

  const [currentStep, setCurrentStep] = useState(1);

  const updateField = (key: string, value: string) => {
    setFormData((prev)=> ({...prev, [key]: value}) )
    if(key === 'password') {
      setTouched((prev) => ({...prev, confirm_password: false}))
    } else if (key === 'confirm_password') {
      setTouched((prev) => ({...prev, password: false}))
    }
  };

  const passStartMatch = formData.password.startsWith(formData.confirm_password);
  const passMatch = formData.password == formData.confirm_password;
  const confirmPassEmpty = formData.confirm_password.length == 0;
  const isFinalError = (touched.confirm_password || touched.password) && !passMatch;

  const showError = !confirmPassEmpty && (!passStartMatch || isFinalError);

  const handleSignUp = async () => {
    try {
      const response = await fetch ('http://192.168.1.11:5000/auth/register',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json();
      console.log('Success: ', result);

    } catch (error) {
      console.error('Error: Failed ', error)
      
    }
  }
  // Theme
    
  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText type="title">Create Account</ThemedText>
      <ThemedText>Current step: {currentStep }</ThemedText>
    
      {currentStep === 1 && (
        <ThemedView style={{ gap: 10}}>
          <ThemedTextInput
            placeholder='First_name'
            value={formData.first_name}
            onChangeText={(text) => updateField('first_name', text)}
          />
          <ThemedTextInput
            placeholder='last_name'
            value={formData.last_name}
            onChangeText={(text) => updateField('last_name', text)}
          />
        <ThemedButton
          title = "next"
          onPress={() => setCurrentStep(2)}
          disabled={!formData.first_name.length || !formData.last_name}
        />
        </ThemedView>
      )}

      {currentStep === 2 && (
        <ThemedView style={{gap: 10}}>
          <ThemedTextInput
            placeholder='phone'
            value={formData.phone}
            keyboardType='phone-pad'
            onChangeText={(text) => updateField('phone', text)}
          />
          <ThemedTextInput
            placeholder='email'
            keyboardType='email-address'
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            />
          <ThemedButton
            title = "Next"
            disabled = {!formData.email || !formData.phone}
            onPress={() => setCurrentStep(3)}
          />
          <ThemedButton
            title = "Back"
            style = {{
              backgroundColor: 'red'
            }}
            onPress={() => setCurrentStep(1)}
          />
        </ThemedView>
      )};
      {currentStep === 3 && (
        <ThemedView style={{gap: 10}}>
          <ThemedTextInput
            placeholder='password'
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            onBlur={() => setTouched({...touched, password: true})}
            secureTextEntry
          />
          <ThemedText>{showError && "Passwords Don't Match"}</ThemedText>
          <ThemedTextInput
            placeholder='confirm_password'
            value={formData.confirm_password}
            onChangeText={(text) => updateField('confirm_password', text)}
            onBlur={() => setTouched({...touched, confirm_password: true})}
            secureTextEntry
          />
          <ThemedText>{showError && "Passwords Don't Match"}</ThemedText>
          <ThemedButton
            title = "Back"
            style = {{
              backgroundColor: 'red'
            }}
            onPress={() => setCurrentStep(2)}
          />
          <ThemedButton
            title = "Finish Sign Up"
            disabled = {!formData.password || !formData.confirm_password}
            onPress={() => handleSignUp()}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    flex: 1, 
    padding: 20,
    justifyContent: 'center',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  }
});

export default SignUpScreen;