import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "bg-green-500", icon: "checkmark-circle" };
      case "Shipped":
        return { color: "bg-blue-500", icon: "car-outline" };
      case "Pending":
        return { color: "bg-yellow-500", icon: "time-outline" };
      case "Cancelled":
        return { color: "bg-red-500", icon: "close-circle" };
      default:
        return { color: "bg-gray-500", icon: "help-circle-outline" };
    }
  };

  const renderOrder = ({ item }) => {
    const status = getStatus(item.status);

    return (
      <View className="bg-white p-5 mb-5 rounded-2xl shadow-md">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-green-800">
            Order #{item._id}
          </Text>
          <View
            className={`flex-row items-center px-3 py-1 rounded-full ${status.color}`}
          >
            <Ionicons name={status.icon} size={16} color="white" />
            <Text className="text-white text-sm font-semibold ml-1">
              {item.status}
            </Text>
          </View>
        </View>

        {/* Date & Total */}
        <View className="mb-3">
          <Text className="text-gray-600 text-sm">
            📅 {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text className="text-xl font-extrabold text-green-700 mt-1">
            💰 LKR {item.total.toFixed(2)}
          </Text>
        </View>

        {/* Items */}
        <Text className="text-base font-bold text-green-800 mb-2">Items</Text>
        {item.items.map((orderItem, index) => (
          <View
            key={index}
            className="flex-row justify-between py-1 border-b border-gray-100"
          >
            <Text className="text-gray-700">
              {orderItem.name} ×{orderItem.quantity}
            </Text>
            <Text className="text-green-600 font-semibold">
              LKR {(orderItem.price * orderItem.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Actions */}
        <View className="flex-row mt-4">
          <TouchableOpacity
            className="bg-green-600 flex-1 p-3 rounded-full mr-2 shadow-sm"
            onPress={() =>
              Alert.alert("Track Order", `Tracking for Order #${item._id}`)
            }
          >
            <Text className="text-white text-center font-semibold">🚚 Track</Text>
          </TouchableOpacity>

          {item.status !== "Cancelled" && (
            <TouchableOpacity
              className="bg-red-500 flex-1 p-3 rounded-full ml-2 shadow-sm"
              onPress={async () => {
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
                    Alert.alert("Cancelled", "Order cancelled successfully");
                  }
                } catch (error) {
                  console.error("Error cancelling order:", error);
                  Alert.alert("Error", "Failed to cancel order");
                }
              }}
            >
              <Text className="text-white text-center font-semibold">
                ❌ Cancel
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="bg-yellow-500 flex-1 p-3 rounded-full ml-2 shadow-sm"
            onPress={async () => {
              try {
                const response = await fetch(
                  `http://localhost:5000/api/orders/${item._id}/reorder`,
                  { method: "POST" }
                );
                if (response.ok) {
                  navigation.navigate("Cart");
                  Alert.alert("Reorder", "Items added to cart for reorder");
                }
              } catch (error) {
                console.error("Error reordering:", error);
                Alert.alert("Error", "Failed to reorder");
              }
            }}
          >
            <Text className="text-white text-center font-semibold">
              🔄 Reorder
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-green-50 p-4">
      <Text className="text-3xl font-extrabold text-green-800 mb-6">
        📦 Order History
      </Text>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
      />

      {orders.length === 0 && (
        <View className="items-center mt-20">
          <Ionicons name="receipt-outline" size={80} color="#9ca3af" />
          <Text className="text-gray-600 text-lg mt-4">No orders yet</Text>
          <TouchableOpacity
            className="bg-green-600 px-6 py-3 rounded-full mt-6 shadow-md"
            onPress={() => navigation.navigate("Home")}
          >
            <Text className="text-white font-bold text-lg">
              🛒 Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default OrderHistory;
