import { View } from "@/components/themed"
import { ThemedButton } from "@/components/themed-button"
import { Platform } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { router } from 'expo-router';
import { ThemedView } from "@/components/themed-view";

const Profile = () => {
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
        </>
    )
}

export default Profile