import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import FlashMessage from 'react-native-flash-message';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoadingAnimationScreen } from './src/screens/splashscreen';
// import { LoadingAnimationScreen } from './src/screens/LoadingAnimationScreen'; // Your new animation screen

export default function App(): React.JSX.Element {
  const [appState, setAppState] = useState<'splash' | 'loading' | 'home'>('splash');

  useEffect(() => {
    const init = async () => {
      // 1. Splash Screen is visible here (handled by Native)
      
      // 2. Switch to your custom animation screen
      setAppState('loading'); 
      await RNBootSplash.hide({ fade: true }); // Hide native splash

      // 3. Simulate work (fetch API)
      await new Promise(resolve => setTimeout(() => resolve(null), 3000));
      
      // 4. Switch to Home Screen
      setAppState('home');
    };  

    init();
  }, []);

  // Conditional Rendering based on state
  return (
    <View style={styles.root}>
      {appState === 'loading' && <LoadingAnimationScreen />}
      {appState === 'home' && <HomeScreen />}
      <FlashMessage position="center" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' }
});