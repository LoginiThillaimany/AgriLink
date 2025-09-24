import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import Button from './Button';
import colors from '../../styles/colors';

const ProductCard = ({ product }) => {
  const navigation = useNavigation();
  const { name, price, image, description } = product;

  const handleViewDetails = () => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <Card
      variant="elevated"
      style={styles.card}
    >
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.unit}>/kg</Text>
          </View>

          <Button
            title="View Details"
            variant="gradient"
            icon="arrow-forward-outline"
            size="sm"
            onPress={handleViewDetails}
          />
        </View>

        {/* Quality Indicators */}
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons name="leaf-outline" size={12} color={colors.primary[600]} />
            <Text style={styles.badgeText}>Organic</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark-outline" size={12} color={colors.primary[600]} />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    overflow: 'hidden',
    padding: 0,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.neutral[100],
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[800],
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.neutral[600],
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '600',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary[600],
    marginLeft: 2,
  },
  unit: {
    fontSize: 12,
    color: colors.neutral[500],
    marginLeft: 2,
  },
  badges: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: colors.primary[600],
    fontWeight: '500',
  },
});

export default ProductCard;