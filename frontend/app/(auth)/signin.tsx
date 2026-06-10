import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { globalStyles } from "@/constants/globalStyles";
import axios, { isAxiosError } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Platform } from "react-native";
import { View, type ViewProps } from 'react-native';

const SignInScreen = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrorMessage("");
  };

  const handleSignIn = async () => {
    setErrorMessage("");
    try {
      console.log("Here is the expo link: ", process.env.EXPO_PUBLIC_API_URL);
      const api = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
      });
      const response = await api.post("/auth/signin", formData);

      const { message, token } = await response.data;

      if (Platform.OS === "web") {
        localStorage.setItem("userToken", token);
      } else {
        await SecureStore.setItemAsync("userToken", token);
      }

      console.log("Success: ", message);
      router.replace("/learn");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // This grabs the { message: 'Invalid Credentials' } from your backend
        const backendMessage = error.response.data.message;
        console.error("Login Failed:", backendMessage);
        setErrorMessage(backendMessage);
      } else {
        console.error("Error: Failed ", error);
        setErrorMessage("Network error or server is down.");
      }
    }
  };
  // Theme

  return (
    <ThemedView style={[globalStyles.container, { alignItems: 'center'}]}>
      <ThemedText type="title" style={{ marginBottom: 20, fontSize: 20 }}>
        Enter your details
      </ThemedText>
      {errorMessage ? (
        <ThemedText style={{ color: "red", marginBottom: 10 }}>
          {errorMessage}
        </ThemedText>
      ) : null}
        <View style={{ gap: 0, marginBottom: 10, width: '100%', paddingHorizontal: '2%'  }}>
          <ThemedTextInput
            placeholder="Email, Phone or username"
            value={formData.identifier}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => updateField("identifier", text)}
          />
          <ThemedTextInput
            placeholder="password"
            value={formData.password}
            autoCapitalize="none"
            onChangeText={(text) => updateField("password", text)}
            secureTextEntry
          />
          <ThemedButton
            text="FORGOT PASSWORD"
            style={globalStyles.forgotPasswordContainer}
            textStyle={globalStyles.forgotPasswordText}
            onPress={() => {
              router.push("/forgot");
            }}
          />
        </View>
      <View style={{ width: '100%', paddingHorizontal: '2%'}}>
        <ThemedButton
          text="Sign In"
          onPress={() => handleSignIn()}
          disabled={!formData.identifier || !formData.password}
        />
      </View>
    </ThemedView>
  );
};

export default SignInScreen;
