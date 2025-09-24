// ProductList.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import colors from "../styles/colors";

const { width } = Dimensions.get("window");

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  const navigation = useNavigation();
  const route = useRoute();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const categories = ["All", "Seeds", "Vegetables", "Fruits"];
  const selectedCategory = route.params?.category || "All";

  useEffect(() => {
    fetchProducts();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        // Filter products based on selected category
        const filtered = selectedCategory === "All"
          ? data
          : data.filter(product => product.category === selectedCategory);
        setFilteredProducts(filtered);
      } else {
        // Fallback to dummy data
        const mockProducts = [
          {
            _id: "seed1", id: 1, name: "Organic Tomato Seeds", price: 450,
            description: "High-quality organic tomato seeds from certified farms.",
            image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500",
            category: "Seeds", farmer: "farmer1", stock: 150, unit: "packets",
            rating: 4.8, reviews: 124, createdAt: "2024-01-15T10:00:00Z"
          },
          {
            _id: "veg1", id: 5, name: "Fresh Carrots", price: 200,
            description: "Fresh, crunchy carrots harvested this morning.",
            image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=500",
            category: "Vegetables", farmer: "farmer2", stock: 50, unit: "kg",
            rating: 4.6, reviews: 89, createdAt: "2024-01-18T10:00:00Z"
          },
          {
            _id: "fruit1", id: 9, name: "Organic Apples", price: 350,
            description: "Sweet and juicy organic apples from local orchards.",
            image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500",
            category: "Fruits", farmer: "farmer1", stock: 40, unit: "kg",
            rating: 4.7, reviews: 156, createdAt: "2024-01-16T10:00:00Z"
          },
          // Add more products as needed
        ];
        setProducts(mockProducts);
        const filtered = selectedCategory === "All"
          ? mockProducts
          : mockProducts.filter(product => product.category === selectedCategory);
        setFilteredProducts(filtered);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback to dummy data on network error
      const mockProducts = [
        {
          _id: "seed1", id: 1, name: "Organic Tomato Seeds", price: 450,
          description: "High-quality organic tomato seeds from certified farms.",
          image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500",
          category: "Seeds", farmer: "farmer1", stock: 150, unit: "packets",
          rating: 4.8, reviews: 124, createdAt: "2024-01-15T10:00:00Z"
        },
        {
          _id: "veg1", id: 5, name: "Fresh Carrots", price: 200,
          description: "Fresh, crunchy carrots harvested this morning.",
          image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=500",
          category: "Vegetables", farmer: "farmer2", stock: 50, unit: "kg",
          rating: 4.6, reviews: 89, createdAt: "2024-01-18T10:00:00Z"
        },
        {
          _id: "fruit1", id: 9, name: "Organic Apples", price: 350,
          description: "Sweet and juicy organic apples from local orchards.",
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500",
          category: "Fruits", farmer: "farmer1", stock: 40, unit: "kg",
          rating: 4.7, reviews: 156, createdAt: "2024-01-16T10:00:00Z"
        },
      ];
      setProducts(mockProducts);
      const filtered = selectedCategory === "All"
        ? mockProducts
        : mockProducts.filter(product => product.category === selectedCategory);
      setFilteredProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  // 🛒 Add to Cart
  const addToCart = async (productId) => {
    try {
      await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      Alert.alert("Success", "✅ Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  const renderProduct = ({ item }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        width: (width - 48) / 2,
        marginBottom: 16,
        marginHorizontal: 4,
      }}
    >
      <Card variant="elevated" style={{ padding: 0, overflow: "hidden" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetail", { product: item })}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/200x150?text=Product" }}
            style={{ width: "100%", height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            resizeMode="cover"
          />
          <View style={{ padding: 12 }}>
            <Text style={{ fontWeight: "700", fontSize: 14 }}>{item.name}</Text>
            <Text style={{ fontWeight: "800", fontSize: 16, marginBottom: 8 }}>
              LKR {item.price}
            </Text>
            {/* 🛒 Add to Cart button */}
            <Button
              title="Add to Cart"
              onPress={() => addToCart(item._id)}
              variant="gradient"
              size="sm"
            />
          </View>
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral[50]} />
      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.primary[500]]}
        style={{ padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "white", flex: 1 }}>
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </Text>
          {/* 🛒 Cart Icon → Navigate to Cart Page */}
          <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="cart-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Product Grid */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LoadingSpinner size={50} />
          <Text>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

export default ProductList;
