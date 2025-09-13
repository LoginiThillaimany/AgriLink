import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories] = useState([
    { id: 1, name: "Seeds", icon: "leaf-outline", color: "#4CAF50" },
    { id: 2, name: "Tools", icon: "hammer-outline", color: "#795548" },
    { id: 3, name: "Pesticides", icon: "bug-outline", color: "#F44336" },
    { id: 4, name: "Irrigation", icon: "water-outline", color: "#2196F3" },
    { id: 5, name: "Equipment", icon: "construct-outline", color: "#607D8B" },
  ]);
  const navigation = useNavigation();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchProducts();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchProducts = async () => {
    try {
      const mockProducts = [
        {
          id: 1,
          name: "Organic Tomato Seeds",
          price: 450,
          image:
            "https://images.unsplash.com/photo-1603083720651-5e6b62e74685?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
          category: "Seeds",
        },
        {
          id: 2,
          name: "Gardening Tool Set",
          price: 3500,
          image:
            "https://images.unsplash.com/photo-1585397519362-32b54557b730?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
          category: "Tools",
        },
        {
          id: 3,
          name: "Eco-Friendly Pesticide",
          price: 850,
          image:
            "https://images.unsplash.com/photo-1589923188937-cb64779f4abe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
          category: "Pesticides",
        },
        {
          id: 4,
          name: "Drip Irrigation Kit",
          price: 5500,
          image:
            "https://images.unsplash.com/photo-1611457477187-0b2382945e2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
          category: "Irrigation",
        },
        {
          id: 5,
          name: "Wheat Seeds Premium",
          price: 680,
          image:
            "https://images.unsplash.com/photo-1590172205846-69889b2a1bcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
          category: "Seeds",
        },
        {
          id: 6,
          name: "Electric Tiller",
          price: 12500,
          image:
            "https://images.unsplash.com/photo-1621525953856-7fed6574f12f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
          category: "Equipment",
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product) => {
    alert(`${product.name} added to cart!`);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={{ width: width / 3 - 20 }}
      className="items-center justify-center m-2"
      onPress={() => navigation.navigate("ProductList", { category: item.name })}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <View
          className="w-20 h-20 rounded-full items-center justify-center shadow-md mb-2"
          style={{ backgroundColor: item.color + "15" }}
        >
          <Ionicons name={item.icon} size={30} color={item.color} />
        </View>
        <Text className="text-green-900 font-medium text-sm text-center">
          {item.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <View
        className="bg-white rounded-xl shadow-lg p-3 m-2"
        style={{ width: width / 2 - 24 }}
      >
        <Image
          source={{
            uri: item.image || "https://via.placeholder.com/150x150?text=Product",
          }}
          className="w-full h-40 rounded-lg mb-3"
          resizeMode="cover"
        />
        <Text
          className="text-green-900 font-semibold text-sm"
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text className="text-gray-600 mb-3 text-sm">
          LKR {item.price.toLocaleString()}
        </Text>
        <TouchableOpacity
          className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center justify-center"
          onPress={() => addToCart(item)}
        >
          <Ionicons name="cart-outline" size={18} color="white" />
          <Text className="text-white text-sm font-medium ml-2">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View className="flex-row justify-between items-center mb-5">
            <View>
              <Text className="text-4xl font-extrabold text-white tracking-tight">
                AgriLink 🌱
              </Text>
              <Text className="text-white opacity-80 text-base mt-1">
                Quality products for farmers
              </Text>
            </View>
            <TouchableOpacity className="bg-white p-2.5 rounded-full shadow-sm">
              <Ionicons name="notifications-outline" size={26} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-white rounded-full shadow-lg px-4 py-3.5">
            <Ionicons name="search-outline" size={22} color="#9e9e9e" />
            <TextInput
              className="flex-1 ml-3 text-gray-800 text-base"
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9e9e9e"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={22} color="#9e9e9e" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Categories */}
        <View className="px-5 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-green-900">
              Shop by Category
            </Text>
            <TouchableOpacity>
              <Text className="text-green-600 font-medium text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal={false}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: "flex-start" }}
            className="mb-6"
          />
        </View>

        {/* Featured Products */}
        <View className="px-5 mt-2 mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-green-900">
              Featured Products
            </Text>
            <TouchableOpacity>
              <Text className="text-green-600 font-medium text-sm">View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products.filter((p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default Home;