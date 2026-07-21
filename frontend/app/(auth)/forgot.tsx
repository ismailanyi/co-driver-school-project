import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/themed-button";
import { useState } from "react";
import { router } from 'expo-router';
import { Alert, ToastAndroid, Platform } from "react-native";
import { globalStyles } from "@/constants/globalStyles";
import { useAuthStore } from "@/store/useAuthStore";

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);

      const { forgotPassword } = useAuthStore();

      const handleforgotpassword = async () => {
        setErrorMessage('');
        
        const res = await forgotPassword(email);
        
        if (!res.success) {
          console.error('Forgot Password Request Failed:', res.message);
          setErrorMessage(res.message || "There's no Co-Driver account with this email address");
          return;
        }

        console.log('Success: ', res.message);
        setOtpSent(true);

        if (Platform.OS === 'android') {
            ToastAndroid.show("OTP sent successfully", ToastAndroid.SHORT);
        } else {
            Alert.alert("Success", "OTP sent successfully");
        }
      }


    return (
        <ThemedView style={globalStyles.container}>
            <ThemedView style={globalStyles.container}>
                <ThemedText>Forgot password?</ThemedText>
                <ThemedTextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text.toLowerCase());
                        setOtpSent(false);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!otpSent}
                />
                {errorMessage ? (
                    <ThemedText
                        style={globalStyles.errorText}
                    >
                        {errorMessage}
                    </ThemedText>
                ) : null}
                <ThemedText>Enter your email address to receive a 4-digit OTP to reset your password.</ThemedText>

            </ThemedView>
            <ThemedView >
                {!otpSent ? (
                    <ThemedButton
                        text="SEND OTP"
                        disabled={!email}
                        onPress={()=>{handleforgotpassword()}}
                    />
                ) : (
                    <>
                        <ThemedButton
                            text="GO TO OTP PAGE"
                            onPress={() => router.push({ pathname: '/otp', params: { email } })}
                        />
                        <ThemedText 
                            style={{ ...globalStyles.forgotPasswordText, marginTop: 20, textAlign: 'center' }}
                            onPress={()=>{handleforgotpassword()}}
                        >
                            Didn't receive the code? Resend OTP
                        </ThemedText>
                    </>
                )}
            </ThemedView>
        </ThemedView>
    )
}

export default Forgot; 
