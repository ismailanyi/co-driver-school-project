import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { ThemeProvider } from "@/context/theme";
import { Stack,  } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BreakpointsProvider } from "@/context/breakpoints";
import React, { StrictMode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <StrictMode>
      <GestureHandlerRootView style={{flex: 1 }}>
        <ThemeProvider>
          <BreakpointsProvider>
            <Stack screenOptions={{headerShown: false}}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name='profile' options={{ title: 'Go back to Home page',headerShown: true }} />
              {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
            </Stack>
            <StatusBar style="auto" />
          </BreakpointsProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </StrictMode>
  );
}
