import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { globalStyles } from '@/constants/globalStyles';

const ModalScreen = () => {
  return (
    <ThemedView style={globalStyles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={globalStyles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

export default ModalScreen;