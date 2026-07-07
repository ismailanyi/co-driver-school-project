import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/themed-button";
import { useState } from "react";
import { router } from 'expo-router';
import { Alert } from "react-native";
import { globalStyles } from "@/constants/globalStyles";
import { useAuthStore } from "@/store/useAuthStore";


const Forgot = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

      const { forgotPassword } = useAuthStore();

      const handleforgotpassword = async () => {
        setErrorMessage('');
        const res = await forgotPassword(email);
        
        if (!res.success) {
          console.error('Non existing Email', res.message);
          setErrorMessage(res.message || "There's no Co-Driver account with this email address");
          return;
        }

        console.log('Success: ', res.message);
        router.replace('/forgot');

        Alert.alert(
          "Success",
          "Email has been sent out",
          [
              {
                  text: "Cancel",
                  onPress: () => router.replace('/signin')
              },
          ]
        );
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
