import { Audio } from "expo-av";
import { useEffect, useRef } from "react";

interface Props {
  source?: any;
}

export function useAudio({ source }: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadSound() {
      if (!source) return;
      try {
        const { sound } = await Audio.Sound.createAsync(source);
        if (isMounted) {
          soundRef.current = sound;
        } else {
          sound.unloadAsync();
        }
      } catch (error) {
        console.warn("Failed to load sound", error);
      }
    }
    
    loadSound();
    
    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [source]);

  async function playSound() {
    if (!soundRef.current) return;
    try {
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
    } catch (error) {
      console.warn("Failed to play sound", error);
    }
  }

  return { playSound };
}
