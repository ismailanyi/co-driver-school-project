import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function ModelTownBoard() {
  const screenWidth = Dimensions.get('window').width;
  const boardSize = screenWidth;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const rotation = useSharedValue(0);
  
  const pan = Gesture.Pan()

  .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
      
      if (Math.abs(event.velocityX) > 10 || Math.abs(event.velocityY) > 10) {
         const angle = Math.atan2(event.velocityY, event.velocityX);
         rotation.value = withSpring(angle, { damping: 20, stiffness: 90 });
      }
    })

    .onEnd(() => {
      const finalX = translateX.value;
      const finalY = translateY.value;
      const finalAngle = rotation.value;
      
      const targetMinX = boardSize;
      const targetMaxX = boardSize;
      const targetMinY = boardSize;
      const targetMaxY = boardSize;
  
      const isInsideX = finalX > targetMinX && finalX < targetMaxX;
      const isInsideY = finalY > targetMinY && finalY < targetMaxY;
      
      if (isInsideX && isInsideY) {
        console.log("✅ PASSED!");
      } else {
        console.log("❌ WRONG SPOT!");
      }

      console.log(`Car dropped at X: ${finalX}, Y: ${finalY}, Angle: ${finalAngle}`);

      const isFacingRight = finalAngle > -0.5 && finalAngle < 0.5; 

      if (isInsideX && isInsideY && isFacingRight) {
        console.log("✅ CORRECT! You parked perfectly.");
      } else {
        console.log("❌ WRONG SPOT! Try again.");
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}rad` },

      ],
    };
  });

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'YOUR_BOARD_IMAGE_URL_OR_REQUIRE' }} 
        style={styles.board} 
      />

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.carContainer, animatedStyle]}>
           <Image 
             source={{ uri: 'YOUR_CAR_IMAGE_URL_OR_REQUIRE' }} 
             style={styles.car} 
           />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5', 
  },
  board: {
    width: '100%',
    height: 500,
    resizeMode: 'contain',
    position: 'absolute',
  },
  carContainer: {
    elevation: 8,
    boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.3)',
  },
  car: {
    width: 30,
    height: 15,
    resizeMode: 'contain',
  }
});