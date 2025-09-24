import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";


export default function AddProduct({ navigation }) {
  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [variety, setVariety] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [harvestDate, setHarvestDate] = useState(new Date());
  const [bestByDate, setBestByDate] = useState(new Date());
  const [deliveryOptions, setDeliveryOptions] = useState([]);

  const [showHarvestPicker, setShowHarvestPicker] = useState(false);
  const [showBestByPicker, setShowBestByPicker] = useState(false);

  // Toggle delivery options
  const toggleDeliveryOption = (option) => {
    setDeliveryOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  // Handle form submit
  const handleAddProduct = async () => {
    if (!name || !category || !price || !unit || !quantity) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    const newProduct = {
      name,
      category,
      variety,
      description,
      price: Number(price),
      unit,
      quantity: Number(quantity),
      minOrder: minOrder ? Number(minOrder) : 1,
      harvestDate,
      bestByDate,
      deliveryOptions,
    };

    try {
      await axios.post("http://localhost:5000/api/products", newProduct);
      Alert.alert("Success", "Product added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error adding product"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>

      {/* Product Name */}
      <TextInput
        placeholder="Product Name (e.g., Organic Roma Tomatoes)"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* Category */}
      <TextInput
        placeholder="Category (Vegetables, Fruits, Grains, Others)"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      {/* Variety */}
      <TextInput
        placeholder="Variety (Optional)"
        value={variety}
        onChangeText={setVariety}
        style={styles.input}
      />

      {/* Description */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      {/* Price & Unit */}
      <View style={styles.row}>
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={[styles.input, { flex: 1, marginRight: 8 }]}
        />
        <TextInput
          placeholder="Unit (e.g., kg, lb)"
          value={unit}
          onChangeText={setUnit}
          style={[styles.input, { flex: 1 }]}
        />
      </View>

      {/* Quantity & Min Order */}
      <View style={styles.row}>
        <TextInput
          placeholder="Available Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={[styles.input, { flex: 1, marginRight: 8 }]}
        />
        <TextInput
          placeholder="Min Order (Optional)"
          value={minOrder}
          onChangeText={setMinOrder}
          keyboardType="numeric"
          style={[styles.input, { flex: 1 }]}
        />
      </View>

      {/* Harvest Date */}
      <TouchableOpacity
        onPress={() => setShowHarvestPicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>
          Harvest Date: {harvestDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showHarvestPicker && (
        <DateTimePicker
          value={harvestDate}
          mode="date"
          onChange={(e, date) => {
            setShowHarvestPicker(false);
            if (date) setHarvestDate(date);
          }}
        />
      )}

      {/* Best By Date */}
      <TouchableOpacity
        onPress={() => setShowBestByPicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>
          Best By Date: {bestByDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showBestByPicker && (
        <DateTimePicker
          value={bestByDate}
          mode="date"
          onChange={(e, date) => {
            setShowBestByPicker(false);
            if (date) setBestByDate(date);
          }}
        />
      )}

      {/* Delivery Options */}
      <Text style={styles.subtitle}>Delivery Options:</Text>
      {["Farm pickup", "Local delivery", "Farmer’s market"].map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => toggleDeliveryOption(opt)}
          style={styles.checkbox}
        >
          <Text>
            {deliveryOptions.includes(opt) ? "✅" : "⬜"} {opt}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  row: { flexDirection: "row" },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateText: { color: "#333" },
  checkbox: { marginBottom: 10 },
  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
