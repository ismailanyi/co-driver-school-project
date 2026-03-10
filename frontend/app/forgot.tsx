import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/themed-button";
import { useState } from "react";
import { router } from 'expo-router';
import { Alert } from "react-native";
import { globalStyles } from "@/constants/globalStyles";


const Forgot = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

      const handleforgotpassword = async () => {
        setErrorMessage('');
        try {
          const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/auth/forgot`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email})
          })
    
          const { message } = await response.json();
          if (!response.ok) {
            console.error('Non existing Email', message)
            setErrorMessage("There's no Co-Driver account with this email address")
            return;
          }


          
          console.log('Success: ',);
          router.replace('/forgot')

          Alert.alert(
            "Success",
            "Email has been sent out",
            [
                {
                    text: "Cancel",
                    onPress: () => router.replace(`${message}`)
                },
            ]
          )
          
    
        } catch (error) {
          console.error('Error: Failed ', error)
          
        }
      }


    return (
        <ThemedView style={globalStyles.container}>
            <ThemedView style={globalStyles.container}>
                <ThemedText>Forgot password?</ThemedText>
                <ThemedTextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {errorMessage ? (
                    <ThemedText
                        style={globalStyles.errorText}
                    >
                        {errorMessage}
                    </ThemedText>
                ) : null}
                <ThemedText>Enter your email address to receive a link to reset your password.</ThemedText>

            </ThemedView>
            <ThemedView >
                <ThemedButton
                    text="NEXT"
                    disabled={!email}
                    onPress={()=>{handleforgotpassword()}}
                />
            </ThemedView>
        </ThemedView>
    )
}

export default Forgot; 
