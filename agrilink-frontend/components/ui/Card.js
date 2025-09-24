import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/colors';
import shadows from '../../styles/shadows';

const Card = ({
  children,
  variant = 'default',
  onPress,
  style,
  padding = 16,
  borderRadius = 16,
  ...props
}) => {
  const getCardStyles = () => {
    const baseStyle = {
      borderRadius,
      padding,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
          ...shadows.lg,
        };
      case 'neumorphism':
        return {
          ...baseStyle,
          backgroundColor: colors.neutral[50],
          ...shadows.neumorphism.light,
          ...shadows.neumorphism.dark,
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        };
      case 'gradient':
        return baseStyle;
      default:
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
          ...shadows.md,
        };
    }
  };

  const cardStyles = getCardStyles();

  if (variant === 'gradient') {
    const Component = onPress ? TouchableOpacity : View;
    return (
      <Component onPress={onPress} activeOpacity={0.9} {...props}>
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[cardStyles, shadows.md, style]}
        >
          {children}
        </LinearGradient>
      </Component>
    );
  }

  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      style={[cardStyles, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;