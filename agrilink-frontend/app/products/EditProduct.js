import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useSearchParams, router } from "expo-router";
import axios from "axios";

const API_URL = "http://192.168.1.5:5000/api/products"; // change IP

export default function EditProduct() {
  const { id } = useSearchParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setForm(res.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not load product data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/${id}`, form);
      Alert.alert("Success", "Product updated successfully");
      router.back(); // return to ProductDetails
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not update product");
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  if (!form) return <Text style={{ margin: 20 }}>Product not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

      <Text style={styles.label}>Product Name</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={(t) => handleChange("name", t)} />

      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} value={form.category} onChangeText={(t) => handleChange("category", t)} />

      <Text style={styles.label}>Variety</Text>
      <TextInput style={styles.input} value={form.variety} onChangeText={(t) => handleChange("variety", t)} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={form.description}
        onChangeText={(t) => handleChange("description", t)}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(form.price)}
        onChangeText={(t) => handleChange("price", t)}
      />

      <Text style={styles.label}>Unit</Text>
      <TextInput style={styles.input} value={form.unit} onChangeText={(t) => handleChange("unit", t)} />

      <Text style={styles.label}>Available Quantity</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(form.quantity)}
        onChangeText={(t) => handleChange("quantity", t)}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: { backgroundColor: "#1B5E20", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
