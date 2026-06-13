import { useAudioPlayer } from "expo-audio";

type AudioSource = Parameters<typeof useAudioPlayer>[0];

interface Props {
  source?: AudioSource;
}

export function useAudio({ source }: Props) {
  const player = useAudioPlayer(source ?? null);

  async function playSound() {
    if (source) {
      player.seekTo(0);
      player.play();
    }
  }

  return { playSound };
}
