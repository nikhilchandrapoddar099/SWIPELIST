/**
 * App component for displaying news data and handling user interaction.
 */
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import CustomButton from './src/components/CustomButton';
import { useUser } from './src/hooks/networkHook'; // Importing custom hook for fetching user data
import NewsUI from './src/components/NewsUI'; // Importing UI component for displaying news

/**
 * Main component of the application.
 */
const App: React.FC = () => {
  // State variables for managing page number, user data, loading state, error state, and start state
  const [page, setPage] = useState<number>(0);
  const { newsData, isLoading, isError } = useUser(page); // Fetching user data using custom hook
  const [isStarted, setIsStarted] = useState<boolean>(false);

  /**
   * Function to handle the toggle of start state and update the page number.
   * @param value - Boolean value indicating whether the start state should be toggled.
   */
  const handleStartToggle = (value: boolean): void => {
    if (value) {
      setIsStarted(value); // Update start state if value is true
    }
    setPage(page + 1); // Increment page number
  }

  // Render UI
  return (
    <SafeAreaView>
      <View style={styles.root}>
        <View style={{ alignSelf: "center" }}>
          {/* Display news UI component */}
          <NewsUI isError={isError} isLoading={isLoading} isStarted={isStarted} newsData={newsData} />
        </View>
        {/* Render custom button component when loading is complete */}
        {!isLoading && (
          <View style={{ position: "absolute", bottom: 20, alignSelf: "center" }}>
            {/* Custom button to trigger start toggle */}
            <CustomButton onToggle={handleStartToggle} textButton={'Swipe to go'} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

// Styles for the App component
const styles = StyleSheet.create({
  root: {
    width: '98%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center",
  },
});

export default App; // Exporting App component
