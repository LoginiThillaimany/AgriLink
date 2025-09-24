import React, { useState, useEffect, useRef } from "react";
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
  StatusBar,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import colors from '../styles/colors';
import shadows from '../styles/shadows';

const { width, height } = Dimensions.get("window");

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories] = useState([
    { id: 1, name: "Seeds", icon: "leaf-outline", color: colors.primary[500], gradient: ['#10b981', '#34d399'] },
    { id: 2, name: "Vegetables", icon: "nutrition-outline", color: colors.secondary[600], gradient: ['#d97706', '#f59e0b'] },
    { id: 3, name: "Fruits", icon: "nutrition-outline", color: colors.error, gradient: ['#ef4444', '#f87171'] },
  ]);
  
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    fetchProducts();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Enhanced mock data with better images
      const mockProducts = [
        // Seeds
        {
          _id: "seed1",
          id: 1,
          name: "Organic Tomato Seeds",
          price: 450,
          description: "High-quality organic tomato seeds from certified farms. Produces juicy, disease-resistant tomatoes.",
          image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Seeds",
          farmer: "farmer1",
          stock: 150,
          unit: "packets",
          rating: 4.8,
          reviews: 124,
          createdAt: "2024-01-15T10:00:00Z"
        },
        {
          _id: "seed2",
          id: 2,
          name: "Premium Wheat Seeds",
          price: 680,
          description: "Premium quality wheat seeds with high yield potential. Suitable for various soil types.",
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Seeds",
          farmer: "farmer2",
          stock: 200,
          unit: "kg",
          rating: 4.5,
          reviews: 78,
          createdAt: "2024-01-20T10:00:00Z"
        },
        {
          _id: "seed3",
          id: 3,
          name: "Hybrid Corn Seeds",
          price: 550,
          description: "High-yielding hybrid corn seeds resistant to common pests and diseases.",
          image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Seeds",
          farmer: "farmer1",
          stock: 100,
          unit: "packets",
          rating: 4.7,
          reviews: 95,
          createdAt: "2024-02-01T10:00:00Z"
        },
        {
          _id: "seed4",
          id: 4,
          name: "Organic Carrot Seeds",
          price: 320,
          description: "Fresh organic carrot seeds that produce sweet, crunchy carrots.",
          image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Seeds",
          farmer: "farmer3",
          stock: 80,
          unit: "packets",
          rating: 4.6,
          reviews: 67,
          createdAt: "2024-02-05T10:00:00Z"
        },

        // Vegetables
        {
          _id: "veg1",
          id: 5,
          name: "Fresh Carrots",
          price: 200,
          description: "Fresh, crunchy carrots harvested this morning. Rich in vitamins and minerals.",
          image: "https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Vegetables",
          farmer: "farmer2",
          stock: 50,
          unit: "kg",
          rating: 4.6,
          reviews: 89,
          createdAt: "2024-01-18T10:00:00Z"
        },
        {
          _id: "veg2",
          id: 6,
          name: "Fresh Broccoli",
          price: 300,
          description: "Nutrient-rich broccoli florets, perfect for healthy meals.",
          image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Vegetables",
          farmer: "farmer1",
          stock: 30,
          unit: "pieces",
          rating: 4.9,
          reviews: 203,
          createdAt: "2024-01-22T10:00:00Z"
        },
        {
          _id: "veg3",
          id: 7,
          name: "Organic Spinach",
          price: 180,
          description: "Fresh organic spinach leaves, grown without pesticides.",
          image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Vegetables",
          farmer: "farmer3",
          stock: 25,
          unit: "kg",
          rating: 4.8,
          reviews: 156,
          createdAt: "2024-01-25T10:00:00Z"
        },
        {
          _id: "veg4",
          id: 8,
          name: "Bell Peppers Mix",
          price: 400,
          description: "Colorful mix of red, yellow, and green bell peppers.",
          image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Vegetables",
          farmer: "farmer2",
          stock: 20,
          unit: "kg",
          rating: 4.7,
          reviews: 134,
          createdAt: "2024-01-28T10:00:00Z"
        },

        // Fruits
        {
          _id: "fruit1",
          id: 9,
          name: "Organic Apples",
          price: 350,
          description: "Sweet and juicy organic apples from local orchards.",
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Fruits",
          farmer: "farmer1",
          stock: 40,
          unit: "kg",
          rating: 4.7,
          reviews: 156,
          createdAt: "2024-01-16T10:00:00Z"
        },
        {
          _id: "fruit2",
          id: 10,
          name: "Banana Bunch",
          price: 250,
          description: "Fresh bananas, perfect for smoothies and snacks.",
          image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Fruits",
          farmer: "farmer3",
          stock: 35,
          unit: "kg",
          rating: 4.8,
          reviews: 167,
          createdAt: "2024-01-19T10:00:00Z"
        },
        {
          _id: "fruit3",
          id: 11,
          name: "Fresh Mangoes",
          price: 450,
          description: "Sweet, tropical mangoes picked at peak ripeness.",
          image: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Fruits",
          farmer: "farmer2",
          stock: 15,
          unit: "kg",
          rating: 4.9,
          reviews: 89,
          createdAt: "2024-02-02T10:00:00Z"
        },
        {
          _id: "fruit4",
          id: 12,
          name: "Organic Oranges",
          price: 280,
          description: "Juicy organic oranges, rich in vitamin C.",
          image: "https://images.unsplash.com/photo-1547514701-84ae1dd6c609?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          category: "Fruits",
          farmer: "farmer1",
          stock: 30,
          unit: "kg",
          rating: 4.6,
          reviews: 112,
          createdAt: "2024-02-08T10:00:00Z"
        },
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id || product.id, quantity: 1 }),
      });
      if (response.ok) {
        // Show success animation or toast
        alert(`${product.name} added to cart! 🛒`);
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Network error");
    }
  };

  const renderCategory = ({ item, index }) => (
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
          {
            scale: scaleAnim,
          },
        ],
      }}
    >
      <TouchableOpacity
        style={{ width: (width - 60) / 3, marginHorizontal: 5 }}
        onPress={() => navigation.navigate("ProductList", { category: item.name })}
        activeOpacity={0.8}
      >
        <Card variant="gradient" style={{ alignItems: 'center', padding: 16 }}>
          <LinearGradient
            colors={item.gradient}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Ionicons name={item.icon} size={24} color="white" />
          </LinearGradient>
          <Text style={{
            color: colors.neutral[800],
            fontWeight: '600',
            fontSize: 12,
            textAlign: 'center',
          }}>
            {item.name}
          </Text>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderProduct = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
          {
            scale: scaleAnim,
          },
        ],
        width: (width - 48) / 2,
        marginBottom: 16,
        marginHorizontal: 4,
      }}
    >
      <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetail", { product: item })}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/200x150?text=Product" }}
            style={{
              width: '100%',
              height: 120,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
            resizeMode="cover"
          />
          
          <View style={{ padding: 12 }}>
            <Text
              style={{
                color: colors.neutral[800],
                fontWeight: '700',
                fontSize: 14,
                marginBottom: 4,
              }}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            
            {item.rating && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="star" size={12} color={colors.secondary[500]} />
                <Text style={{ fontSize: 11, color: colors.neutral[600], marginLeft: 2 }}>
                  {item.rating} ({item.reviews})
                </Text>
              </View>
            )}
            
            <Text style={{
              color: colors.primary[600],
              fontWeight: '800',
              fontSize: 16,
              marginBottom: 8,
            }}>
              LKR {item.price.toLocaleString()}
            </Text>
            
            <Button
              title="Add to Cart"
              variant="gradient"
              size="sm"
              icon="cart-outline"
              onPress={() => addToCart(item)}
              style={{ marginTop: 4 }}
            />
          </View>
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! 🌅";
    if (hour < 17) return "Good Afternoon! ☀️";
    return "Good Evening! 🌙";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[700]} />
      
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Enhanced Header with Gradient */}
        <LinearGradient
          colors={['#064e3b', '#047857', '#10b981']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 28,
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: 4,
                }}>
                  AgriLink 🌱
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500',
                }}>
                  {getGreeting()}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginTop: 2,
                }}>
                  Quality products for modern farmers
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 12,
                    borderRadius: 20,
                    ...shadows.md,
                  }}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Ionicons name="log-in-outline" size={24} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 12,
                    borderRadius: 20,
                    ...shadows.md,
                  }}
                  onPress={() => navigation.navigate("Register")}
                >
                  <Ionicons name="person-add-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Enhanced Search Bar */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 25,
              paddingHorizontal: 20,
              paddingVertical: 12,
              ...shadows.lg,
            }}>
              <Ionicons name="search-outline" size={20} color={colors.neutral[400]} />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: colors.neutral[800],
                }}
                placeholder="Search for seeds, tools, equipment..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.neutral[400]}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color={colors.neutral[400]} />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Categories Section */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: colors.neutral[800],
            }}>
              Shop by Category
            </Text>
            <TouchableOpacity>
              <Text style={{
                color: colors.primary[600],
                fontWeight: '600',
                fontSize: 14,
              }}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal={false}
            numColumns={3}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Featured Products */}
        <View style={{ paddingHorizontal: 20, marginTop: 32, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: colors.neutral[800],
            }}>
              Featured Products
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("ProductList")}>
              <Text style={{
                color: colors.primary[600],
                fontWeight: '600',
                fontSize: 14,
              }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <LoadingSpinner size={50} />
              <Text style={{ marginTop: 16, color: colors.neutral[600] }}>
                Loading products...
              </Text>
            </View>
          ) : (
            <FlatList
              data={products.filter((p) =>
                p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              renderItem={renderProduct}
              keyExtractor={(item, index) => (item._id || item.id || index).toString()}
              numColumns={2}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
});

export default Home;