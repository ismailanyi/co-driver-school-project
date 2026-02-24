import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/themed-button";
import { useRouter } from 'expo-router'
import { StyleSheet } from "react-native";

const HomeScreen = () => {
    const router = useRouter();
    return (
        <ThemedView style={style.container}>
            <ThemedView style={style.textcontainer}>
                <ThemedText style={style.title}>
                    Co-Driver
                </ThemedText>
                <ThemedText>
                    Learn to drive, easily.
                </ThemedText>
            </ThemedView>
            <ThemedView>
                <ThemedButton
                    title="Get started"
                    onPress={() => {router.push('/signup')}}
                />
                <ThemedButton
                    title="I already Have an account"
                    onPress={() => {router.push('/signin')}}
                />
            </ThemedView>
        </ThemedView>
    )
}

export default HomeScreen;
const style = StyleSheet.create ({
    container: {
        flex: 1,
        padding: 10
    },
    title: {
        color: 'green',
        alignItems: 'center'
    },
    normal: {
        color: 'gray'
    },
    textcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }

})