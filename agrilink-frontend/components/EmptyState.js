import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../lib/theme';

export default function EmptyState({ 
  icon = 'leaf-outline', 
  title = 'No items found', 
  message 
}) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={80} color={colors.textDisabled} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    color: colors.text,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});