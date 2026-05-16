import { useState } from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedButton } from "@/components/themed-button";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { StyleSheet } from "react-native";
import { router, useLocalSearchParams } from 'expo-router'
import { globalStyles } from "@/constants/globalStyles";

const Reset = () => {
    const [formData, setFormData ] = useState({
        password: '',
        confirm_password: ''
    })
    const [touched, setTouched] = useState({
        password: false, 
        confirm_password: false, 
    })
    const { token } = useLocalSearchParams()

    const handlereset = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: formData.password,
                    token: token
                })

            })

            if (response.ok) {
                router.replace('/signin')
            }
        } catch (error) {
            console.error('Error occurred: ', error)
        }
    }

    // const formfilled = Object.values(formData).every((value) => (value.trim() !== ''));
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
        <ThemedView>
            <ThemedText
            style= {globalStyles.text}>
                Reset your password
            </ThemedText>
            <ThemedTextInput
                placeholder='New password'
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                onBlur={() => setTouched({...touched, password: true})}
                secureTextEntry
            />
            {showError ? <ThemedText>{"Passwords Don't Match"}</ThemedText> : null }
            <ThemedTextInput
                placeholder='Confirm new password'
                value={formData.confirm_password}
                onChangeText={(text) => updateField('confirm_password', text)}
                onBlur={() => setTouched({...touched, confirm_password: true})}
                secureTextEntry
            />
            <ThemedView style={[globalStyles.submitContainer, {marginLeft: 50, marginRight: 50}]}>
                <ThemedButton
                    text="Reset Password"
                    style={globalStyles.submitButton}
                    disabled = {!formData.password || !formData.confirm_password}
                    onPress={() => handlereset()}
                />

            </ThemedView>
        </ThemedView>
    )

}

export default Reset;