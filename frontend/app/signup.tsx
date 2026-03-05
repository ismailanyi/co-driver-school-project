import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { globalStyles } from "@/constants/globalStyles";
import { useState } from "react";
import axios from "axios";

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [touched, setTouched] = useState({
    password: false,
    confirm_password: false,
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "password") {
      setTouched((prev) => ({ ...prev, confirm_password: false }));
    } else if (key === "confirm_password") {
      setTouched((prev) => ({ ...prev, password: false }));
    }
  };

  const passStartMatch = formData.password.startsWith(
    formData.confirm_password,
  );
  const passMatch = formData.password === formData.confirm_password;
  const confirmPassEmpty = formData.confirm_password.length === 0;
  const isFinalError =
    (touched.confirm_password || touched.password) && !passMatch;

  const showError = !confirmPassEmpty && (!passStartMatch || isFinalError);

  const handleSignUp = async () => {
    try {
      const api = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL
      })
      const response = await api.post('/auth/register');

      const result = await response.data;
      console.log("Success: ", result);
    } catch (error) {
      console.error("Error: Failed ", error);
    }
  };
  // Theme

  return (
    <ThemedView style={globalStyles.container}>
      <ThemedText type="title">Create Account</ThemedText>
      <ThemedText>Current step: {currentStep}</ThemedText>

      {currentStep === 1 && (
        <ThemedView style={{ gap: 10 }}>
          <ThemedTextInput
            placeholder="First_name"
            value={formData.first_name}
            onChangeText={(text) => updateField("first_name", text)}
          />
          <ThemedTextInput
            placeholder="last_name"
            value={formData.last_name}
            onChangeText={(text) => updateField("last_name", text)}
          />
          <ThemedButton
            title="next"
            onPress={() => setCurrentStep(2)}
            disabled={!formData.first_name.length || !formData.last_name}
          />
        </ThemedView>
      )}

      {currentStep === 2 && (
        <ThemedView style={{ gap: 10 }}>
          <ThemedTextInput
            placeholder="phone_number"
            value={formData.phone_number}
            keyboardType="phone-pad"
            onChangeText={(text) => updateField("phone_number", text)}
          />
          <ThemedTextInput
            placeholder="email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => updateField("email", text)}
          />
          <ThemedButton
            title="Next"
            disabled={!formData.email || !formData.phone_number}
            onPress={() => setCurrentStep(3)}
          />
          <ThemedButton
            title="Back"
            style={{
              backgroundColor: "red",
            }}
            onPress={() => setCurrentStep(1)}
          />
        </ThemedView>
      )}
      {currentStep === 3 && (
        <ThemedView style={{ gap: 10 }}>
          <ThemedTextInput
            placeholder="password"
            value={formData.password}
            onChangeText={(text) => updateField("password", text)}
            onBlur={() => setTouched({ ...touched, password: true })}
            secureTextEntry
          />
          {showError ? (
            <ThemedText>{"Passwords Don't Match"}</ThemedText>
          ) : null}
          <ThemedTextInput
            placeholder="confirm_password"
            value={formData.confirm_password}
            onChangeText={(text) => updateField("confirm_password", text)}
            onBlur={() => setTouched({ ...touched, confirm_password: true })}
            secureTextEntry
          />
          {showError ? (
            <ThemedText>{"Passwords Don't Match"}</ThemedText>
          ) : null}
          <ThemedButton
            title="Back"
            style={{
              backgroundColor: "red",
            }}
            onPress={() => setCurrentStep(2)}
          />
          <ThemedButton
            title="Finish Sign Up"
            disabled={!formData.password || !formData.confirm_password}
            onPress={() => handleSignUp()}
          />
        </ThemedView>
      )}
      {/* <ThemedView>
        <ThemedText>
          By signing in to Co-Driver, you aree to our Terms and Privacy policy
        </ThemedText>
      </ThemedView> */}
    </ThemedView>
  );
};

export default SignUpScreen;
