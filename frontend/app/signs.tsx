import { ThemedView } from '@/components/themed-view';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

interface Sign {
    id: number;
    name: string;
    category: string; 
    image_url: string;
}

const Signs =  () => {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const [signs, setSigns ] = useState<Sign[]>([]);
    useEffect(() => {
        const fetchSigns = async () => {
            try {
                const response = await axios.get(`${dynamicURL}/signs`)
                setSigns(response.data)

            } catch (error) {
                console.error("Error failed to get signs: ", error);
            }
            
        }
        fetchSigns();
    }, [])

    console.log('Dynamic Url:', dynamicURL)
    console.log('First Image URI: ', signs.length > 0 ? `${dynamicURL}/${signs[0].image_url}` : "Loading...");

    return (
        //<ThemedView style=flex>
        <ThemedView className='flex-row flex-wrap'>
            <ThemedText>
                Road Signs
            </ThemedText>
            {signs.map((sign) => (
            <Image
                key={sign.id}
                source={{uri: `${dynamicURL}/${sign.image_url}`}}
                style={style.img}
                contentFit='contain'
            />
            ))}

        </ThemedView>
    )
    
}

export default Signs;


const style = StyleSheet.create({
    img: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#e5e5e5',
        borderRadius: 15
    }
})