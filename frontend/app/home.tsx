import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';

const home = () => {
  const Lessons = [
    {id: 'theory', Label: 'Theory', router: '/theory'},
    {id: 'signs', Label: 'Road Signs', router: '/signs'},
    {id: 'mtb', Label: 'MTB (Model Town Board', router: '/mtb'}
  ]

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Dashboard</ThemedText>
      
      <ThemedView style={styles.buttonContainer}>
        {Lessons.map((lesson) => (
          <ThemedButton
            key={lesson.id}
            title={lesson.Label}
            onPress = {() => {router.push(lesson.router)}}
          />
        ))}
      </ThemedView>
      
    </ThemedView>
  );
}

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonContainer: {
    // We will define the layout here
  }
});