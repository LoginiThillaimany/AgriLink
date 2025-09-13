import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ProductDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <View className="flex-1 bg-green-50 p-4 justify-center items-center">
        <Text className="text-gray-600">Product not found</Text>
      </View>
    );
  }

  const addToCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      if (response.ok) {
        Alert.alert("✅ Added to cart!");
        navigation.navigate("Cart");
      } else {
        Alert.alert("❌ Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("⚠️ Network error");
    }
  };

  return (
    <View className="flex-1 bg-green-50">
      {/* Scrollable content */}
      <ScrollView className="flex-1 p-4">
        {/* Back Button */}
        <TouchableOpacity
          className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#047857" />
        </TouchableOpacity>

        {/* Product Image */}
        <Image
          source={{
            uri:
              product.image ||
              "https://via.placeholder.com/300x300?text=Product",
          }}
          className="w-full h-72 rounded-2xl mb-6 shadow-lg"
          resizeMode="cover"
        />

        {/* Product Info */}
        <View className="mb-6">
          <Text className="text-3xl font-extrabold text-green-800 mb-2">
            {product.name}
          </Text>

          <View className="flex-row items-center mb-2">
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 font-semibold text-sm">
                {product.category || "General"}
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-extrabold text-green-700 mb-2">
            LKR {product.price}
          </Text>
        </View>

        {/* Description */}
        <View className="bg-white p-5 rounded-2xl shadow mb-6">
          <Text className="text-lg font-bold text-green-800 mb-2">
            Description
          </Text>
          <Text className="text-gray-600 leading-6">
            {product.description || "No description available."}
          </Text>
        </View>

        {/* Quantity */}
        <View className="bg-white p-5 rounded-2xl shadow mb-6">
          <Text className="text-lg font-bold text-green-800 mb-3">Quantity</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="bg-green-600 w-10 h-10 rounded-full items-center justify-center"
              onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              <Text className="text-white text-xl font-bold">-</Text>
            </TouchableOpacity>
            <Text className="mx-6 text-xl font-bold text-gray-800">
              {quantity}
            </Text>
            <TouchableOpacity
              className="bg-green-600 w-10 h-10 rounded-full items-center justify-center"
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text className="text-white text-xl font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Add to Cart */}
      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="bg-green-600 p-4 rounded-full shadow-md"
          onPress={addToCart}
        >
          <Text className="text-white text-center font-bold text-lg">
            🛒 Add {quantity} to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetail;
