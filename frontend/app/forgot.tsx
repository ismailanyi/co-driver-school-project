import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/themed-button";
import { useState } from "react";
import { router } from 'expo-router';


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
          
          console.log('Success: ', message);
          router.replace('/signin')
          
    
        } catch (error) {
          console.error('Error: Failed ', error)
          
        }
      }


    return (
        <ThemedView style={style.container}>
            <ThemedView style={style.container}>
                <ThemedText>Forgot password?</ThemedText>
                <ThemedTextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                {errorMessage && (
                    <ThemedText
                        style={style.errorText}
                    >
                        {errorMessage}
                    </ThemedText>
                )}
                <ThemedText>Enter your email address to receive a link to reset your password.</ThemedText>

            </ThemedView>
            <ThemedView >
                <ThemedButton
                    title="NEXT"
                    disabled={!email}
                    onPress={()=>{handleforgotpassword()}}
                />
            </ThemedView>
        </ThemedView>
    )
}

export default Forgot; 

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    errorText: {
        color: 'red',
    }
})