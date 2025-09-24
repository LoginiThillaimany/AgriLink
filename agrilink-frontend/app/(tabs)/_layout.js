import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#1B5E20",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 60, backgroundColor: "#fff" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="products/ProductList"
        options={{
          title: "Products",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Floating Add Button (not a real screen) */}
     <Tabs.Screen
        name="addButton"
        options={{
            href: null,
            tabBarButton: () => (
            <TouchableOpacity
                onPress={() => router.push("/products/AddProduct")}
                style={{
                width: 65,
                height: 65,
                borderRadius: 35,
                backgroundColor: "#1B5E20",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 25,
                }}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
            ),
        }}
        />
        
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
