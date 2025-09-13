import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Seeds",
    image: "",
  });
  const navigation = useNavigation();

  const categories = ["Seeds", "Fertilizers", "Tools", "Pesticides"];

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        Alert.alert("✅ Success", "Product added successfully!");
        navigation.goBack();
      } else {
        Alert.alert("❌ Error", "Failed to add product");
      }
    } catch (error) {
      Alert.alert("⚠️ Error", "Network error");
    }
  };

  return (
    <ScrollView className="flex-1 bg-green-50 p-6">
      {/* Header */}
      <View className="items-center mb-6">
        <Text className="text-3xl font-extrabold text-green-700 mb-2">
          🌿 Add New Product
        </Text>
        <Text className="text-gray-600 text-base text-center">
          Fill out the details below to add a product for farmers
        </Text>
      </View>

      {/* Image Preview */}
      {form.image ? (
        <Image
          source={{ uri: form.image }}
          className="w-full h-48 rounded-xl mb-6 border-2 border-green-300"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-48 rounded-xl mb-6 bg-green-100 border-2 border-dashed border-green-400 items-center justify-center">
          <Text className="text-gray-500">No image preview</Text>
        </View>
      )}

      {/* Name */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-green-700 mb-2">
          Product Name
        </Text>
        <TextInput
          className="p-4 border border-green-300 rounded-xl bg-white shadow-sm"
          placeholder="Eg: Organic Tomato Seeds"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
      </View>

      {/* Description */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-green-700 mb-2">
          Description
        </Text>
        <TextInput
          className="p-4 border border-green-300 rounded-xl bg-white shadow-sm"
          placeholder="Eg: High quality organic seeds..."
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Price */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-green-700 mb-2">
          Price (LKR)
        </Text>
        <TextInput
          className="p-4 border border-green-300 rounded-xl bg-white shadow-sm"
          placeholder="Eg: 1200"
          value={form.price}
          onChangeText={(text) => setForm({ ...form, price: text })}
          keyboardType="numeric"
        />
      </View>

      {/* Category */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-green-700 mb-2">
          Category
        </Text>
        <View className="border border-green-300 rounded-xl bg-white shadow-sm">
          <Picker
            selectedValue={form.category}
            onValueChange={(value) => setForm({ ...form, category: value })}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Image URL */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-green-700 mb-2">
          Image URL
        </Text>
        <TextInput
          className="p-4 border border-green-300 rounded-xl bg-white shadow-sm"
          placeholder="Paste product image URL"
          value={form.image}
          onChangeText={(text) => setForm({ ...form, image: text })}
        />
      </View>

      {/* Buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="flex-1 bg-green-600 p-4 rounded-xl mr-2 shadow-md"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold text-lg">
            ✅ Add Product
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-red-500 p-4 rounded-xl ml-2 shadow-md"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white text-center font-bold text-lg">
            ❌ Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddProduct;
