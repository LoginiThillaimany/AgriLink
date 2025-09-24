import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import colors from "../styles/colors";
import shadows from "../styles/shadows";

const { width } = Dimensions.get("window");

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchCart();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  };

  // ✅ Fetch cart items
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/cart");
      const data = await response.json();
      setCart(data || { items: [] });
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) {
      removeItem(productId);
      return;
    }
    setUpdating({ ...updating, [productId]: true });
    try {
      const response = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQty }),
      });
      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setUpdating({ ...updating, [productId]: false });
    }
  };

  // ✅ Remove item
  const removeItem = async (productId) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
              method: "DELETE",
            });
            if (response.ok) {
              const updatedCart = await response.json();
              setCart(updatedCart);
            }
          } catch (error) {
            console.error("Error removing from cart:", error);
          }
        },
      },
    ]);
  };

  // ✅ Place order
  const placeOrder = async () => {
    if (cart.items.length === 0) {
      Alert.alert("Cart Empty", "Add some products first!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        Alert.alert("Success", "✅ Order placed!");
        navigation.navigate("Orders"); // go to order history
      } else {
        Alert.alert("Error", "❌ Could not place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  // ✅ Helpers
  const getTotal = () =>
    cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  const getItemCount = () =>
    cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Render product in cart
  const renderItem = ({ item }) => (
    <Card variant="elevated" style={{ marginBottom: 16, padding: 0, overflow: "hidden" }}>
      <View style={{ flexDirection: "row", padding: 16 }}>
        <Image
          source={{
            uri: item.productId.image || "https://via.placeholder.com/80x80?text=Product",
          }}
          style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
          resizeMode="cover"
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
            {item.productId.name}
          </Text>
          <Text style={{ fontSize: 14, color: colors.neutral[600], marginBottom: 8 }}>
            {item.productId.category || "General"}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.primary[600] }}>
            LKR {item.productId.price.toLocaleString()}
          </Text>

          {/* Quantity controls */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary[600],
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                ...shadows.sm,
              }}
              onPress={() => updateQuantity(item.productId._id, item.quantity - 1)}
              disabled={updating[item.productId._id]}
            >
              <Ionicons name="remove" size={16} color="white" />
            </TouchableOpacity>

            <Text style={{ marginHorizontal: 16, fontSize: 16, fontWeight: "700" }}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: colors.primary[600],
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                ...shadows.sm,
              }}
              onPress={() => updateQuantity(item.productId._id, item.quantity + 1)}
              disabled={updating[item.productId._id]}
            >
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Remove button */}
        <TouchableOpacity
          style={{ marginLeft: 8, alignSelf: "flex-start" }}
          onPress={() => removeItem(item.productId._id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[700]} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.primary[500]]}
        style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: "800", color: "white" }}>Shopping Cart</Text>
          </View>
          {cart.items.length > 0 && (
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                {getItemCount()} items
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LoadingSpinner size={50} />
          <Text style={{ marginTop: 16, color: colors.neutral[600] }}>Loading cart...</Text>
        </View>
      ) : cart.items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="cart-outline" size={80} color={colors.neutral[300]} />
          <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 16 }}>Your cart is empty</Text>
          <Button title="Start Shopping" variant="gradient" onPress={() => navigation.navigate("Products")} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={cart.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.productId._id}
            contentContainerStyle={{ padding: 20 }}
          />

          {/* Checkout summary */}
          <Card variant="elevated" style={{ margin: 20, padding: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ color: colors.neutral[600] }}>Subtotal</Text>
              <Text style={{ fontWeight: "600" }}>LKR {getTotal().toLocaleString()}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ color: colors.neutral[600] }}>Delivery</Text>
              <Text style={{ color: colors.success, fontWeight: "600" }}>FREE</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: "800" }}>Total</Text>
              <Text style={{ fontSize: 20, fontWeight: "900", color: colors.primary[600] }}>
                LKR {getTotal().toLocaleString()}
              </Text>
            </View>
            <Button
              title="Proceed to Checkout"
              variant="gradient"
              size="lg"
              icon="card-outline"
              onPress={placeOrder}
              fullWidth
              style={{ marginTop: 16 }}
            />
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;
