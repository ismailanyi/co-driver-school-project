import { useState } from 'react';
import { Platform, StyleSheet, useColorScheme, View, Text, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


const SignUpScreen = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
      })
      const [currentStep, setCurrentStep] = useState(1);
      const updateField = (key: string, value: string) => {
        setFormData((prev)=> ({...prev, [key]: value}) )
      };
      // Theme
      const colorScheme = useColorScheme();
      const themeColor = colorScheme === 'dark' ? '#fff' : '#333';
      const themeBackgroundColor = colorScheme === 'dark' ? '#333' : '#fff';
      const placehoderColor = colorScheme === 'dark' ? '#aaa' : '#666';
      
    return (
        <ThemedView style={styles.stepContainer}>
            <ThemedText type="title">Create Account</ThemedText>
            <View style={[styles.stepContainer, {backgroundColor: themeBackgroundColor}]}/>
            <Text style={{color: 'white'}}>
                Current step: {currentStep }
            </Text>
            <TextInput
                style={[styles.input, {}]}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    flex: 1, 
    padding: 20,
    justifyContent: 'center',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  }
});

export default SignUpScreen;