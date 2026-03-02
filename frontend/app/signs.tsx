import { ThemedView } from '@/components/themed-view';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '@/constants/globalStyles';

interface Sign {
    id: number;
    name: string;
    category: string; 
    image_url: string;
}

const Signs =  () => {
    const [signs, setSigns ] = useState<Sign[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [targetSign, setTargetSign] = useState<Sign | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const fetchSigns = async () => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/signs`)
            const fetchedSigns = response.data;
            const randomTarget = fetchedSigns[Math.floor(Math.random() * fetchedSigns.length)];
            setTargetSign(randomTarget);
            
            setSigns(fetchedSigns)
            
        } catch (error) {
            console.error("Error failed to get signs: ", error);
        }
        
    }
    
    useEffect(() => {
        fetchSigns();
    }, [])
    
    const handleSubmit = () => {
        if (!isSubmitted) {
            setIsCorrect(targetSign && selectedId === targetSign.id);
            setIsSubmitted(true)
        } else {
            setIsSubmitted(false)
            setSelectedId(null)
            fetchSigns();
        }
    }
    
    if (signs.length === 0 || !targetSign) {
        return(
            <ThemedView>
                <ThemedText style={globalStyles.container}>
                    Loading...
                </ThemedText>
            </ThemedView>
        )
    };

    return (
        //<ThemedView style=flex>
        <ThemedView style={globalStyles.container}>
            <ThemedText style={globalStyles.promptText}>
                Select the correct Image
            </ThemedText>
            <ThemedText style={globalStyles.targetText}>
                {targetSign.name}
            </ThemedText>
            <ThemedView style={globalStyles.grid}>
                {signs.map((sign) => {
                    const isSelected = selectedId === sign.id;

                    return(
                        <TouchableOpacity
                            key={sign.id}
                            style={[globalStyles.card, isSelected && globalStyles.selectedCard]}
                            onPress={() => {
                                setSelectedId(sign.id);
                            }}
                            activeOpacity={0.7}
                        >
                            <Image
                            source={{uri: sign.image_url}}
                            style={globalStyles.signImage}
                            contentFit='contain'
                            />
                        </TouchableOpacity>
                )})}
                
            </ThemedView>
            <ThemedView style={globalStyles.checker}>
                <TouchableOpacity
                    style={[globalStyles.submitButton, !selectedId ? globalStyles.disabledButton : isSubmitted && !isCorrect && {backgroundColor: '#fe0b0b'}]}
                    disabled={!selectedId}
                    onPress={() => handleSubmit()}
                >
                    <ThemedText style={[globalStyles.submitText]}
                    >
                       {isSubmitted ? isCorrect ? 'CONTINUE' : 'GOT IT' : 'CHECK'} 
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>

        </ThemedView>
    )
    
}

export default Signs;