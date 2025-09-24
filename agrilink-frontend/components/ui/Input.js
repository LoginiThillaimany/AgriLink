import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import shadows from '../../styles/shadows';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const toggleSecureEntry = () => setIsSecure(!isSecure);

  const inputContainerStyle = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: error 
      ? colors.error 
      : isFocused 
        ? colors.primary[500] 
        : colors.neutral[200],
    paddingHorizontal: 16,
    paddingVertical: multiline ? 16 : 12,
    minHeight: multiline ? 80 : 48,
    ...shadows.sm,
  };

  const textInputStyle = {
    flex: 1,
    fontSize: 16,
    color: colors.neutral[800],
    paddingLeft: leftIcon ? 8 : 0,
    paddingRight: rightIcon || secureTextEntry ? 8 : 0,
    textAlignVertical: multiline ? 'top' : 'center',
  };

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label && (
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: colors.neutral[700],
          marginBottom: 8,
        }}>
          {label}
        </Text>
      )}
      
      <View style={[inputContainerStyle, style]}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={isFocused ? colors.primary[500] : colors.neutral[400]} 
          />
        )}
        
        <TextInput
          style={[textInputStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecureEntry}>
            <Ionicons 
              name={isSecure ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={colors.neutral[400]} 
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={colors.neutral[400]} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={{
          fontSize: 12,
          color: colors.error,
          marginTop: 4,
          marginLeft: 4,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;