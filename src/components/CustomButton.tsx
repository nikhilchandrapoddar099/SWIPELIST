import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';

// Define prop types for the CustomButton component
interface CustomButtonProps {
  onToggle: (isToggled: boolean) => void; // Function to handle toggling
  textButton: string; // Text to be displayed on the button
}

// Constants for button dimensions and animation ranges
const BUTTON_WIDTH: number = 350;
const BUTTON_HEIGHT: number = 80;
const BUTTON_PADDING: number = 10;
const SWIPEABLE_DIMENSIONS: number = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const H_WAVE_RANGE: number = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE: number = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

// Create an Animated component for LinearGradient
const AnimatedLinearGradient: FC = Animated.createAnimatedComponent(LinearGradient);

// CustomButton component
const CustomButton: FC<CustomButtonProps> = ({ onToggle, textButton }) => {
  // Shared animated value for X translation
  const X = useSharedValue(0);
  // Local state to track toggled state
  const [toggled, setToggled] = useState<boolean>(false);

  // Function to handle completion of animation
  const handleComplete = (isToggled: boolean): void => {
    if (isToggled !== toggled) {
      onToggle(isToggled); // Call the onToggle function provided by parent component
      setToggled(isToggled); // Update local state
    }
    // Reset animation after a delay
    setTimeout(() => {
      X.value = withSpring(0);
    }, 200);
  };

  // Gesture handler for PanGestureHandler
  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.completed = false; // Set completed flag to false
    },
    onActive: (e, ctx) => {
      let newValue;
      if (ctx.completed) {
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }

      // Update X value within valid range
      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: (_, ctx) => {
      // Determine if button should be toggled based on X value
      if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false); // Run handleComplete function on JS thread
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true); // Run handleComplete function on JS thread
        ctx.completed = false; // Reset completed flag
      }
    },
  });

  // Interpolation input range for X value
  const InterpolateXInput: number[] = [0, H_SWIPE_RANGE];
  // Animated styles for different components
  const AnimatedStyles = {
    swipeCont: useAnimatedStyle(() => {
      return {}; // No additional styles for swipe container
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        width: H_WAVE_RANGE + X.value, // Interpolate width based on X value
        opacity: interpolate(X.value, InterpolateXInput, [0, 1]), // Fade in/out based on X value
      };
    }),
    swipeable: useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          X.value,
          [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
          ['#06d6a0', '#fff']
        ), // Interpolate background color based on X value
        transform: [{ translateX: X.value }], // Translate based on X value
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(X.value, InterpolateXInput, [0.7, 0], Extrapolate.CLAMP), // Fade out based on X value
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
              Extrapolate.CLAMP
            ), // Translate based on X value
          },
        ],
      };
    }),
  };

  // Render the CustomButton component
  return (
    <Animated.View style={[styles.swipeCont, AnimatedStyles.swipeCont]}>
      <AnimatedLinearGradient
        style={[AnimatedStyles.colorWave, styles.colorWave]}
        colors={['#06d6a0', '#1b9aaa']}
        start={{ x: 0.0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]} />
      </PanGestureHandler>
      <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>
        {textButton} {/* Display the text provided as prop */}
      </Animated.Text>
    </Animated.View>
  );
};

// Styles for the CustomButton component
const styles = StyleSheet.create({
  swipeCont: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    backgroundColor: '#fff',
    borderRadius: BUTTON_HEIGHT,
    padding: BUTTON_PADDING,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  colorWave: {
    position: 'absolute',
    left: 0,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT,
  },
  swipeable: {
    position: 'absolute',
    left: BUTTON_PADDING,
    height: SWIPEABLE_DIMENSIONS,
    width: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS,
    zIndex: 3,
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 2,
    color: '#1b9aaa',
  },
});

// Export the CustomButton component as default
export default CustomButton;
