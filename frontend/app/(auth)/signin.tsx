import { Eye, EyeOff } from "lucide-react-native";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { globalStyles } from "@/constants/globalStyles";
import { router } from "expo-router";
import { useState } from "react";
import { View, Pressable } from 'react-native';
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "@/context/theme";

const SignInScreen = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutedForeground } = useTheme();

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrorMessage("");
  };

  const { signIn } = useAuthStore();

  const handleSignIn = async () => {
    setErrorMessage("");
    const res = await signIn(formData);
    if (res.success) {
      router.replace("/learn");
    } else {
      setErrorMessage(res.message || "Sign in failed");
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
          <View style={{ position: 'relative' }}>
            <ThemedTextInput
              placeholder="password"
              value={formData.password}
              autoCapitalize="none"
              onChangeText={(text) => updateField("password", text)}
              secureTextEntry={!showPassword}
            />
            <Pressable
              style={{ position: 'absolute', right: 15, top: 15 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff color={mutedForeground} /> : <Eye color={mutedForeground} />}
            </Pressable>
          </View>
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
