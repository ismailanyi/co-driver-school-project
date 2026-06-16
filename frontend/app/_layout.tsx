// import { DarkTheme, DefaultTheme } from '@react-navigation/native';
// import { useColorScheme } from '@/hooks/use-color-scheme';
import { BreakpointsProvider } from "@/context/breakpoints";
import { ThemeProvider } from "@/context/theme";
import { useCourse } from '@/store/useCourseStore';
import { useCourseCode } from "@/store/useLanguageStore";
import { Stack, } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { StrictMode, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import { View, Text, LogBox } from "react-native";
import "../global.css";

LogBox.ignoreLogs(["Popover Warning - Can't Show"]);

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const { initializeLanguage, isInitialized: isInitialisedLanguageCode } = useCourseCode();
  const { isInitialized: isInitialisedCourse, initializeCourse} = useCourse();

  useEffect(() => {
    initializeLanguage();
    initializeCourse();
  }, [initializeLanguage, initializeCourse]);

  if (!isInitialisedCourse || !isInitialisedLanguageCode) {
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
