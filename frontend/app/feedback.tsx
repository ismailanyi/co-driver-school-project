import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedButton } from '@/components/themed-button';
import api from '@/lib/api';
import { Picker } from '@react-native-picker/picker'; // Might need to install this or build a custom picker. We will use a basic TextInput or custom UI for now.

export default function FeedbackScreen() {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [issueType, setIssueType] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!subject.trim() || !description.trim() || !issueType.trim()) {
            Alert.alert("Error", "Please fill in all mandatory fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/feedback', {
                subject: subject,
                category: issueType,
                message: description,
                attachment_url: attachmentUrl || null
            });
            Alert.alert("Success", "Feedback submitted successfully!");
            router.back();
        } catch (error: any) {
            console.error("Error submitting feedback:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to submit feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Stack.Screen 
                options={{
                    headerShown: true,
                    headerTitle: "Feedback & Support"
                }}
            />
            <ThemedView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text style={{ fontSize: 16, color: '#4b5563', marginBottom: 20 }}>
                        Having issues or want to share feedback? Let us know below!
                    </Text>

                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 5 }}>
                            Subject <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <ThemedTextInput 
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="Brief summary of your issue"
                            style={{ backgroundColor: 'white', borderColor: '#e5e7eb', borderWidth: 1 }}
                        />
                    </View>

                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 5 }}>
                            Type of Issue <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <ThemedTextInput 
                            value={issueType}
                            onChangeText={setIssueType}
                            placeholder="e.g. Bug Report, Feature Request, Question"
                            style={{ backgroundColor: 'white', borderColor: '#e5e7eb', borderWidth: 1 }}
                        />
                    </View>

                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 5 }}>
                            Description <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <ThemedTextInput 
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Please provide details..."
                            multiline
                            numberOfLines={6}
                            style={{ backgroundColor: 'white', borderColor: '#e5e7eb', borderWidth: 1, height: 120, textAlignVertical: 'top' }}
                        />
                    </View>

                    <View style={{ marginBottom: 25 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 5 }}>
                            Attachment URL (Optional)
                        </Text>
                        <ThemedTextInput 
                            value={attachmentUrl}
                            onChangeText={setAttachmentUrl}
                            placeholder="https://link-to-screenshot.com/image.png"
                            style={{ backgroundColor: 'white', borderColor: '#e5e7eb', borderWidth: 1 }}
                            keyboardType="url"
                        />
                    </View>

                    <ThemedButton 
                        text={isSubmitting ? "Submitting..." : "Submit Feedback"}
                        onPress={handleSubmit}
                        style={{ backgroundColor: '#1cb0f6', width: '100%', paddingVertical: 12, borderBottomColor: '#1899d6' }}
                        textStyle={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}
                    />

                </ScrollView>
            </ThemedView>
        </>
    );
}
