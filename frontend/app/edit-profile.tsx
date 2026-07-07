import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Image, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useTheme } from '@/context/theme';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
    const { background, foreground, border, mutedForeground, muted } = useTheme();
    const { user: userData } = useAuthStore();
    const { updateProfile, uploadProfilePicture } = useProfileStore();

    const [firstName, setFirstName] = useState(userData?.first_name || "");
    const [lastName, setLastName] = useState(userData?.last_name || "");
    const [username, setUsername] = useState(userData?.username || "");
    const [email, setEmail] = useState(userData?.email || "");
    const [phoneNumber, setPhoneNumber] = useState(userData?.phone_number || "");

    const latestValues = useRef({ firstName, lastName, username, email, phoneNumber });
    
    // Update ref whenever state changes so unmount closure has fresh data
    useEffect(() => {
        latestValues.current = { firstName, lastName, username, email, phoneNumber };
    }, [firstName, lastName, username, email, phoneNumber]);

    // Save automatically only when component unmounts
    useEffect(() => {
        return () => {
            const currentUser = useAuthStore.getState().user;
            const vals = latestValues.current;
            if (
                currentUser &&
                (vals.firstName !== currentUser.first_name ||
                 vals.lastName !== currentUser.last_name ||
                 vals.username !== (currentUser.username || "") ||
                 vals.email !== currentUser.email ||
                 vals.phoneNumber !== currentUser.phone_number)
            ) {
                // Call update directly from the imported store method if needed,
                // or just use useProfileStore.getState().updateProfile
                useProfileStore.getState().updateProfile({
                    first_name: vals.firstName,
                    last_name: vals.lastName,
                    username: vals.username,
                    email: vals.email,
                    phone_number: vals.phoneNumber,
                    profile_picture: currentUser.profile_picture
                });
            }
        };
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            await uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        const success = await uploadProfilePicture(uri, {
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
            phone_number: phoneNumber,
        });
        if (!success) {
            Alert.alert("Error", "Could not upload profile picture.");
        }
    };

    const showProfilePicUpload = !!userData?.school_code || userData?.role === 'driving-instructor';

    return (
        <>
            <Stack.Screen 
                options={{
                    headerShown: true,
                    headerTitle: "Profile Settings",
                }}
            />
            <ThemedView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
                    <View style={{ width: '100%', maxWidth: 400, gap: 15 }}>
                        
                        <View style={{ marginBottom: 20, alignItems: 'center' }}>
                            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: muted, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                {userData?.profile_picture ? (
                                    <Image 
                                        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${userData.profile_picture}` }} 
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text style={{ fontSize: 32, color: mutedForeground }}>
                                        {(userData?.first_name || '')[0] || ''}{(userData?.last_name || '')[0] || ''}
                                    </Text>
                                )}
                            </View>
                            
                            {showProfilePicUpload ? (
                                <Pressable onPress={pickImage} style={{ marginTop: 10 }}>
                                    <Text style={{ color: '#1cb0f6', fontSize: 14, fontWeight: 'bold' }}>CHANGE AVATAR</Text>
                                </Pressable>
                            ) : (
                                <Text style={{ fontSize: 12, color: mutedForeground, marginTop: 10, textAlign: 'center' }}>
                                    Profile picture uploads are unlocked when you join a driving school.
                                </Text>
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: mutedForeground, marginBottom: 4, marginLeft: 4 }}>First Name</Text>
                                <ThemedTextInput 
                                    value={firstName} 
                                    onChangeText={setFirstName}
                                    style={{ backgroundColor: background, borderColor: border, borderWidth: 1, color: foreground }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, color: mutedForeground, marginBottom: 4, marginLeft: 4 }}>Last Name</Text>
                                <ThemedTextInput 
                                    value={lastName} 
                                    onChangeText={setLastName}
                                    style={{ backgroundColor: background, borderColor: border, borderWidth: 1, color: foreground }}
                                />
                            </View>
                        </View>

                        <View>
                            <Text style={{ fontSize: 12, color: mutedForeground, marginBottom: 4, marginLeft: 4 }}>Username</Text>
                            <ThemedTextInput 
                                value={username} 
                                onChangeText={setUsername}
                                style={{ backgroundColor: background, borderColor: border, borderWidth: 1, color: foreground }}
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text style={{ fontSize: 12, color: mutedForeground, marginBottom: 4, marginLeft: 4 }}>Email</Text>
                            <ThemedTextInput 
                                value={email} 
                                onChangeText={setEmail}
                                style={{ backgroundColor: background, borderColor: border, borderWidth: 1, color: foreground }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        
                        <View>
                            <Text style={{ fontSize: 12, color: mutedForeground, marginBottom: 4, marginLeft: 4 }}>Phone Number</Text>
                            <ThemedTextInput 
                                value={phoneNumber} 
                                onChangeText={setPhoneNumber}
                                style={{ backgroundColor: background, borderColor: border, borderWidth: 1, color: foreground }}
                                keyboardType="phone-pad"
                            />
                        </View>

                    </View>
                </ScrollView>
            </ThemedView>
        </>
    );
}
