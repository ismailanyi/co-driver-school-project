import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { globalStyles } from "@/constants/globalStyles";
import { Image } from "expo-image";

const mtb = () => {
  return (
    <ThemedView style={globalStyles.container}>
        <ThemedText>
            This screen will have The Model Town Board 2D scenarios. 
        </ThemedText>
        <ThemedText>
            Coming soon
        </ThemedText>
        <ThemedText>
             ---
        </ThemedText>

        <Image
            source={require("@/assets/MTB2.png")}
            contentFit="contain"
            style={{ width: "100%", height: 400 }}
        />
    </ThemedView>
  );
};

export default mtb;
