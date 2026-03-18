import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/themed-button";
import { router } from 'expo-router'
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { globalStyles } from "@/constants/globalStyles";

const HomeScreen = () => {
    const [ isChecking, setisChecking ] = useState(true);

    useEffect(() => {
        const checkUserToken = async () => {
            let token = null;
            
            if (Platform.OS === 'web') {
                token = await localStorage.getItem('userToken')
            } else {
                token = await SecureStore.getItemAsync('userToken')
            }

            if(token) {
                router.replace('/home')
            } else {
                setisChecking(false)
            }

        }
        checkUserToken();
    }, [])
    
    if (isChecking) {
        return <ThemedView style={globalStyles.container}/>
    }
    return (
        <ThemedView style={globalStyles.container}>
            <ThemedView style={globalStyles.textcontainer}>
                <ThemedText style={globalStyles.title}>
                    Co-Driver
                </ThemedText>
                <ThemedText>
                    Learn to drive, easily
                </ThemedText>
            </ThemedView>
            <ThemedView>
                <ThemedButton
                    text="Get started"
                    onPress={() => {router.push('/signup')}}
                />
                <ThemedButton
                    text="I already Have an account"
                    onPress={() => {router.push('/signin')}}
                />
            </ThemedView>
        </ThemedView>
    )
}

export default HomeScreen;