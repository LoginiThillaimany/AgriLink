import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    fetchOrders();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [orders, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5000/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        // Fallback to dummy data
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
          },
          {
            _id: "order4",
            items: [
              { name: "Premium Wheat Seeds", quantity: 1, price: 680 },
              { name: "Fresh Broccoli", quantity: 4, price: 300 }
            ],
            total: 2280,
            status: "Delivered",
            createdAt: "2024-01-15T10:00:00Z"
          }
        ];
        setOrders(dummyOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback to dummy data on network error
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
        }
      ];
      setOrders(dummyOrders);
      setError("Failed to load orders. Showing demo data.");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case "Delivered":
        return { color: ["#10B981", "#059669"], icon: "checkmark-circle", textColor: "#FFFFFF" };
      case "Shipped":
        return { color: ["#3B82F6", "#2563EB"], icon: "car-outline", textColor: "#FFFFFF" };
      case "Pending":
        return { color: ["#F59E0B", "#D97706"], icon: "time-outline", textColor: "#FFFFFF" };
      case "Cancelled":
        return { color: ["#EF4444", "#DC2626"], icon: "close-circle", textColor: "#FFFFFF" };
      default:
        return { color: ["#6B7280", "#4B5563"], icon: "help-circle-outline", textColor: "#FFFFFF" };
    }
  };

  const renderOrder = ({ item, index }) => {
    const status = getStatus(item.status);
    const itemAnim = new Animated.Value(0);

    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        style={{
          opacity: itemAnim,
          transform: [{ translateY: itemAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }}
      >
        <LinearGradient
          colors={["#FFFFFF", "#F9FAFB"]}
          className="p-6 mb-4 rounded-3xl shadow-lg border border-gray-100"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Order #{item._id.slice(-8)}
            </Text>
            <LinearGradient colors={status.color} className="px-4 py-2 rounded-full">
              <View className="flex-row items-center">
                <Ionicons name={status.icon} size={18} color={status.textColor} />
                <Text className="text-white text-sm font-semibold ml-2">
                  {item.status}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Date & Total */}
          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-1">
              📅 {new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Text className="text-2xl font-extrabold text-green-600">
              LKR {item.total.toFixed(2)}
            </Text>
          </View>

          {/* Items */}
          <Text className="text-lg font-bold text-gray-800 mb-3">Items</Text>
          {item.items.map((orderItem, index) => (
            <View
              key={index}
              className="flex-row justify-between py-2 border-b border-gray-200"
            >
              <Text className="text-gray-700 flex-1">
                {orderItem.name}
              </Text>
              <Text className="text-gray-500 mr-2">×{orderItem.quantity}</Text>
              <Text className="text-green-600 font-semibold">
                LKR {(orderItem.price * orderItem.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Actions */}
          <View className="mt-6 space-y-3">
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-2xl shadow-md"
              onPress={() =>
                Alert.alert("Track Order", `Tracking for Order #${item._id}`)
              }
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="location-outline" size={20} color="white" />
                <Text className="text-white text-center font-semibold ml-2">Track Order</Text>
              </View>
            </TouchableOpacity>

            {item.status !== "Cancelled" && item.status !== "Delivered" && (
              <TouchableOpacity
                className="bg-red-500 p-4 rounded-2xl shadow-md"
                onPress={async () => {
                  Alert.alert(
                    "Cancel Order",
                    "Are you sure you want to cancel this order?",
                    [
                      { text: "No", style: "cancel" },
                      {
                        text: "Yes",
                        onPress: async () => {
                          try {
                            const response = await fetch(
                              `http://localhost:5000/api/orders/${item._id}/cancel`,
                              { method: "DELETE" }
                            );
                            if (response.ok) {
                              const updatedOrder = await response.json();
                              setOrders(
                                orders.map((o) =>
                                  o._id === item._id ? updatedOrder : o
                                )
                              );
                              Alert.alert("Success", "Order cancelled successfully");
                            }
                          } catch (error) {
                            console.error("Error cancelling order:", error);
                            Alert.alert("Error", "Failed to cancel order");
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="close-circle-outline" size={20} color="white" />
                  <Text className="text-white text-center font-semibold ml-2">Cancel Order</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="bg-green-500 p-4 rounded-2xl shadow-md"
              onPress={async () => {
                try {
                  const response = await fetch(
                    `http://localhost:5000/api/orders/${item._id}/reorder`,
                    { method: "POST" }
                  );
                  if (response.ok) {
                    navigation.navigate("Cart");
                    Alert.alert("Success", "Items added to cart for reorder");
                  }
                } catch (error) {
                  console.error("Error reordering:", error);
                  Alert.alert("Error", "Failed to reorder");
                }
              }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="refresh-outline" size={20} color="white" />
                <Text className="text-white text-center font-semibold ml-2">Reorder</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4 text-lg">Loading your orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 justify-center items-center p-6">
        <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
        <Text className="text-red-600 text-lg mt-4 text-center">{error}</Text>
        <TouchableOpacity
          className="bg-green-500 px-8 py-4 rounded-2xl mt-6 shadow-lg"
          onPress={fetchOrders}
        >
          <Text className="text-white font-bold text-lg">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
      <LinearGradient colors={["#10B981", "#059669"]} className="pt-12 pb-6">
        <View className="px-6">
          <Text className="text-3xl font-extrabold text-white mb-2">
            📦 Order History
          </Text>
          <Text className="text-green-100 text-lg">Track your past purchases</Text>
        </View>
      </LinearGradient>

      <View className="flex-1 bg-gray-50">
        {/* Search Bar */}
        <View className="px-6 py-4">
          <View className="bg-white rounded-2xl shadow-md flex-row items-center px-4 py-3">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-700"
              placeholder="Search orders by ID or status..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 24, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Ionicons name="receipt-outline" size={100} color="#D1D5DB" />
              <Text className="text-gray-500 text-xl mt-6 font-semibold">
                {searchQuery ? "No matching orders found" : "No orders yet"}
              </Text>
              <Text className="text-gray-400 text-center mt-2 px-8">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Your order history will appear here once you make your first purchase"
                }
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  className="bg-green-500 px-8 py-4 rounded-2xl mt-8 shadow-lg"
                  onPress={() => navigation.navigate("Home")}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="basket-outline" size={20} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Start Shopping
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    </Animated.View>
  );
};

export default OrderHistory;
