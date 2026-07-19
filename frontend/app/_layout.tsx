// import { DarkTheme, DefaultTheme } from '@react-navigation/native';
// import { useColorScheme } from '@/hooks/use-color-scheme';
import { BreakpointsProvider } from "@/context/breakpoints";
import { ThemeProvider } from "@/context/theme";
import { useCourse } from '@/store/useCourseStore';
import { useCourseCode } from "@/store/useLanguageStore";
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { StrictMode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import { View, Text, LogBox } from "react-native";
import "../global.css";

LogBox.ignoreLogs(["Popover Warning - Can't Show"]);

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes("Popover Warning - Can't Show")) {
    return;
  }
  originalWarn(...args);
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const { initializeLanguage, isInitialized: isInitialisedLanguageCode } = useCourseCode();
  const { isInitialized: isInitialisedCourse, initializeCourse} = useCourse();

  const segments = useSegments();
  const router = useRouter();
  const token = useAuthStore(state => state.token);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const getToken = useAuthStore(state => state.getToken);

  useEffect(() => {
    initializeLanguage();
    initializeCourse();
  }, [initializeLanguage, initializeCourse]);

  useEffect(() => {
    const initAuth = async () => {
      await getToken();
      setIsAuthInitialized(true);
    };
    initAuth();
  }, [getToken]);

  useEffect(() => {
    if (!isInitialisedCourse || !isInitialisedLanguageCode || !isAuthInitialized) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const isLandingPage = (segments as string[]).length === 0 || ((segments as string[]).length === 1 && segments[0] === '(tabs)');

    if (!token && !inAuthGroup && !isLandingPage) {
      // Redirect to sign-in if not logged in and trying to access a protected page
      router.replace('/signin');
    } else if (token && inAuthGroup) {
      // Redirect to learn if logged in and trying to access auth pages
      router.replace('/learn');
    }
  }, [token, isAuthInitialized, isInitialisedCourse, isInitialisedLanguageCode, segments]);

  if (!isInitialisedCourse || !isInitialisedLanguageCode || !isAuthInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Co-Driver...</Text>
      </View>
    ); // Or return null
  }

  return (
    <StrictMode>
      <GestureHandlerRootView style={{flex: 1 }}>
        <ThemeProvider>
          <BreakpointsProvider>
            <Stack screenOptions={{headerShown: false}}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name='profile' options={{ headerShown: true }} />
              {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
            </Stack>
            <StatusBar style="auto" />
          </BreakpointsProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </StrictMode>
  );
}
