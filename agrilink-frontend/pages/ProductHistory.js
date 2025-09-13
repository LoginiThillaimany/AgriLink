import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ProductHistory = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([
    {
      id: 1,
      name: "Organic Seeds",
      price: 10,
      image: "https://via.placeholder.com/150x150?text=Seeds",
    },
    {
      id: 2,
      name: "Fertilizer Pack",
      price: 25,
      image: "https://via.placeholder.com/150x150?text=Fert",
    },
  ]);
  const [purchased, setPurchased] = useState([
    {
      id: 3,
      name: "Garden Tools",
      price: 15,
      image: "https://via.placeholder.com/150x150?text=Tools",
    },
    {
      id: 4,
      name: "Pesticides",
      price: 20,
      image: "https://via.placeholder.com/150x150?text=Pest",
    },
  ]);
  const navigation = useNavigation();

  const renderProductCard = (item) => (
    <TouchableOpacity
      className="bg-white p-3 rounded-2xl shadow-md m-2 w-40"
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-28 rounded-xl mb-2"
        resizeMode="cover"
      />
      <Text
        className="text-green-800 font-bold text-sm mb-1"
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <Text className="text-green-600 font-semibold">LKR {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-green-50 p-4">
      {/* Header */}
      <Text className="text-3xl font-extrabold text-green-800 mb-6">
        📜 Product History
      </Text>

      {/* Recently Viewed */}
      <View className="mb-8">
        <View className="flex-row items-center mb-3">
          <Ionicons name="eye-outline" size={20} color="#047857" />
          <Text className="ml-2 text-xl font-bold text-green-800">
            Recently Viewed
          </Text>
        </View>

        {recentlyViewed.length === 0 ? (
          <Text className="text-gray-500">No recently viewed products</Text>
        ) : (
          <FlatList
            data={recentlyViewed}
            renderItem={({ item }) => renderProductCard(item)}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* Purchased Products */}
      <View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="cart-outline" size={20} color="#047857" />
          <Text className="ml-2 text-xl font-bold text-green-800">
            Purchased Products
          </Text>
        </View>

        {purchased.length === 0 ? (
          <View className="items-center mt-6">
            <Ionicons name="bag-outline" size={50} color="#9ca3af" />
            <Text className="text-gray-500 mt-2">
              You haven’t purchased anything yet
            </Text>
            <TouchableOpacity
              className="bg-green-600 px-6 py-3 rounded-full mt-4 shadow-md"
              onPress={() => navigation.navigate("Home")}
            >
              <Text className="text-white font-bold">🛒 Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={purchased}
            renderItem={({ item }) => renderProductCard(item)}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default ProductHistory;
