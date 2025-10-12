// App.js
// import 'expo-router/entry';

// App.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🌱 AgriLink App</Text>
      <Text style={styles.subText}>Working Successfully! ✅</Text>
      <Text style={styles.smallText}>Web & Mobile Ready</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});