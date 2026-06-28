import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

export const LoadingAnimationScreen = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient colors={['#0f172a', '#1e293b', '#312e81']} style={styles.container}>
      {/* Stable Glassmorphism Card */}
      <View style={styles.card}>
        {/* Layered background for deep glass effect */}
        <View style={styles.glassEffect} />
        
        <LottieView
          source={require('../../assets/lottie/loading1.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        
        <Text style={styles.text}>Fetching latest weather...</Text>
        
        <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '85%',
    padding: 40,
    borderRadius: 32,
    alignItems: 'center',
    overflow: 'hidden', // Ensures inner effects don't bleed out
  },
  glassEffect: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 32,
  },
  animation: { width: 160, height: 160 },
  text: { color: '#FFF', fontSize: 18, marginTop: 20, fontWeight: '500' },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#60a5fa',
    marginTop: 30,
  }
});