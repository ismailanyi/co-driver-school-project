import { Stack } from "expo-router";

const AuthLayout = () => {
    return(
        <Stack 
            screenOptions={{
                headerShown: true,
                headerTitle: '',
                headerBackTitleVisible: false
            }}
        >
            <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>

    )

}

export default AuthLayout