import { Stack, router } from "expo-router";
import { Pressable } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "@/context/theme";

const AuthLayout = () => {
    const { foreground } = useTheme();

    return(
        <Stack 
            screenOptions={{
                headerShown: true,
                headerTitle: '',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: 'transparent' },
                headerLeft: () => (
                    <Pressable 
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/');
                            }
                        }} 
                        style={{ padding: 8, marginLeft: -8 }}
                    >
                        <ArrowLeft color={foreground} size={24} />
                    </Pressable>
                )
            }}
        >
            <Stack.Screen name="signin" />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>
    )
}

export default AuthLayout;
