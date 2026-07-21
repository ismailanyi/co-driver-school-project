import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';
import { useAuthStore } from '@/store/useAuthStore';
import { useCourseStore } from '@/store/useCourseStore';
import { DEFAULT_COURSE_PROGRESS } from '@/constants/default';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/theme';

export default function SettingsScreen() {
    const { background, foreground, border, mutedForeground } = useTheme();

    const handleSignOut = async () => {
        try {
          if (Platform.OS === "web") {
            localStorage.removeItem("userToken");
          } else {
            await SecureStore.deleteItemAsync("userToken");
          }
          useAuthStore.getState().setUser(null);
          useAuthStore.getState().setToken(null);
          useCourseStore.setState({ courseProgress: DEFAULT_COURSE_PROGRESS });
          router.replace("/"); 
        } catch (error) {
          console.error("Error signing out: ", error);
        }
    };

    return (
        <>
            <Stack.Screen 
                options={{
                    headerShown: true,
                    headerTitle: "Settings",
                    headerRight: () => (
                        <Pressable onPress={() => router.push('/profile')} style={{ marginRight: 15 }}>
                            <Text style={{ color: '#1cb0f6', fontSize: 16, fontWeight: 'bold' }}>
                                Done
                            </Text>
                        </Pressable>
                    )
                }}
            />
            <ThemedView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: mutedForeground, marginBottom: 15 }}>Account</Text>
                    
                    <View style={{ backgroundColor: background, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: border, marginBottom: 30 }}>
                        <Pressable 
                            onPress={() => router.push('/edit-profile')}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: foreground }}>Profile Settings</Text>
                            <MaterialIcons name="chevron-right" size={24} color={mutedForeground} />
                        </Pressable>

                        <View style={{ height: 1, backgroundColor: border }} />

                        <Pressable 
                            onPress={() => router.push('/schools')}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}
                        >

                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: foreground }}>Co-Driver for Driving Schools</Text>
                            <MaterialIcons name="chevron-right" size={24} color={mutedForeground} />
                        </Pressable>
                    </View>



                    <ThemedButton
                        text="Sign Out"
                        onPress={handleSignOut}
                        style={{ backgroundColor: '#ff4444', width: '100%', paddingVertical: 12, borderBottomColor: '#dc2626' }}
                        textStyle={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}
                    />

                </ScrollView>
            </ThemedView>
        </>
    );
}
