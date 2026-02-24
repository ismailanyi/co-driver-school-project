import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/themed-button";
import { useState } from "react";

const Forgot = () => {
    const [email, setEmail] = useState('');
    return (
        <ThemedView style={style.container}>
            <ThemedView style={style.container}>
                <ThemedText>Forgot password?</ThemedText>
                <ThemedTextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <ThemedText>Enter your email address to receive a link to reset your password.</ThemedText>

            </ThemedView>
            <ThemedView >
                <ThemedButton
                    title="NEXT"
                    disabled={!email}
                    onPress={()=>{}}
                />
            </ThemedView>
        </ThemedView>
    )
}

export default Forgot; 

const style = StyleSheet.create({
    container: {
        flex: 1
    }
})