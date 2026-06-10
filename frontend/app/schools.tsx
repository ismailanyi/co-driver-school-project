import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/themed-button";
import { Stack, router } from "expo-router";
import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const Schools = () => {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);
  const { linkSchool, isLoading } = useAuthStore();

  const isSubmitDisabled = code.length < 6 || isLoading;

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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, padding: 20, alignItems: "center", backgroundColor: 'transparent' }}>
              <View style={{ width: "100%", maxWidth: 400, marginTop: 40, gap: 20, backgroundColor: 'transparent' }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
                  Join a driving school
                </Text>
                <Text style={{ fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 20 }}>
                  Enter the code shared by your instructor! This lets your instructor see your progress.
                </Text>
                
                <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }} onPress={() => inputRef.current?.focus()}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <View key={index} style={{ 
                      width: 45, 
                      height: 55, 
                      borderWidth: 2, 
                      borderColor: code.length === index ? '#1cb0f6' : '#e5e7eb',
                      borderRadius: 12, 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      backgroundColor: '#f3f4f6'
                    }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4b5563' }}>
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
                      Alert.alert("Success", "Successfully joined driving school!");
                      router.back();
                    } else {
                      Alert.alert("Failed", useAuthStore.getState().error || "Failed to join driving school.");
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
                  textStyle={{ fontSize: 16, color: isSubmitDisabled ? '#9ca3af' : 'black', fontWeight: 'bold', letterSpacing: 1 }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ThemedView>
    </>
  );
};

export default Schools;
