import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';

const home = () => {
  const Lessons = [
    {id: 'theory', Label: 'Theory', router: '/theory'},
    {id: 'signs', Label: 'Road Signs', router: '/signs'},
    {id: 'mtb', Label: 'MTB (Model Town Board)', router: '/mtb'}
  ] as const

  return (
    <ThemedView>
        {Lessons.map((lesson) => (
          <ThemedButton
            key={lesson.id}
            title={lesson.Label}
            onPress = {() => {router.push(lesson.router)}}
          />
        ))}
      
    </ThemedView>
  );
}

export default home;