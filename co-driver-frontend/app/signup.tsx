import { useState } from 'react';
import { Platform, StyleSheet, useColorScheme, View, Text, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/ThemedTextInput';

const SignUpScreen = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
      })
      const [currentStep, setCurrentStep] = useState(1);
      const updateField = (key: string, value: string) => {
        setFormData((prev)=> ({...prev, [key]: value}) )
      };
      // Theme
      
    return (
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="title">Create Account</ThemedText>
        <ThemedText>Current step: {currentStep }</ThemedText>
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
        <ThemedTextInput
          placeholder='password'
          value={formData.password}
          onChangeText={(text) => updateField('password', text)}
          secureTextEntry
        />
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