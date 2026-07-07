import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Keyboard, Alert } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/themed-button";
import { Stack, router } from "expo-router";
import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useTheme } from "@/context/theme";

const Schools = () => {
  const { background, foreground, border, mutedForeground, muted } = useTheme();
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);
  const { linkSchool, isLoading, user: userData } = useAuthStore();
  const { removeInstructor } = useProfileStore();

  const isSubmitDisabled = code.length < 6 || isLoading;

  const handleRemoveInstructor = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure? You will lose all benefits associated with this driving school.")) {
        removeInstructor();
      }
    } else {
      Alert.alert(
        "Are you sure?",
        "You will lose all benefits associated with this driving school.",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Remove", 
                style: "destructive",
                onPress: async () => {
                    await removeInstructor();
                }
            }
        ]
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerTitleAlign: "center",
          headerTitle: () => (
            <Text className="text-gray-400 text-lg font-semibold" style={{ fontFamily: "Nunito" }}>
              Co-Driver for Driving Schools
            </Text>
          ),
        }}
      />
      <ThemedView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, padding: 20, alignItems: "center", backgroundColor: 'transparent' }}>
              
              {userData?.school_code ? (
                  <View style={{ width: '100%', maxWidth: 400, marginTop: 40, alignItems: 'center', backgroundColor: background, padding: 20, borderRadius: 10, borderWidth: 1, borderColor: border }}>
                      <Text style={{ fontSize: 16, color: foreground, marginBottom: 5 }}>You are currently enrolled in:</Text>
                      <Text style={{ fontSize: 24, color: '#10b981', fontWeight: 'bold', marginBottom: 20 }}>
                          {userData.school_code}
                      </Text>
                      <ThemedButton
                          text="Remove Driving School"
                          onPress={handleRemoveInstructor}
                          style={{ backgroundColor: '#ef4444', width: '100%', borderBottomColor: '#b91c1c' }}
                          textStyle={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}
                      />
                  </View>
              ) : (
                <View style={{ width: "100%", maxWidth: 400, marginTop: 40, gap: 20, backgroundColor: 'transparent' }}>
                  <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", color: foreground }}>
                    Join a driving school
                  </Text>
                  <Text style={{ fontSize: 16, color: mutedForeground, textAlign: "center", marginBottom: 20 }}>
                    Enter the code shared by your instructor! This lets your instructor see your progress.
                  </Text>
                  
                  <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }} onPress={() => inputRef.current?.focus()}>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <View key={index} style={{ 
                        width: 45, 
                        height: 55, 
                        borderWidth: 2, 
                        borderColor: code.length === index ? '#1cb0f6' : border,
                        borderRadius: 12, 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: background
                      }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: foreground }}>
                          {code[index] || ''}
                        </Text>
                      </View>
                    ))}
                    <TextInput
                      ref={inputRef}
                      value={code}
                      onChangeText={(text) => setCode(text.toUpperCase())}
                      maxLength={6}
                      style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%' }}
                      autoCapitalize="characters"
                      autoCorrect={false}
                    />
                  </Pressable>

                  <ThemedButton
                    text={isLoading ? "SUBMITTING..." : "SUBMIT"}
                    onPress={async () => {
                      const success = await linkSchool(code);
                      if (success) {
                        if (Platform.OS !== 'web') Alert.alert("Success", "Successfully joined driving school!");
                        setCode(""); // clear code
                      } else {
                        if (Platform.OS !== 'web') Alert.alert("Failed", useAuthStore.getState().error || "Failed to join driving school.");
                        else window.alert(useAuthStore.getState().error || "Failed to join driving school.");
                      }
                    }}
                    disabled={isSubmitDisabled}
                    style={[
                      { 
                        paddingVertical: 15,
                        borderRadius: 15,
                        width: '100%',
                      },
                      !isSubmitDisabled && {
                        backgroundColor: '#1cb0f6',
                        borderBottomWidth: 4,
                        borderBottomColor: '#1899d6',
                      }
                    ]}
                    textStyle={{ fontSize: 16, color: isSubmitDisabled ? '#9ca3af' : 'white', fontWeight: 'bold', letterSpacing: 1 }}
                  />
                </View>
              )}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </ThemedView>
    </>
  );
};

export default Schools;
