import React, { useState } from 'react';
import { View } from 'react-native';
import ModelTownBoard from './model_town'; // Your draggable component

// 1. Your Database of Questions lives here
const mtbScenarios = [
  {
    id: 1,
    instruction: "Park the car in the first parallel parking spot.",
    target: { minX_pct: 0.20, maxX_pct: 0.35, minY_pct: 0.40, maxY_pct: 0.55 }
  }
];

export default function QuizScreen() {
  // 2. State to track which question they are on 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      {/* 3. Pass the data into your board using the prop! */}
      <ModelTownBoard 
         //currentScenario={mtbScenarios[currentQuestionIndex]} 
      />
    </View>
  );
}


// 1. Add a memory for the scale (1 is normal size)
  //const scale = useSharedValue(1);

  /* const pan = Gesture.Pan()
    // 2. Triggered the exact millisecond they touch the car
    .onBegin(() => {
       // Zoom in to 150% size smoothly!
       scale.value = withSpring(1.5); 
    })
    .onChange((event) => {
       // (Your existing drag & rotation code stays here)
    })
    .onEnd(() => {
       // 3. Zoom back out to normal size when they let go
       scale.value = withSpring(1);
       
       // (Your existing target checking code stays here)
    }); */

  // 4. Add the scale to your animated style
/*   const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}rad` },
        { scale: scale.value }, // Apply the zoom!
      ],
    };
  }); */