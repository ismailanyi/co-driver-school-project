import { useAudioPlayer } from "expo-audio";

type AudioSource = Parameters<typeof useAudioPlayer>[0];

interface Props {
  source?: AudioSource;
}

export function useAudio({ source }: Props) {
  const player = useAudioPlayer(source ?? null);

  async function playSound() {
    if (!source) return;
    
    try {
      // Android JSI bug in expo-audio: seekTo(0) throws integer cast error. 
      // Using a float (0.0001) forces it to be cast as a Double instead.
      await player.seekTo(0.0001);
    } catch (seekError) {
      // If seekTo fails (e.g., player released or cast error), we still want to try to play.
      console.log("Audio seekTo failed:", seekError);
    }

    try {
      player.play();
    } catch (playError) {
      console.log("Audio playback failed:", playError);
    }
  }

  return { playSound };
}
