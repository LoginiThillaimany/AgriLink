import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import colors from '../styles/colors';
import shadows from '../styles/shadows';

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { total } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchCart();
    startAnimations();
  }, []);

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
    ]).start();
  };

  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cart");
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      // Mock cart data for demo
      setCart({
        items: [
          {
            productId: {
              _id: "1",
              name: "Organic Tomato Seeds",
              price: 450,
            },
            quantity: 2,
          },
        ]
      });
    }
  };

  const getTotal = () => {
    if (total) return total;
    return cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );
  };

  const placeOrder = async () => {
    if (cart.items.length === 0) {
      Alert.alert("Cart Empty", "Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod }),
      });

      if (response.ok) {
        const order = await response.json();
        Alert.alert(
          "Order Placed Successfully! 🎉",
          `Total: LKR ${getTotal().toLocaleString()}\nOrder ID: ${order._id || 'ORD-' + Date.now()}\nPayment: ${paymentMethod}`,
          [
            { text: "View Orders", onPress: () => navigation.navigate("OrderHistory") },
            { text: "Continue Shopping", onPress: () => navigation.navigate("Home") }
          ]
        );
        // Refresh cart after order
        fetchCart();
      } else {
        Alert.alert("Error", "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Network error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
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
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: 'white',
              flex: 1,
            }}>
              Checkout
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            padding: 20,
          }}
        >
          {/* Order Summary */}
          <Card variant="elevated" style={{ padding: 20, marginBottom: 20 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: colors.neutral[800],
              marginBottom: 16,
            }}>
              📋 Order Summary
            </Text>

            {cart.items.map((item, index) => (
              <View key={item.productId._id || index} style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
                paddingBottom: 12,
                borderBottomWidth: index < cart.items.length - 1 ? 1 : 0,
                borderBottomColor: colors.neutral[200],
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.neutral[800],
                    marginBottom: 4,
                  }}>
                    {item.productId.name}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.neutral[600],
                  }}>
                    Quantity: {item.quantity}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.primary[600],
                }}>
                  LKR {(item.productId.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}

            <View style={{
              borderTopWidth: 2,
              borderTopColor: colors.neutral[200],
              paddingTop: 16,
              marginTop: 16,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: colors.neutral[800],
                }}>
                  Total Amount
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '900',
                  color: colors.primary[600],
                }}>
                  LKR {getTotal().toLocaleString()}
                </Text>
              </View>
            </View>
          </Card>

          {/* Payment Method */}
          <Card variant="elevated" style={{ padding: 20, marginBottom: 20 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: colors.neutral[800],
              marginBottom: 16,
            }}>
              💳 Payment Method
            </Text>

            {/* Cash on Delivery */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderWidth: 2,
                borderColor: paymentMethod === "COD" ? colors.primary[600] : colors.neutral[300],
                borderRadius: 12,
                backgroundColor: paymentMethod === "COD" ? colors.primary[50] : 'white',
                marginBottom: 12,
              }}
              onPress={() => setPaymentMethod("COD")}
            >
              <Ionicons
                name={paymentMethod === "COD" ? "radio-button-on" : "radio-button-off"}
                size={24}
                color={paymentMethod === "COD" ? colors.primary[600] : colors.neutral[400]}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.neutral[800],
                  marginBottom: 4,
                }}>
                  Cash on Delivery
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.neutral[600],
                }}>
                  Pay when you receive your order at your doorstep
                </Text>
              </View>
              <Ionicons name="cash-outline" size={24} color={colors.neutral[600]} />
            </TouchableOpacity>

            {/* Online Payment */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderWidth: 2,
                borderColor: paymentMethod === "Online" ? colors.primary[600] : colors.neutral[300],
                borderRadius: 12,
                backgroundColor: paymentMethod === "Online" ? colors.primary[50] : 'white',
              }}
              onPress={() => setPaymentMethod("Online")}
            >
              <Ionicons
                name={paymentMethod === "Online" ? "radio-button-on" : "radio-button-off"}
                size={24}
                color={paymentMethod === "Online" ? colors.primary[600] : colors.neutral[400]}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.neutral[800],
                  marginBottom: 4,
                }}>
                  Online Payment
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.neutral[600],
                }}>
                  Pay securely online with card or digital wallet
                </Text>
              </View>
              <Ionicons name="card-outline" size={24} color={colors.neutral[600]} />
            </TouchableOpacity>
          </Card>

          {/* Delivery Info */}
          <Card variant="elevated" style={{ padding: 20, marginBottom: 100 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: colors.neutral[800],
              marginBottom: 16,
            }}>
              🚚 Delivery Information
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <Ionicons name="time-outline" size={20} color={colors.primary[600]} />
              <Text style={{ marginLeft: 12, color: colors.neutral[700], fontSize: 16 }}>
                Estimated delivery: 3-5 business days
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <Ionicons name="location-outline" size={20} color={colors.primary[600]} />
              <Text style={{ marginLeft: 12, color: colors.neutral[700], fontSize: 16 }}>
                Free delivery on orders above LKR 5,000
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
              <Text style={{ marginLeft: 12, color: colors.neutral[700], fontSize: 16 }}>
                100% secure payment and quality guarantee
              </Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Fixed Bottom Place Order */}
      <View style={{
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: colors.neutral[200],
        ...shadows.lg,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{
            fontSize: 16,
            color: colors.neutral[600],
            flex: 1,
          }}>
            {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} • {paymentMethod}
          </Text>
          <Text style={{
            fontSize: 20,
            fontWeight: '900',
            color: colors.primary[600],
          }}>
            LKR {getTotal().toLocaleString()}
          </Text>
        </View>

        <Button
          title={`Place Order - LKR ${getTotal().toLocaleString()}`}
          variant="gradient"
          size="lg"
          icon="checkmark-circle-outline"
          onPress={placeOrder}
          loading={loading}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

export default Checkout;