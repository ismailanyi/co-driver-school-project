import { ThemedView } from '@/components/themed-view';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '@/constants/globalStyles';
import Questions from '@/components/questions';
import SubmitAnswer from '@/components/submit-answer';
interface Sign {
    id: number;
    name: string;
    category: string; 
    image_url: string;
}

const Signs =  () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [signs, setSigns ] = useState<Sign[]>([]);
    const [targetSign, setTargetSign] = useState<Sign | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const fetchSigns = async () => {
        try {
            const api = axios.create({
                baseURL: process.env.EXPO_PUBLIC_API_URL
            })
            const response = await api.get(`/quiz/signs`)
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
                        <Questions
                            key={sign.id}
                            quesion={sign}
                            isSelected={isSelected}
                            onPress={() => {setSelectedId(sign.id);}}
                        >
                            <Image
                                source={{uri: sign.image_url}}
                                style={globalStyles.signImage}
                                contentFit='contain'
                            />
                        </Questions>
                    )
                })}
            </ThemedView>
            <SubmitAnswer
                selectedId={selectedId}
                isCorrect={isCorrect}
                isSubmitted={isSubmitted}
                onPress={handleSubmit}
            />
            
        </ThemedView>
    )
    
}

export default Signs;