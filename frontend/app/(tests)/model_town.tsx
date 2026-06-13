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
  // Assuming your board image is a square, the height matches the width
  const boardSize = screenWidth; 

  // 1. Memory for the car's exact position on the screen
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  // 2. Memory for the car's rotation angle (in radians)
  const rotation = useSharedValue(0);
  
  // 3. The Drag Logic
  // 3. The Drag Logic
  const pan = Gesture.Pan()

  .onChange((event) => {
      // (Your existing movement and rotation code stays exactly the same here)
      translateX.value += event.changeX;
      translateY.value += event.changeY;
      
      if (Math.abs(event.velocityX) > 10 || Math.abs(event.velocityY) > 10) {
         const angle = Math.atan2(event.velocityY, event.velocityX);
         rotation.value = withSpring(angle, { damping: 20, stiffness: 90 });
      }
    })

    // NEW: What happens when they let go of the car?
    .onEnd(() => {
      const finalX = translateX.value;
      const finalY = translateY.value;
      const finalAngle = rotation.value;
      
      // Multiply the device size by your JSON percentages to get the exact pixels for THIS device!
      const targetMinX = boardSize; // * currentScenario.target.minX_pct;
      const targetMaxX = boardSize; // * currentScenario.target.maxX_pct;
      const targetMinY = boardSize; // * currentScenario.target.minY_pct;
      const targetMaxY = boardSize; // * currentScenario.target.maxY_pct;
  
      const isInsideX = finalX > targetMinX && finalX < targetMaxX;
      const isInsideY = finalY > targetMinY && finalY < targetMaxY;
      
      if (isInsideX && isInsideY) {
        console.log("✅ PASSED!");
      } else {
        console.log("❌ WRONG SPOT!");
      }

      // STEP 1: Look at your terminal to find your target numbers!
      console.log(`Car dropped at X: ${finalX}, Y: ${finalY}, Angle: ${finalAngle}`);

      // STEP 2: Define your invisible target box (Update these numbers after checking the logs)
      // Example: Target box is between X: 100 to 150, and Y: 200 to 250
      
      // Example: Target angle is roughly facing Right (0 radians)
      const isFacingRight = finalAngle > -0.5 && finalAngle < 0.5; 

      // STEP 3: The Win Condition
      if (isInsideX && isInsideY && isFacingRight) {
        console.log("✅ CORRECT! You parked perfectly.");
        // Here is where you would trigger your success state, update the score, or show a modal
      } else {
        console.log("❌ WRONG SPOT! Try again.");
        // Optional MVP Polish: Snap the car back to the starting line if they get it wrong!
        // translateX.value = withSpring(0);
        // translateY.value = withSpring(0);
      }
    });

  // 4. Apply the math to the actual styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}rad` }, // Apply the angle!
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* Your Flat Figma Background */}
      {/* Replace the source string with your actual local image require path */}
      <Image 
        source={{ uri: 'YOUR_BOARD_IMAGE_URL_OR_REQUIRE' }} 
        style={styles.board} 
      />

      {/* Your Draggable Car */}
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
    height: 500, // Adjust based on your Figma export
    resizeMode: 'contain',
    position: 'absolute',
  },
  carContainer: {
    // This is where we add that "slightly above" 2.5D drop shadow magic you wanted!
    elevation: 8,
    boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.3)',
  },
  car: {
    width: 30, // Adjust to fit your road size
    height: 15,
    resizeMode: 'contain',
  }
});