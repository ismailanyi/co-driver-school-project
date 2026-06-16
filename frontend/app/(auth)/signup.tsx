import React, { useState } from "react";
import { View, Pressable, KeyboardAvoidingView, Platform, ScrollView, TextInput } from "react-native";
import { router } from "expo-router";
import { X, ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/themed-button";
import { globalStyles } from "@/constants/globalStyles";
import { useAuthStore } from "@/store/useAuthStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/theme";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address.");
const phoneSchema = z.string().min(9, "Please enter a valid phone number.");
const passwordSchema = z.string()
  .min(7, "Password must be more than 6 characters.")
  .regex(/[A-Z]/, "Password must contain at least one capital letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol.");

const TOTAL_STEPS = 5;

const SignUpScreen = () => {
  const { signUp } = useAuthStore();
  const insets = useSafeAreaInsets();
  const { accent, foreground, mutedForeground, border, background } = useTheme();

  const [currentStep, setCurrentStep] = useState(1);
  const [signUpMethod, setSignUpMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    age: "",
    phone_number: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSignUp = async () => {
    setError(null);
    setIsSubmitting(true);
    // Determine which identifier to send
    const payload = {
      ...formData,
      // Pass null for the method they didn't choose
      phone_number: signUpMethod === 'phone' ? formData.phone_number : null,
      email: signUpMethod === 'email' ? formData.email : null,
    };
    
    // We expect the store action to handle the rest
    const res = await signUp(payload);
    setIsSubmitting(false);
    
    if (res.success) {
      // Typically on signup success, if auto-logged in, it pushes to /explore or index.
      // But based on previous code: router.replace('/signin');
      router.replace('/signin');
    } else {
      setError(res.message || "Sign up failed");
    }
  };

  const progressPercentage = Math.min((currentStep / TOTAL_STEPS) * 100, 100);

  // Renders the specific step's content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 40 }}>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
              How old are you?
            </ThemedText>
            <ThemedTextInput
              placeholder="Age"
              keyboardType="number-pad"
              value={formData.age}
              onChangeText={(text) => updateField("age", text)}
            />
            <ThemedButton
              text="CONTINUE"
              style={[globalStyles.submitButton, { marginTop: 20 }, !formData.age && globalStyles.disabledButton]}
              disabled={!formData.age}
              onPress={handleNext}
              textStyle={globalStyles.submitButtonText}
            />
          </View>
        );
      case 2:
        return (
          <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 40 }}>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
              Choose a sign up option
            </ThemedText>
            <ThemedButton
              text="Email"
              style={[globalStyles.submitButton, { marginBottom: 15 }]}
              textStyle={globalStyles.submitButtonText}
              onPress={() => {
                setSignUpMethod('email');
                handleNext();
              }}
            />
            <ThemedButton
              text="Phone Number"
              style={globalStyles.submitButton}
              textStyle={globalStyles.submitButtonText}
              onPress={() => {
                setSignUpMethod('phone');
                handleNext();
              }}
            />
          </View>
        );
      case 3:
        let identifierError = null;
        let isIdentifierValid = false;
        if (signUpMethod === 'email') {
          const res = emailSchema.safeParse(formData.email);
          if (formData.email.length > 0 && !res.success) {
            identifierError = res.error?.issues?.[0]?.message || "Invalid input";
          }
          isIdentifierValid = res.success;
        } else {
          const res = phoneSchema.safeParse(formData.phone_number);
          if (formData.phone_number.length > 0 && !res.success) {
            identifierError = res.error?.issues?.[0]?.message || "Invalid input";
          }
          isIdentifierValid = res.success;
        }

        return (
          <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 40 }}>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
              {signUpMethod === 'email' ? "What is your email address?" : "What is your phone number?"}
            </ThemedText>
            <ThemedTextInput
              placeholder={signUpMethod === 'email' ? "Email" : "Phone Number"}
              keyboardType={signUpMethod === 'email' ? "email-address" : "phone-pad"}
              autoCapitalize="none"
              value={signUpMethod === 'email' ? formData.email : formData.phone_number}
              onChangeText={(text) => updateField(signUpMethod === 'email' ? "email" : "phone_number", text)}
            />
            {identifierError && (
              <ThemedText style={{ color: 'red', marginTop: 5, marginBottom: 5, textAlign: 'center' }}>
                {identifierError}
              </ThemedText>
            )}
            <ThemedButton
              text="CONTINUE"
              style={[
                globalStyles.submitButton, 
                { marginTop: identifierError ? 10 : 20 }, 
                !isIdentifierValid && globalStyles.disabledButton
              ]}
              disabled={!isIdentifierValid}
              onPress={handleNext}
              textStyle={globalStyles.submitButtonText}
            />
          </View>
        );
      case 4:
        let pwdError = null;
        let isPwdValid = false;
        const pwdRes = passwordSchema.safeParse(formData.password);
        if (formData.password.length > 0 && !pwdRes.success) {
          pwdError = pwdRes.error?.issues?.[0]?.message || "Invalid input";
        }
        isPwdValid = pwdRes.success;

        return (
          <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 40 }}>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
              Create a password
            </ThemedText>
            <View style={{ position: 'relative' }}>
              <ThemedTextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => updateField("password", text)}
              />
              <Pressable
                style={{ position: 'absolute', right: 15, top: 15 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff color={mutedForeground} /> : <Eye color={mutedForeground} />}
              </Pressable>
            </View>
            {pwdError && (
              <ThemedText style={{ color: 'red', marginTop: 5, marginBottom: 5, textAlign: 'center' }}>
                {pwdError}
              </ThemedText>
            )}
            <ThemedButton
              text="CONTINUE"
              style={[globalStyles.submitButton, { marginTop: pwdError ? 10 : 20 }, !isPwdValid && globalStyles.disabledButton]}
              disabled={!isPwdValid}
              onPress={handleNext}
              textStyle={globalStyles.submitButtonText}
            />
          </View>
        );
      case 5:
        return (
          <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 40 }}>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
              What is your name?
            </ThemedText>

            <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                    <ThemedTextInput 
                        placeholder="First Name"
                        value={formData.first_name} 
                        onChangeText={(text) => updateField("first_name", text)}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedTextInput 
                        placeholder="Last Name"
                        value={formData.last_name} 
                        onChangeText={(text) => updateField("last_name", text)}
                    />
                </View>
            </View>
            
            <ThemedButton
              text="CREATE PROFILE"
              loading={isSubmitting}
              style={[globalStyles.submitButton, { marginTop: 20 }, (!formData.first_name || !formData.last_name) && globalStyles.disabledButton]}
              disabled={!formData.first_name || !formData.last_name}
              onPress={handleSignUp}
              textStyle={globalStyles.submitButtonText}
            />
            {error && (
              <ThemedText style={{ color: 'red', marginTop: 15, textAlign: 'center' }}>
                {error}
              </ThemedText>
            )}
            <ThemedText style={{ color: mutedForeground, marginTop: 15, textAlign: 'center', fontSize: 12 }}>
              By signing up for Co-Driver, you agree to our Terms and Privacy policy.
            </ThemedText>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ThemedView style={{ flex: 1, paddingTop: insets.top }}>
      {/* Header matching question-screen */}
      <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, width: "100%", alignItems: 'center', gap: 15 }}>
        <Pressable onPress={handleBack}>
          {currentStep === 1 ? (
            <X color={mutedForeground} size={28} />
          ) : (
            <ArrowLeft color={mutedForeground} size={28} />
          )}
        </Pressable>
        <View style={{ flex: 1, height: 16, backgroundColor: accent, borderRadius: 16, position: 'relative' }}>
          <View style={{ position: 'absolute', width: `${progressPercentage}%`, height: '100%', backgroundColor: foreground, borderRadius: 16 }} />
        </View>
        {/* Empty view to balance the header (where the hearts usually are) */}
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default SignUpScreen;
