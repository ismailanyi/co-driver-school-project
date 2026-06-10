import { View } from "@/components/themed"
import { ThemedButton } from "@/components/themed-button"
import { Platform, Text, ActivityIndicator, ScrollView } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { router, Stack } from 'expo-router';
import { ThemedView } from "@/components/themed-view";
import { MobileTabsBar } from "@/components/layouts/mobile-tabs-bar";
import { courseConfig } from "@/config/course";
import { useBreakpoint } from "@/context/breakpoints";
import { useEffect, useState } from "react";
import axios from "axios";
import { ThemedTextInput } from "@/components/ThemedTextInput";

const Profile = () => {
    const breakpoint = useBreakpoint();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let token = null;
                if (Platform.OS === "web") {
                    token = localStorage.getItem("userToken");
                } else {
                    token = await SecureStore.getItemAsync("userToken");
                }

                if (token) {
                    const api = axios.create({
                        baseURL: process.env.EXPO_PUBLIC_API_URL,
                    });
                    const response = await api.get("/auth/me", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserData(response.data);
                    console.log("Fetched User Data:", response.data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSignOut = async () => {
        try {
          // 1. Remove the token based on the platform
          if (Platform.OS === "web") {
            localStorage.removeItem("userToken");
          } else {
            await SecureStore.deleteItemAsync("userToken");
          }
          
          // 2. Redirect back to the sign-in screen (adjust the route if needed)
          router.replace("/"); 
          
        } catch (error) {
          console.error("Error signing out: ", error);
        }
    };

    return(
        <>
          <Stack.Screen 
            options={{
              headerShown: true,
              headerBackVisible: false,
              headerLeft: () => null,
              headerTitleAlign: "center",
              headerTitle: () => (
                <Text className="text-gray-400 text-lg font-semibold" style={{ fontFamily: 'Nunito' }}>
                  Settings
                </Text>
              )
            }}
          />
          <ThemedView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, alignItems: 'center' }}>
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'transparent' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <View style={{ width: '100%', maxWidth: 400, gap: 15, flex: 1, backgroundColor: 'transparent' }}>
                        <View style={{ marginBottom: 20, alignItems: 'center', backgroundColor: 'transparent' }}>
                            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 32, color: '#9ca3af' }}>
                                    {userData?.first_name?.[0] || ''}{userData?.last_name?.[0] || ''}
                                </Text>
                            </View>
                        </View>

                        <View style={{ backgroundColor: 'transparent' }}>
                            <Text className="text-gray-500 mb-1 ml-1" style={{ fontSize: 12 }}>Name</Text>
                            <ThemedTextInput 
                                value={`${userData?.first_name || ''} ${userData?.last_name || ''}`.trim()} 
                                editable={false} 
                            />
                        </View>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <Text className="text-gray-500 mb-1 ml-1" style={{ fontSize: 12 }}>Email</Text>
                            <ThemedTextInput 
                                value={userData?.email || ''} 
                                editable={false} 
                            />
                        </View>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <Text className="text-gray-500 mb-1 ml-1" style={{ fontSize: 12 }}>Phone Number</Text>
                            <ThemedTextInput 
                                value={userData?.phone_number || ''} 
                                editable={false} 
                            />
                        </View>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <Text className="text-gray-500 mb-1 ml-1" style={{ fontSize: 12 }}>Password</Text>
                            <ThemedTextInput 
                                value="********" 
                                editable={false} 
                                secureTextEntry
                            />
                        </View>

                        <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 30, backgroundColor: 'transparent' }}>
                            <ThemedButton
                                text="Sign Out"
                                onPress={handleSignOut}
                                style={{ 
                                    backgroundColor: '#ff4444', 
                                    paddingVertical: 12, 
                                    borderRadius: 8,
                                    width: '100%'
                                }}
                                textStyle={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
          </ThemedView>
          {breakpoint === "sm" && (
            <MobileTabsBar navItems={courseConfig.mobileNavItems} />
          )}
        </>
    )
}

export default Profile;