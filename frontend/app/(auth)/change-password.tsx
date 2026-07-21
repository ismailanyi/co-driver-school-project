import { useState, useEffect } from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedButton } from "@/components/themed-button";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { router } from 'expo-router'
import { globalStyles } from "@/constants/globalStyles";
import { useAuthStore } from "@/store/useAuthStore";

const ChangePassword = () => {
    const { verifiedResetRequest, resetPassword, isLoading } = useAuthStore();
    
    useEffect(() => {
        if (!verifiedResetRequest) {
            router.replace('/forgot');
        }
    }, [verifiedResetRequest]);

    const [formData, setFormData ] = useState({
        password: '',
        confirm_password: ''
    })
    const [touched, setTouched] = useState({
        password: false, 
        confirm_password: false, 
    })
    const [errorMessage, setErrorMessage] = useState('');

    const handlereset = async () => {
        setErrorMessage('');
        const res = await resetPassword({ password: formData.password });
        if (res.success) {
            router.replace('/signin');
        } else {
            console.error('Error occurred: ', res.message);
            setErrorMessage(res.message || "Failed to reset password");
        }
    }

    if (!verifiedResetRequest) return null;

    const passStartMatch = formData.password.startsWith(formData.confirm_password);
    const passMatch = formData.password === formData.confirm_password;
    const confirmPassEmpty = formData.confirm_password.length === 0;
    const isFinalError = (touched.confirm_password || touched.password) && !passMatch;
    const showError = !confirmPassEmpty && (!passStartMatch || isFinalError);

    const updateField = (key: string, value: string) => {
        setFormData((prev) => ({...prev, [key]: value}))
        if(key === 'password') {
            setTouched((prev) => ({...prev, confirm_password: false}))
        } else if (key === 'confirm_password') {
            setTouched((prev) => ({...prev, password: false}))
        }
    }

    return (
        <ThemedView style={globalStyles.container}>
            <ThemedView style={globalStyles.container}>
                <ThemedText style={globalStyles.text}>
                    Change your password
                </ThemedText>
                
                <ThemedText style={{marginBottom: 20}}>
                    For {verifiedResetRequest.email}
                </ThemedText>

                <ThemedTextInput
                    placeholder='New password'
                    value={formData.password}
                    onChangeText={(text) => updateField('password', text)}
                    onBlur={() => setTouched({...touched, password: true})}
                    secureTextEntry
                />
                
                {showError ? <ThemedText style={globalStyles.errorText}>{"Passwords Don't Match"}</ThemedText> : null }
                
                <ThemedTextInput
                    placeholder='Confirm new password'
                    value={formData.confirm_password}
                    onChangeText={(text) => updateField('confirm_password', text)}
                    onBlur={() => setTouched({...touched, confirm_password: true})}
                    secureTextEntry
                />
                
                {errorMessage ? (
                    <ThemedText style={globalStyles.errorText}>
                        {errorMessage}
                    </ThemedText>
                ) : null}
            </ThemedView>
            
            <ThemedView>
                <ThemedButton
                    text="RESET PASSWORD"
                    disabled={!formData.password || !passMatch || isLoading}
                    onPress={() => handlereset()}
                />
            </ThemedView>
        </ThemedView>
    )
}

export default ChangePassword;
