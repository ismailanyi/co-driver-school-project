import { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedButton } from '@/components/themed-button';
import * as SecureStore from 'expo-secure-store'; 
import { router } from 'expo-router';
import { globalStyles } from '@/constants/globalStyles';

const SignInScreen = () => {
  const [formData, setFormData] = useState({
      identifier: '',
      password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (key: string, value: string) => {
    setFormData((prev)=> ({...prev, [key]: value}) )
    setErrorMessage('');
  };

  const handleSignIn = async () => {
    setErrorMessage('');
    try {
      console.log('Here is the expo link: ', process.env.EXPO_PUBLIC_API_URL)
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/auth/signin`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const { message, token } = await response.json();
      if (!response.ok) {
        console.error('Login failed: ', message)
        setErrorMessage('Invalid username/ password')
        return;
      }

      if (Platform.OS === 'web') {
        localStorage.setItem('userToken', token)
      } else {
        await SecureStore.setItemAsync('userToken', token)
      }
      
      console.log('Success: ', message);
      router.replace('/home')
      

    } catch (error) {
      console.error('Error: Failed ', error)
      
    }
  }
  // Theme
    
  return (
    <ThemedView style={globalStyles.container}>
      <ThemedText type="title" style={{marginBottom: 20, fontSize: 20}}>Enter your details</ThemedText>
      {errorMessage ? (
        <ThemedText style={{color: 'red', marginBottom: 10}}>
          {errorMessage}
        </ThemedText>
      ): null}
        <ThemedView style={{ gap: 0, marginBottom: 10}}>
          <ThemedTextInput
            placeholder='Email, Phone or username'
            value={formData.identifier}
            keyboardType='email-address'
            autoCapitalize='none'
            onChangeText={(text) => updateField('identifier', text)}
          />
          <ThemedTextInput
            placeholder='password'
            value={formData.password}
            autoCapitalize='none'
            onChangeText={(text) => updateField('password', text)}
            secureTextEntry
          />
        </ThemedView>
        <ThemedView>
          <ThemedButton
            title = "Sign In"
            onPress={() => handleSignIn()}
            disabled={!formData.identifier || !formData.password}
          />
          <ThemedButton
            title='FORGOT PASSWORD'
            style={globalStyles.forgotPasswordContainer}
            textStyle={globalStyles.forgotPasswordText}
            onPress={() => {router.push('/forgot')}}
          />
        </ThemedView>
    </ThemedView>
  )
}

export default SignInScreen;