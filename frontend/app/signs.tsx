import { ThemedView } from '@/components/themed-view';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    const [isCorrect, setIsCorrect] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    
    useEffect(() => {
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
        fetchSigns();
    }, [])
    
    const handleCheck = () => {
        if (targetSign && selectedId === targetSign.id) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false)
        }
    };

    if (signs.length === 0 || !targetSign) {
        return(
            <ThemedView>
                <ThemedText style={style.container}>
                    Loading...
                </ThemedText>
            </ThemedView>
        )
    };

    return (
        //<ThemedView style=flex>
        <ThemedView style={style.container}>
            <ThemedText style={style.promptText}>
                Select the sign for
            </ThemedText>
            <ThemedText style={style.targetText}>
                {targetSign.name}
            </ThemedText>
            <ThemedView style={style.grid}>
                {signs.map((sign) => {
                    const isSelected = selectedId === sign.id;

                    return(
                        <TouchableOpacity
                            key={sign.id}
                            style={[style.card, isSelected && style.selectedCard]}
                            onPress={() => {
                                setSelectedId(sign.id);
                                setIsSubmitted(true); 
                            }}
                            activeOpacity={0.7}
                        >
                            <Image
                            source={{uri: sign.image_url}}
                            style={style.signImage}
                            contentFit='contain'
                            />
                        </TouchableOpacity>
                )})}
                
            </ThemedView>
            <ThemedView>
                <TouchableOpacity
                    style={[style.submitButton, !selectedId ? style.disabledButton : isSubmitted && isCorrect && {backgroundColor: '#fe0b0b'}]}
                    disabled={!selectedId}
                    onPress={() => handleCheck()}
                >
                    <ThemedText style={[style.submitText, !isCorrect && {color: '#ffffff'}]}
                    >
                       {isSubmitted ? isCorrect ? 'CONTINUE' : 'GOT IT' : 'CHECK'} 
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>

        </ThemedView>
    )
    
}

export default Signs;


const style = StyleSheet.create({
    checker: {
        alignSelf: 'stretch'
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }, 
    promptText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    targetText: {
        fontSize: 24,
        color: '#1CB0F6',
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    },
    img: {
        width: '20%',
        aspectRatio: 1,
        backgroundColor: '#e5e5e5',
        borderRadius: 15,
        marginBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        padding: 0,
        width: '100%'

    },
    card: {
        width: '40%',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    selectedCard: {
        borderColor: '#84D8FF',
        backgroundColor: '#DDF4FF'

    },
    signImage: {
        height: '80%',
        width: '80%',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#58CC02',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        // color: 'white',
        // fontWeight: 'bold',
        backgroundColor: '#e5e5e5'
    },
    submitText: {
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    incorrectAnswer: {
        borderRadius: 1,
        borderColor: '#ff0000'
    }
})