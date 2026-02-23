import { useState } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedButton } from '@/components/themed-button';

const SignInScreen = () => {
  const [formData, setFormData] = useState({
      identifier: '',
      password: '',
  });

  const updateField = (key: string, value: string) => {
    setFormData((prev)=> ({...prev, [key]: value}) )
  };

  const handleSignIn = async () => {
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
        <ThemedView style={{ gap: 10}}>
          <ThemedTextInput
            placeholder='Email, Phone or username'
            value={formData.identifier}
            onChangeText={(text) => updateField('identifier', text)}
          />
          <ThemedTextInput
            placeholder='password'
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
          />
        <ThemedButton
          title = "Sign In"
          onPress={() => handleSignIn()}
          disabled={!formData.identifier || !formData.password}
        />
        </ThemedView>
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

export default SignInScreen;