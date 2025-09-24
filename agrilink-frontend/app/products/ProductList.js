import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../../lib/theme";
import { PRODUCTS_URL } from "../../lib/api";
import { toastError, toastSuccess, toastWrap } from "../../lib/toast";

const API_URL = PRODUCTS_URL;

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

  const handleDelete = async (id) => {
    const confirmed = typeof window !== "undefined" && window.confirm
      ? window.confirm("Are you sure you want to delete this product?")
      : null;

    if (confirmed === false) return;

    if (confirmed === true) {
      try {
        await toastWrap(
          axios.delete(`${API_URL}/${id}`),
          { loading: "Deleting...", success: "Product deleted", error: "Delete failed" }
        );
        toastSuccess("Deleted");
        fetchProducts();
      } catch (error) {
        toastError("Could not delete product");
      }
      return;
    }

    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await toastWrap(
              axios.delete(`${API_URL}/${id}`),
              { loading: "Deleting...", success: "Product deleted", error: "Delete failed" }
            );
            toastSuccess("Deleted");
            fetchProducts();
          } catch (error) {
            toastError("Could not delete product");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleMarkSoldOut = async (id) => {
    try {
      await toastWrap(
        axios.patch(`${API_URL}/${id}/soldout`),
        { loading: "Updating...", success: "Status updated", error: "Update failed" }
      );
      toastSuccess("Product status updated");
      fetchProducts();
    } catch (error) {
      toastError("Could not update product");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => router.push(`/products/ProductDetails?id=${item._id}`)}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>LKR {item.price} / {item.unit}</Text>
        <Text style={styles.stock}>
          {item.soldOut ? "🚫 Sold Out" : item.quantity > 0 ? "✅ In Stock" : "❌ Out of Stock"}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/products/EditProduct", params: { id: item._id } })}
          style={styles.actionButton}
        >
          <Ionicons name="pencil" size={20} color="#1976D2" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash" size={20} color="#d32f2f" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleMarkSoldOut(item._id)}
          style={styles.actionButton}
        >
          <Ionicons name={item.soldOut ? "refresh" : "checkmark"} size={20} color="#388e3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, padding: spacing.lg }}>
      {/* Header Buttons */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/products/AddProduct")}>
          <Text style={styles.headerButtonText}>Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/products/SalesTracking")}>
          <Text style={styles.headerButtonText}>Sales Tracking</Text>
        </TouchableOpacity>
      </View>

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
          <Text style={[styles.statNumber, { color: colors.primary }]}>{inStock}</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  headerButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: radius.md,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    ...shadows.soft,
  },
  headerButtonText: { color: "#fff", fontWeight: "bold" },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  statNumber: { fontSize: 20, fontWeight: "bold" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  actions: { flexDirection: "row" },
  actionButton: { marginLeft: 10 },
  name: { fontSize: 16, fontWeight: "bold", color: colors.text },
  price: { fontSize: 14, color: colors.primaryLight, marginTop: 2 },
  stock: { fontSize: 13, color: "#555", marginTop: 2 },
});
