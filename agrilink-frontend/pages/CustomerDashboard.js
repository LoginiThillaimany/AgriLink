import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import colors from "../styles/colors";

const { width } = Dimensions.get("window");

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    startAnimations();
    loadDummyData();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  };

  const loadDummyData = () => {
    // Dummy products
    const dummyProducts = [
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

    // Dummy orders
    const dummyOrders = [
      {
        _id: "order1",
        items: [
          { name: "Organic Tomato Seeds", quantity: 2, price: 450 },
          { name: "Fresh Carrots", quantity: 3, price: 200 }
        ],
        total: 1900,
        status: "Delivered",
        createdAt: "2024-01-20T10:00:00Z"
      },
      {
        _id: "order2",
        items: [
          { name: "Organic Apples", quantity: 5, price: 350 }
        ],
        total: 1750,
        status: "Shipped",
        createdAt: "2024-02-01T10:00:00Z"
      },
      {
        _id: "order3",
        items: [
          { name: "Fresh Carrots", quantity: 2, price: 200 },
          { name: "Organic Apples", quantity: 2, price: 350 }
        ],
        total: 1100,
        status: "Pending",
        createdAt: "2024-02-10T10:00:00Z"
      }
    ];

    setProducts(dummyProducts);
    setOrders(dummyOrders);
    calculateStats(dummyOrders);
    setLoading(false);
  };

  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.length;
    const totalSpent = ordersData.reduce((sum, order) => sum + order.total, 0);
    setStats({ totalOrders, totalSpent });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return colors.success;
      case "Shipped": return colors.primary;
      case "Pending": return colors.warning;
      default: return colors.neutral;
    }
  };

  const renderOrder = ({ item }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        marginBottom: 12,
      }}
    >
      <Card variant="elevated" style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.neutral[800] }}>
            Order #{item._id.slice(-6)}
          </Text>
          <View style={{
            backgroundColor: getStatusColor(item.status) + '20',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}>
            <Text style={{
              color: getStatusColor(item.status),
              fontSize: 12,
              fontWeight: '600'
            }}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 14, color: colors.neutral[600], marginBottom: 8 }}>
          📅 {new Date(item.createdAt).toLocaleDateString()}
        </Text>

        <Text style={{ fontSize: 12, color: colors.neutral[500], marginBottom: 8 }}>
          {item.items.length} item{item.items.length !== 1 ? 's' : ''}
        </Text>

        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary[600] }}>
          LKR {item.total.toFixed(2)}
        </Text>
      </Card>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[700]} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.primary[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: 'center',
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: 16,
            borderRadius: 20,
            marginBottom: 16,
          }}>
            <Ionicons name="person" size={32} color="white" />
          </View>

          <Text style={{
            fontSize: 28,
            fontWeight: '900',
            color: 'white',
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Welcome back!
          </Text>

          <Text style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            fontWeight: '500',
          }}>
            {user?.name || 'Customer'}
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Stats Cards */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <Card variant="elevated" style={{ flex: 1, padding: 20, alignItems: 'center' }}>
              <Ionicons name="receipt" size={32} color={colors.primary[600]} />
              <Text style={{ fontSize: 24, fontWeight: '800', color: colors.neutral[800], marginTop: 8 }}>
                {stats.totalOrders}
              </Text>
              <Text style={{ color: colors.neutral[600], fontSize: 14 }}>Total Orders</Text>
            </Card>

            <Card variant="elevated" style={{ flex: 1, padding: 20, alignItems: 'center' }}>
              <Ionicons name="cash" size={32} color={colors.success} />
              <Text style={{ fontSize: 24, fontWeight: '800', color: colors.neutral[800], marginTop: 8 }}>
                LKR {stats.totalSpent.toFixed(2)}
              </Text>
              <Text style={{ color: colors.neutral[600], fontSize: 14 }}>Total Spent</Text>
            </Card>
          </View>

          {/* Quick Actions */}
          <Card variant="elevated" style={{ padding: 20, marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.neutral[800],
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Quick Actions
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProductList")}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary[500],
                  padding: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Ionicons name="basket" size={24} color="white" />
                <Text style={{ color: 'white', fontWeight: '600', marginTop: 4 }}>Shop Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Cart")}
                style={{
                  flex: 1,
                  backgroundColor: colors.secondary[500],
                  padding: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Ionicons name="cart" size={24} color="white" />
                <Text style={{ color: 'white', fontWeight: '600', marginTop: 4 }}>My Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                style={{
                  flex: 1,
                  backgroundColor: colors.neutral[600],
                  padding: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Ionicons name="person" size={24} color="white" />
                <Text style={{ color: 'white', fontWeight: '600', marginTop: 4 }}>Profile</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Featured Products */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '800',
                color: colors.neutral[800],
              }}>
                Featured Products
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("ProductList")}>
                <Text style={{ color: colors.primary[600], fontWeight: '600' }}>View All</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
                <Text style={{ marginTop: 16, color: colors.neutral[600] }}>
                  Loading products...
                </Text>
              </View>
            ) : (
              <FlatList
                data={products}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ProductDetail", { product: item })}
                    style={{
                      width: width * 0.7,
                      marginRight: 12,
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: '100%', height: 120, borderRadius: 12 }}
                      resizeMode="cover"
                    />
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: colors.neutral[800],
                      marginTop: 12,
                      marginBottom: 4,
                    }} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '800',
                      color: colors.primary[600],
                    }}>
                      LKR {item.price}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>

          {/* Recent Orders */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '800',
                color: colors.neutral[800],
              }}>
                Recent Orders
              </Text>
              {orders.length > 0 && (
                <TouchableOpacity onPress={() => navigation.navigate("OrderHistory")}>
                  <Text style={{ color: colors.primary[600], fontWeight: '600' }}>View All</Text>
                </TouchableOpacity>
              )}
            </View>

            {orders.length === 0 ? (
              <Card variant="elevated" style={{ padding: 40, alignItems: 'center' }}>
                <Ionicons name="receipt-outline" size={64} color={colors.neutral[400]} />
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.neutral[600],
                  marginTop: 16,
                  marginBottom: 8,
                }}>
                  No orders yet
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.neutral[500],
                  textAlign: 'center',
                  marginBottom: 24,
                }}>
                  Start shopping to see your order history here
                </Text>
                <Button
                  title="Browse Products"
                  onPress={() => navigation.navigate("Home")}
                  variant="gradient"
                />
              </Card>
            ) : (
              <FlatList
                data={orders.slice(0, 3)}
                renderItem={renderOrder}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
              />
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerDashboard;