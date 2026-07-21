import { useState } from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/themed-button";
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ToastAndroid, Platform } from "react-native";
import { globalStyles } from "@/constants/globalStyles";
import { useAuthStore } from "@/store/useAuthStore";

const Otp = () => {
    const { email } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const { verifyOtp, forgotPassword, isLoading } = useAuthStore();

    const handleVerify = async () => {
        if (!email) {
            setErrorMessage("Email is missing. Please request a new OTP.");
            return;
        }
        
        setErrorMessage('');
        const res = await verifyOtp(email as string, otp);
        
        if (!res.success) {
            setErrorMessage(res.message || "Invalid or expired OTP");
            return;
        }

        router.push('/change-password');
    }

    const handleResend = async () => {
        if (!email) return;
        setErrorMessage('');
        const res = await forgotPassword(email as string);
        if (res.success) {
            if (Platform.OS === 'android') {
                ToastAndroid.show("OTP resent successfully", ToastAndroid.SHORT);
            } else {
                Alert.alert("Success", "OTP resent successfully");
            }
        } else {
            setErrorMessage(res.message || "Failed to resend OTP");
        }
    }

    return (
        <ThemedView style={globalStyles.container}>
            <ThemedView style={globalStyles.container}>
                <ThemedText style={globalStyles.text}>Enter OTP</ThemedText>
                <ThemedText>We sent a 4-digit code to {email}</ThemedText>
                
                <ThemedTextInput
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={4}
                />
                
                {errorMessage ? (
                    <ThemedText style={globalStyles.errorText}>
                        {errorMessage}
                    </ThemedText>
                ) : null}
            </ThemedView>
            
            <ThemedView>
                <ThemedButton
                    text="VERIFY"
                    disabled={otp.length !== 4 || isLoading}
                    onPress={handleVerify}
                />
                
                <ThemedText 
                    style={{ ...globalStyles.forgotPasswordText, marginTop: 20, textAlign: 'center' }}
                    onPress={handleResend}
                >
                    Didn't receive the code? Resend OTP
                </ThemedText>
            </ThemedView>
        </ThemedView>
    )
}

export default Otp;
