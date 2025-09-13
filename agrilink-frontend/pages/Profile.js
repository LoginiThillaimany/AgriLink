import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const [user] = useState({
    name: "John Farmer",
    email: "john@farmer.com",
    phone: "+1-234-567-8900",
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => navigation.navigate("Home") },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-green-50 p-4">
      {/* Header */}
      <Text className="text-3xl font-extrabold text-green-800 mb-6">
        👤 Profile
      </Text>

      {/* User Card */}
      <View className="bg-white p-6 rounded-2xl shadow-md items-center mb-6">
        <Image
          source={{
            uri: "https://via.placeholder.com/100x100.png?text=User",
          }}
          style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 16 }}
        />
        <Text className="text-2xl font-bold text-green-800 mb-1">
          {user.name}
        </Text>
        <Text className="text-gray-600">{user.email}</Text>
        <Text className="text-gray-600">{user.phone}</Text>

        <TouchableOpacity
          className="bg-green-600 px-6 py-3 rounded-full mt-4 shadow-sm"
          onPress={() =>
            Alert.alert("Edit Profile", "Edit profile functionality coming soon")
          }
        >
          <Text className="text-white font-bold">✏️ Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Links */}
      <View className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <Text className="text-xl font-bold text-green-800 mb-4">
          📌 Quick Links
        </Text>

        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-gray-100"
          onPress={() => navigation.navigate("OrderHistory")}
        >
          <Ionicons name="receipt-outline" size={22} color="#047857" />
          <Text className="ml-3 text-gray-700 font-semibold">My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-gray-100"
          onPress={() => navigation.navigate("ProductHistory")}
        >
          <Ionicons name="time-outline" size={22} color="#047857" />
          <Text className="ml-3 text-gray-700 font-semibold">
            Product History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={() => Alert.alert("Wishlist", "Wishlist coming soon!")}
        >
          <Ionicons name="heart-outline" size={22} color="#047857" />
          <Text className="ml-3 text-gray-700 font-semibold">Wishlist</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <Text className="text-xl font-bold text-green-800 mb-4">⚙️ Settings</Text>

        {/* Notifications */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={22} color="#047857" />
            <Text className="ml-2 text-gray-700 font-semibold">
              Notifications
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#d1d5db", true: "#10b981" }}
            thumbColor="#fff"
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>

        {/* Dark Mode */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="moon-outline" size={22} color="#047857" />
            <Text className="ml-2 text-gray-700 font-semibold">Dark Mode</Text>
          </View>
          <Switch
            trackColor={{ false: "#d1d5db", true: "#10b981" }}
            thumbColor="#fff"
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        className="bg-red-500 p-4 rounded-full shadow-md mb-10"
        onPress={logout}
      >
        <Text className="text-white text-center font-bold text-lg">
          🚪 Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
