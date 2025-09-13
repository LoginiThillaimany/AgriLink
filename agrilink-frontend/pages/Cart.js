import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const navigation = useNavigation();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cart");
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) {
      removeItem(productId);
      return;
    }
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
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const getTotal = () => {
    return cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );
  };

  const checkout = async () => {
    if (cart.items.length === 0) {
      Alert.alert("Cart Empty", "Your cart is empty!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
      });
      if (response.ok) {
        const order = await response.json();
        Alert.alert(
          "✅ Order Placed",
          `Total: LKR ${getTotal().toFixed(2)}\nOrder ID: ${order._id}`
        );
        await fetch("http://localhost:5000/api/cart/clear", { method: "DELETE" });
        setCart({ items: [] });
        navigation.navigate("OrderHistory");
      } else {
        Alert.alert("Error", "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Network error");
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-white p-4 mb-4 rounded-2xl shadow-md flex-row items-center">
      <Image
        source={{
          uri:
            item.productId.image ||
            "https://via.placeholder.com/80x80?text=Product",
        }}
        className="w-20 h-20 rounded-xl mr-4"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-green-800 font-bold text-lg">
          {item.productId.name}
        </Text>
        <Text className="text-gray-600 mb-2">
          LKR {item.productId.price} each
        </Text>

        {/* Quantity Controls */}
        <View className="flex-row items-center mt-1">
          <TouchableOpacity
            className="bg-green-600 w-8 h-8 rounded-full items-center justify-center"
            onPress={() => updateQuantity(item.productId._id, item.quantity - 1)}
          >
            <Text className="text-white text-lg font-bold">-</Text>
          </TouchableOpacity>

          <TextInput
            className="mx-3 border border-green-300 rounded-lg w-12 h-8 text-center text-gray-700"
            value={item.quantity.toString()}
            onChangeText={(text) =>
              updateQuantity(item.productId._id, parseInt(text) || 1)
            }
            keyboardType="numeric"
          />

          <TouchableOpacity
            className="bg-green-600 w-8 h-8 rounded-full items-center justify-center"
            onPress={() => updateQuantity(item.productId._id, item.quantity + 1)}
          >
            <Text className="text-white text-lg font-bold">+</Text>
          </TouchableOpacity>

          {/* Remove Button */}
          <TouchableOpacity
            className="ml-4 flex-row items-center"
            onPress={() => removeItem(item.productId._id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text className="text-red-500 ml-1">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-green-50 p-4">
      <Text className="text-3xl font-extrabold text-green-800 mb-6">
        🛒 Shopping Cart
      </Text>

      {cart.items.length === 0 ? (
        <View className="items-center mt-12">
          <Ionicons name="cart-outline" size={80} color="#9ca3af" />
          <Text className="text-gray-600 text-lg mt-4">
            Your cart is empty
          </Text>
          <TouchableOpacity
            className="bg-green-600 px-6 py-3 rounded-full mt-6 shadow-md"
            onPress={() => navigation.navigate("Home")}
          >
            <Text className="text-white font-bold text-lg">
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <FlatList
            data={cart.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.productId._id.toString()}
            scrollEnabled={false}
          />

          {/* Total + Checkout */}
          <View className="bg-white p-6 rounded-2xl shadow-md mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-green-800">Total</Text>
              <Text className="text-2xl font-extrabold text-green-700">
                LKR {getTotal().toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-green-600 p-4 rounded-full shadow-md"
              onPress={checkout}
            >
              <Text className="text-white text-center font-bold text-lg">
                ✅ Place Order
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Cart;
