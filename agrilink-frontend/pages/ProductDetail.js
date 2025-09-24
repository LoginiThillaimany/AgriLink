import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import colors from '../styles/colors';
import shadows from '../styles/shadows';

const { width, height } = Dimensions.get("window");

const ProductDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [farmer, setFarmer] = useState(null);
  const [stock, setStock] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    startAnimations();
    fetchFarmerDetails();
    fetchStockStatus();
  }, []);

  const fetchFarmerDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/farmer/${product.farmerId}`);
      const data = await response.json();
      setFarmer(data);
    } catch (error) {
      console.error("Error fetching farmer details:", error);
    }
  };

  const fetchStockStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product._id}/stock`);
      const data = await response.json();
      setStock(data.stock || 0);
    } catch (error) {
      console.error("Error fetching stock status:", error);
    }
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50], justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.neutral[600], fontSize: 16 }}>Product not found</Text>
      </SafeAreaView>
    );
  }

  const addToCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id || product.id, quantity }),
      });
      if (response.ok) {
        Alert.alert("Success", `${product.name} added to cart!`, [
          { text: "Continue Shopping", style: "default" },
          { text: "View Cart", onPress: () => navigation.navigate("Cart") }
        ]);
      } else {
        Alert.alert("Error", "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color={colors.secondary[500]} />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color={colors.secondary[500]} />);
    }
    const emptyStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color={colors.neutral[300]} />);
    }
    return stars;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[700]} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.primary[500]]}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          paddingTop: 50,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              flex: 1,
            }}
          >
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: 'white',
            }}>
              Product Details
            </Text>
          </Animated.View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                console.log("Order History button pressed");
                navigation.navigate("OrderHistory");
              }}
              style={{ marginRight: 16, padding: 12 }}
              activeOpacity={0.7}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Ionicons name="receipt-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log("Cart button pressed");
                navigation.navigate("Cart");
              }}
              style={{ padding: 12 }}
              activeOpacity={0.7}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Ionicons name="cart-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
        >
          {/* Product Image */}
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Image
              source={{
                uri: product.image || "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              }}
              style={{
                width: width - 40,
                height: 280,
                borderRadius: 20,
                ...shadows.lg,
              }}
              resizeMode="cover"
            />
          </View>

          {/* Product Info */}
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: '900',
              color: colors.neutral[800],
              marginBottom: 8,
              lineHeight: 32,
            }}>
              {product.name}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                backgroundColor: colors.primary[50],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                marginRight: 12,
              }}>
                <Text style={{
                  color: colors.primary[700],
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                  {product.category || "General"}
                </Text>
              </View>

              {product.rating && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {getRatingStars(product.rating)}
                  <Text style={{
                    marginLeft: 6,
                    fontSize: 14,
                    color: colors.neutral[600],
                    fontWeight: '600',
                  }}>
                    {product.rating} ({product.reviews || 0})
                  </Text>
                </View>
              )}
            </View>

            <Text style={{
              fontSize: 32,
              fontWeight: '900',
              color: colors.primary[600],
              marginBottom: 16,
            }}>
              LKR {product.price?.toLocaleString() || product.price}
            </Text>

            {/* Stock Status */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{
                backgroundColor: stock > 0 ? colors.success + '20' : colors.error + '20',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons
                  name={stock > 0 ? "checkmark-circle" : "alert-circle"}
                  size={16}
                  color={stock > 0 ? colors.success : colors.error}
                />
                <Text style={{
                  color: stock > 0 ? colors.success : colors.error,
                  fontSize: 14,
                  fontWeight: '600',
                  marginLeft: 4,
                }}>
                  {stock > 0 ? `${stock} units in stock` : 'Out of stock'}
                </Text>
              </View>
            </View>

            {/* Farmer Info */}
            {farmer && (
              <Card variant="elevated" style={{ padding: 20, marginBottom: 20 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: colors.neutral[800],
                  marginBottom: 12,
                }}>
                  Farmer Information
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: colors.primary[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Ionicons name="person" size={24} color={colors.primary[600]} />
                  </View>
                  <View>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: colors.neutral[800],
                    }}>
                      {farmer.name}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: colors.neutral[600],
                    }}>
                      {farmer.location || 'Local Farmer'}
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Description */}
            <Card variant="elevated" style={{ padding: 20, marginBottom: 20 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '800',
                color: colors.neutral[800],
                marginBottom: 12,
              }}>
                Description
              </Text>
              <Text style={{
                fontSize: 16,
                color: colors.neutral[600],
                lineHeight: 24,
              }}>
                {product.description || "This high-quality agricultural product is perfect for modern farming needs. It offers excellent performance and reliability for all your farming requirements."}
              </Text>
            </Card>

            {/* Quantity Selector */}
            <Card variant="elevated" style={{ padding: 20, marginBottom: 20 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '800',
                color: colors.neutral[800],
                marginBottom: 16,
              }}>
                Quantity
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary[600],
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shadows.sm,
                  }}
                  onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  <Ionicons name="remove" size={20} color="white" />
                </TouchableOpacity>

                <Text style={{
                  marginHorizontal: 24,
                  fontSize: 24,
                  fontWeight: '900',
                  color: colors.neutral[800],
                  minWidth: 50,
                  textAlign: 'center',
                }}>
                  {quantity}
                </Text>

                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary[600],
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shadows.sm,
                  }}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </Card>

            {/* Additional Info */}
            <Card variant="elevated" style={{ padding: 20, marginBottom: 100 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '800',
                color: colors.neutral[800],
                marginBottom: 16,
              }}>
                Product Information
              </Text>

              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={{ marginLeft: 12, color: colors.neutral[700], fontSize: 16 }}>
                  High-quality agricultural product
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={{ marginLeft: 12, color: colors.neutral[700], fontSize: 16 }}>
                  Suitable for modern farming practices
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={{ marginLeft: 12, color: colors.neutral[700], fontSize: 16 }}>
                  Environmentally friendly and sustainable
                </Text>
              </View>
            </Card>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Fixed Bottom Add to Cart */}
      <View style={{
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: colors.neutral[200],
        ...shadows.lg,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '800',
            color: colors.neutral[800],
            flex: 1,
          }}>
            Total: LKR {(product.price * quantity)?.toLocaleString() || (product.price * quantity)}
          </Text>
        </View>

        <Button
          title={`Add ${quantity} to Cart`}
          variant="gradient"
          size="lg"
          icon="cart-outline"
          onPress={addToCart}
          loading={loading}
          fullWidth
          disabled={stock === 0}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProductDetail;
