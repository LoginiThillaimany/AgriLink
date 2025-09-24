import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const API_URL = "http://192.168.1.5:5000/api/products"; // ⚠️ replace with your IP

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Stats
  const total = products.length;
  const inStock = products.filter((p) => p.quantity > 0).length;
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < 5).length;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/products/ProductDetails?id=${item._id}`)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>LKR {item.price} / {item.unit}</Text>
        <Text style={styles.stock}>
          {item.quantity > 0 ? "✅ In Stock" : "❌ Out of Stock"}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/products/EditProduct", params: { id: item._id } })}
      >
        <Ionicons name="pencil" size={22} color="#1976D2" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 15 }}>
      {/* Search */}
      <TextInput
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{total}</Text>
          <Text>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "green" }]}>{inStock}</Text>
          <Text>In Stock</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "red" }]}>{lowStock}</Text>
          <Text>Low Stock</Text>
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 10 }}
        ListEmptyComponent={<Text>No products found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  statNumber: { fontSize: 20, fontWeight: "bold" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "#2E7D32", marginTop: 2 },
  stock: { fontSize: 13, color: "#555", marginTop: 2 },
});
