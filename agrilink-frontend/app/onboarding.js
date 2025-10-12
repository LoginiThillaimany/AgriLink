// app/onboarding.js
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingPage() {
  const [currentScreen, setCurrentScreen] = useState(1);

  const nextScreen = () => {
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
    } else {
      completeOnboarding();
    }
  };

  const skipOnboarding = () => {
    router.replace('/login');
  };

  const completeOnboarding = () => {
    // Save onboarding completion status
    // Then navigate to home or main app
    router.replace('/login');
  };

  const renderScreen = () => {
    switch(currentScreen) {
      case 1:
        return (
          <View style={styles.screen}>
           <Image 
                     source={require('../assets/On1.png')} // Adjust path if needed
                     style={styles.image}
                     resizeMode="contain"
                   />
            <Text style={styles.title}>Connect Farmers & Consumers</Text>
            <Text style={styles.description}>
              AgriLink directly connects farmers with consumers, eliminating middlemen and ensuring fair prices for both.
            </Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.screen}>
           <Image 
                     source={require('../assets/On2.png')} // Adjust path if needed
                     style={styles.image}
                     resizeMode="contain"
                   />
            <Text style={styles.title}>Fresh From Farm to Table</Text>
            <Text style={styles.description}>
              Get the freshest vegetables and fruits directly from local farmers, harvested at peak ripeness.
            </Text>
          </View>
        );
      case 3:
        return (
          <View style={styles.screen}>
             <Image 
                     source={require('../assets/On3.png')} // Adjust path if needed
                     style={styles.image}
                     resizeMode="contain"
                   />
            <Text style={styles.title}>Support Local Agriculture</Text>
            <Text style={styles.description}>
              Build a sustainable food ecosystem by supporting local farmers and reducing food miles.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderScreen()}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        {[1, 2, 3].map((i) => (
          <View 
            key={i} 
            style={[
              styles.indicator, 
              currentScreen === i ? styles.activeIndicator : styles.inactiveIndicator
            ]} 
          />
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={nextScreen}>
        <Text style={styles.nextButtonText}>
          {currentScreen === 3 ? 'Get Started' : 'Next'}
        </Text>
        {currentScreen < 3 && <Ionicons name="arrow-forward" size={20} color="white" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#133332',
    fontSize: 16,
  },
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#133332',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#133332',
    width: 20,
  },
  inactiveIndicator: {
    backgroundColor: '#ccc',
  },
  nextButton: {
    backgroundColor: '#133332',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});