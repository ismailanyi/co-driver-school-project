import { ThemedView } from '@/components/themed-view';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet } from 'react-native';

interface Sign {
    id: number;
    name: string;
    category: string; 
    image_url: string;
}

const Signs =  () => {
    const [signs, setSigns ] = useState<Sign[]>([]);
    useEffect(() => {
        const fetchSigns = async () => {
            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/signs`)
                setSigns(response.data)

            } catch (error) {
                console.error("Error failed to get signs: ", error);
            }
            
        }
        fetchSigns();
    }, [])

    console.log('URL: ', `${signs[0]?.image_url}`)


    return (
        //<ThemedView style=flex>
        <ThemedView style={style.container}>
            <ThemedText>
                Road Signs
            </ThemedText>
            <ThemedView style={style.grid}>
                {signs.map((sign) => (
                    <Image
                        key={sign.id}
                        source={{uri: sign?.image_url}}
                        style={style.img}
                        contentFit='contain'
                        />
                ))}
            </ThemedView>

        </ThemedView>
    )
    
}

export default Signs;


const style = StyleSheet.create({
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
        //justifyContent: 'space-between',
        gap: 12,
        padding: 0,

    },
    container: {
        
    }
})