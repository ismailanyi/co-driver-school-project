import { View, Text } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/themed-button";
import { Stack } from "expo-router";
import { useState } from "react";

const Schools = () => {
  const [code, setCode] = useState("");

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerTitleAlign: "center",
          headerTitle: () => (
            <Text className="text-gray-400 text-lg font-semibold" style={{ fontFamily: "Nunito" }}>
              Duolingo for Schools
            </Text>
          ),
        }}
      />
      <ThemedView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 20, alignItems: "center", backgroundColor: 'transparent' }}>
          <View style={{ width: "100%", maxWidth: 400, marginTop: 40, gap: 20, backgroundColor: 'transparent' }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
              Join a classroom
            </Text>
            <Text style={{ fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 20 }}>
              Enter the code shared by your instructor! This lets your instructor see your progress.
            </Text>
            
            <ThemedTextInput
              placeholder="Classroom Code"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              style={{ textAlign: "center", fontSize: 18, paddingVertical: 12 }}
            />

            <ThemedButton
              text="Join Classroom"
              onPress={() => {
                console.log("Joining classroom with code:", code);
              }}
              disabled={!code.trim()}
            />
          </View>
        </View>
      </ThemedView>
    </>
  );
};

export default Schools;