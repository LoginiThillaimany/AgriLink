import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const route = useRoute();
  const navigation = useNavigation();

  const categories = ["All", "Seeds", "Fertilizers", "Tools", "Pesticides"];

  useEffect(() => {
    fetchProducts();
    if (route.params) {
      if (route.params.search) setSearchQuery(route.params.search);
      if (route.params.category) setSelectedCategory(route.params.category);
    }
  }, [route.params]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, minPrice, maxPrice, products]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      className="bg-white p-4 m-2 rounded-2xl shadow-md w-[48%]"
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <Image
        source={{
          uri:
            item.image || "https://via.placeholder.com/150x150?text=Product",
        }}
        className="w-full h-28 rounded-xl mb-3"
        resizeMode="cover"
      />
      <Text
        className="text-green-800 font-bold text-base mb-1"
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <Text className="text-gray-600 text-sm mb-1">
        {item.category || "General"}
      </Text>
      <Text className="text-green-700 font-extrabold text-lg">
        LKR {item.price}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-green-50 p-4">
      {/* Header */}
      <Text className="text-3xl font-extrabold text-green-800 mb-6">
        🛍 Products
      </Text>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white rounded-full shadow-sm px-4 py-3 mb-4">
        <Ionicons name="search-outline" size={20} color="#6b7280" />
        <TextInput
          className="flex-1 ml-2 text-gray-700"
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Card */}
      <View className="bg-white p-4 rounded-2xl shadow mb-5">
        <Text className="text-lg font-bold text-green-800 mb-3 flex-row items-center">
          <Ionicons name="filter-outline" size={18} color="#047857" /> Filters
        </Text>

        {/* Category Picker */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Category</Text>
          <View className="border border-green-300 rounded-xl overflow-hidden">
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val)}
            >
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Price Range */}
        <View className="flex-row">
          <View className="flex-1 mr-2">
            <Text className="text-gray-600 mb-1">Min Price</Text>
            <TextInput
              className="bg-green-50 p-3 rounded-lg border border-green-300"
              placeholder="0"
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-600 mb-1">Max Price</Text>
            <TextInput
              className="bg-green-50 p-3 rounded-lg border border-green-300"
              placeholder="1000"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <View className="items-center mt-20">
          <Ionicons name="leaf-outline" size={80} color="#9ca3af" />
          <Text className="text-gray-600 text-lg mt-4">
            No products found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id || item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ProductList;
