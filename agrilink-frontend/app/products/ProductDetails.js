import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { PRODUCTS_URL } from "../../lib/api";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${PRODUCTS_URL}/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(`${PRODUCTS_URL}/${id}`);
            Alert.alert("Deleted", "Product deleted successfully");
            router.back(); // go back to ProductList
          } catch (error) {
            Alert.alert("Error", "Could not delete product");
          }
        },
        style: "destructive",
      },
    ]);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  if (!product) return <Text style={{ margin: 20 }}>Product not found</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.label}>Category: {product.category}</Text>
      <Text style={styles.label}>Variety: {product.variety}</Text>
      <Text style={styles.label}>Description: {product.description}</Text>
      <Text style={styles.label}>Price: LKR {product.price} / {product.unit}</Text>
      <Text style={styles.label}>Available: {product.quantity}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push(`/products/EditProduct?id=${product._id}`)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  button: { flex: 1, padding: 15, borderRadius: 10, alignItems: "center", marginHorizontal: 5 },
  editButton: { backgroundColor: "#1B5E20" },
  deleteButton: { backgroundColor: "#b71c1c" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
