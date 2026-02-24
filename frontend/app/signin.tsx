import { useState } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedButton } from '@/components/themed-button';
import * as SecureStore from 'expo-secure-store'; 
import { router } from 'expo-router';

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
      const response = await fetch ('http://192.168.1.11:5000/auth/signin',{
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
      
      await SecureStore.setItemAsync('userToken', token)
      console.log('Success: ', message);
      router.replace('/home')
      

    } catch (error) {
      console.error('Error: Failed ', error)
      
    }
  }
  // Theme
    
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{marginBottom: 20, fontSize: 'large'}}>Enter your details</ThemedText>
      {errorMessage && (
        <ThemedText style={{color: 'red', marginBottom: 10}}>
          {errorMessage}
        </ThemedText>
      )}
        <ThemedView style={{ gap: 0, marginBottom: 10}}>
          <ThemedTextInput
            placeholder='Email, Phone or username'
            value={formData.identifier}
            onChangeText={(text) => updateField('identifier', text)}
          />
          <ThemedTextInput
            placeholder='password'
            value={formData.password}
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
            style={styles.forgotPasswordContainer}
            textStyle={styles.forgotPasswordText}
            onPress={() => {router.push('/forgot')}}
          />
        </ThemedView>
    </ThemedView>
  )
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
    // justifyContent: 'center',
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
  },
  forgotPasswordText: {
    color: '#00BFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center'
  },
  forgotPasswordContainer: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    marginTop: 10,
  }
});

export default SignInScreen;