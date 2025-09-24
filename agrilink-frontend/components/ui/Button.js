import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import shadows from '../../styles/shadows';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyle = {
      borderRadius: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
      paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
      paddingHorizontal: size === 'sm' ? 16 : size === 'lg' ? 24 : 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.6 }),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary[600],
          ...shadows.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary[500],
          ...shadows.secondary,
        };
      case 'accent':
        return {
          ...baseStyle,
          backgroundColor: colors.accent[500],
          ...shadows.md,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary[600],
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'gradient':
        return baseStyle;
      default:
        return baseStyle;
    }
  };

  const getTextStyles = () => {
    const baseTextStyle = {
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (variant) {
      case 'outline':
        return {
          ...baseTextStyle,
          color: colors.primary[600],
        };
      case 'ghost':
        return {
          ...baseTextStyle,
          color: colors.primary[600],
        };
      default:
        return {
          ...baseTextStyle,
          color: '#ffffff',
        };
    }
  };

  const buttonStyles = getButtonStyles();
  const textStyles = getTextStyles();

  const ButtonContent = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary[600] : '#ffffff'} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} 
              color={textStyles.color} 
              style={{ marginRight: 8 }} 
            />
          )}
          <Text style={[textStyles, textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} 
              color={textStyles.color} 
              style={{ marginLeft: 8 }} 
            />
          )}
        </>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={['#064e3b', '#10b981']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[buttonStyles, shadows.primary, style]}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

export default Button;