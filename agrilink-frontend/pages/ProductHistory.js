import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import colors from "../styles/colors";

const { width } = Dimensions.get("window");

const ProductHistory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const navigation = useNavigation();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (user) {
      fetchFarmerProducts();
    }
    startAnimations();
  }, [user]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  };

  const fetchFarmerProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/farmer/${user.userId}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching farmer products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    // Navigate to AddProduct with product data for editing
    navigation.navigate("AddProduct", { product });
  };

  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE",
              });
              if (response.ok) {
                Alert.alert("Success", "Product deleted successfully!");
                fetchFarmerProducts(); // Refresh the list
              } else {
                Alert.alert("Error", "Failed to delete product");
              }
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Something went wrong!");
            }
          },
        },
      ]
    );
  };

  const filteredProducts = products
    .filter(product =>
      product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  const renderProductCard = ({ item }) => (
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
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/200x150?text=Product" }}
          style={{ width: "100%", height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          resizeMode="cover"
        />
        <View style={{ padding: 12 }}>
          <Text style={{ fontWeight: "700", fontSize: 14, marginBottom: 4 }} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={{ fontWeight: "800", fontSize: 16, marginBottom: 4 }}>
            LKR {item.price}
          </Text>
          <Text style={{ fontSize: 12, color: colors.neutral[600], marginBottom: 8 }}>
            Added: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          {item.description && (
            <Text style={{ fontSize: 12, color: colors.neutral[500], marginBottom: 8 }} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button
              title="Edit"
              onPress={() => handleEditProduct(item)}
              variant="outline"
              size="sm"
              style={{ flex: 1, marginRight: 4 }}
            />
            <Button
              title="Delete"
              onPress={() => handleDeleteProduct(item._id)}
              variant="danger"
              size="sm"
              style={{ flex: 1, marginLeft: 4 }}
            />
          </View>
        </View>
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
            My Products
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddProduct")}>
            <Ionicons name="add-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Product Grid */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LoadingSpinner size={50} />
          <Text style={{ marginTop: 16, color: colors.neutral[600] }}>
            Loading your products...
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Ionicons name="leaf-outline" size={64} color={colors.neutral[400]} />
          <Text style={{ fontSize: 18, fontWeight: "600", color: colors.neutral[600], marginTop: 16 }}>
            No products added yet
          </Text>
          <Text style={{ fontSize: 14, color: colors.neutral[500], textAlign: "center", marginTop: 8 }}>
            Start by adding your first product to showcase to customers
          </Text>
          <Button
            title="Add Product"
            onPress={() => navigation.navigate("AddProduct")}
            variant="gradient"
            style={{ marginTop: 24 }}
          />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default ProductHistory;
