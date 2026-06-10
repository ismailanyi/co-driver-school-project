import { View } from "@/components/themed"
import { ThemedButton } from "@/components/themed-button"
import { Platform, Text } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { router, Stack } from 'expo-router';
import { ThemedView } from "@/components/themed-view";
import { MobileTabsBar } from "@/components/layouts/mobile-tabs-bar";
import { courseConfig } from "@/config/course";
import { useBreakpoint } from "@/context/breakpoints";

const Profile = () => {
    const breakpoint = useBreakpoint();

    const handleSignOut = async () => {
        try {
          // 1. Remove the token based on the platform
          if (Platform.OS === "web") {
            localStorage.removeItem("userToken");
          } else {
            await SecureStore.deleteItemAsync("userToken");
          }
          
          // 2. Redirect back to the sign-in screen (adjust the route if needed)
          router.replace("/"); 
          
        } catch (error) {
          console.error("Error signing out: ", error);
        }
    };

    return(
        <>
          <Stack.Screen 
            options={{
              headerShown: true,
              headerBackVisible: false,
              headerLeft: () => null,
              headerTitleAlign: "center",
              headerTitle: () => (
                <Text className="text-gray-400 text-lg font-semibold" style={{ fontFamily: 'Nunito' }}>
                  Settings
                </Text>
              )
            }}
          />
          <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{  marginBottom: 10, width: '50%', justifyContent: 'center'  }}>
                <ThemedButton
                    text="Sign Out"
                    onPress={handleSignOut}
                    style={{ 
                    backgroundColor: '#ff4444', 
                    paddingVertical: 6, 
                    paddingHorizontal: 12, 
                    borderRadius: 8 
                    }}
                    textStyle={{ fontSize: 12, color: 'white' }}
                />
            </View>
          </ThemedView>
          {breakpoint === "sm" && (
            <MobileTabsBar navItems={courseConfig.mobileNavItems} />
          )}
        </>
    )
}

export default Profile