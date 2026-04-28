import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';
import { globalStyles } from '@/constants/globalStyles';
import { Platform } from 'react-native';
import * as SecureStore from "expo-secure-store";
import Popover from "react-native-popover-view/dist/Popover";
  

const home = () => {
  const Lessons = [
    {id: 'theory', Label: 'Theory', router: '/theory'},
    {id: 'signs', Label: 'Road Signs', router: '/signs'},
    {id: 'mtb', Label: 'MTB (Model Town Board)', router: '/mtb'}
  ] as const

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

  return (
    
    <ThemedView style={globalStyles.container}>
      {Lessons.map((lesson) => (
        <ThemedButton
          key={lesson.id}
          text={lesson.Label}
          textStyle={globalStyles.homeTextStyle}
          style={globalStyles.homeButtonsStyles}
          onPress = {() => {router.push(lesson.router)}}
        />
      ))}
      
      <ThemedView style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
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
      </ThemedView>
    </ThemedView>
  );
}

export default home;