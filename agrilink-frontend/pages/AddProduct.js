import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import colors from '../styles/colors';

const { width } = Dimensions.get("window");

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Seeds",
    image: "",
    stock: "",
    unit: "kg",
    farmer: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const categories = ["Seeds", "Fertilizers", "Tools", "Pesticides", "Fruits", "Vegetables"];
  const units = ["kg", "g", "pieces", "packets"];

  useEffect(() => {
    startAnimations();

    if (user) {
      setForm(prev => ({ ...prev, farmer: user.userId }));
    }

    const product = route.params?.product;
    if (product) {
      setIsEditing(true);
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "Seeds",
        image: product.image || "",
        stock: product.stock?.toString() || "",
        unit: product.unit || "kg",
        farmer: product.farmer || user?.userId || "",
      });
    }
  }, [user, route.params]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
      newErrors.price = "Please enter a valid price greater than 0";
    }

    if (!form.stock || isNaN(form.stock) || parseInt(form.stock) < 0) {
      newErrors.stock = "Please enter a valid stock quantity";
    }

    if (!form.image.trim()) {
      newErrors.image = "Image URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const url = isEditing
        ? `http://localhost:5000/api/products/${route.params.product._id}`
        : "http://localhost:5000/api/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success(isEditing ? "Product updated successfully! 🎉" : "Product added successfully! 🌱");
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert("❌ Error", errorData.error || `Failed to ${isEditing ? 'update' : 'add'} product`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("⚠️ Error", "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[700]} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.primary[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: 'center',
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: 16,
            borderRadius: 20,
            marginBottom: 16,
          }}>
            <Ionicons name={isEditing ? "create" : "add-circle"} size={32} color="white" />
          </View>

          <Text style={{
            fontSize: 28,
            fontWeight: '900',
            color: 'white',
            marginBottom: 8,
            textAlign: 'center',
          }}>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </Text>

          <Text style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            fontWeight: '500',
          }}>
            {isEditing ? 'Update your product details' : 'Share your agricultural products with customers'}
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Image Section */}
          <Card variant="elevated" style={{ padding: 0, marginBottom: 24, overflow: 'hidden' }}>
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.neutral[800],
                marginBottom: 16,
              }}>
                Product Image
              </Text>

              {form.image ? (
                <Image
                  source={{ uri: form.image }}
                  style={{
                    width: width - 80,
                    height: 200,
                    borderRadius: 16,
                    marginBottom: 16,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{
                  width: width - 80,
                  height: 200,
                  borderRadius: 16,
                  backgroundColor: colors.neutral[100],
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: colors.neutral[300],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Ionicons name="image-outline" size={48} color={colors.neutral[400]} />
                  <Text style={{
                    color: colors.neutral[500],
                    marginTop: 8,
                    fontSize: 14,
                  }}>
                    No image selected
                  </Text>
                </View>
              )}

              <Input
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChangeText={(text) => {
                  setForm({ ...form, image: text });
                  if (errors.image) setErrors({ ...errors, image: null });
                }}
                leftIcon="image"
                error={errors.image}
                style={{ width: '100%' }}
              />
            </View>
          </Card>

          {/* Form Fields */}
          <Card variant="elevated" style={{ padding: 20, marginBottom: 24 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: colors.neutral[800],
              marginBottom: 20,
              textAlign: 'center',
            }}>
              Product Details
            </Text>

            <Input
              label="Product Name"
              placeholder="e.g., Organic Tomato Seeds"
              value={form.name}
              onChangeText={(text) => {
                setForm({ ...form, name: text });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              leftIcon="leaf"
              error={errors.name}
              style={{ marginBottom: 16 }}
            />

            <Input
              label="Description"
              placeholder="Describe your product quality, origin, benefits..."
              value={form.description}
              onChangeText={(text) => {
                setForm({ ...form, description: text });
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              leftIcon="document-text"
              multiline
              numberOfLines={4}
              error={errors.description}
              style={{ marginBottom: 16 }}
            />

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Price (LKR)"
                  placeholder="0.00"
                  value={form.price}
                  onChangeText={(text) => {
                    setForm({ ...form, price: text });
                    if (errors.price) setErrors({ ...errors, price: null });
                  }}
                  leftIcon="cash"
                  keyboardType="numeric"
                  error={errors.price}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Input
                  label="Stock Quantity"
                  placeholder="100"
                  value={form.stock}
                  onChangeText={(text) => {
                    setForm({ ...form, stock: text });
                    if (errors.stock) setErrors({ ...errors, stock: null });
                  }}
                  leftIcon="cube"
                  keyboardType="numeric"
                  error={errors.stock}
                />
              </View>
            </View>

            {/* Unit Selection */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.neutral[700],
                marginBottom: 8,
              }}>
                Unit
              </Text>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => setForm({ ...form, unit })}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: form.unit === unit ? colors.primary[500] : colors.neutral[100],
                      borderWidth: 1,
                      borderColor: form.unit === unit ? colors.primary[500] : colors.neutral[300],
                    }}
                  >
                    <Text style={{
                      color: form.unit === unit ? 'white' : colors.neutral[700],
                      fontWeight: '600',
                    }}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Selection */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.neutral[700],
                marginBottom: 8,
              }}>
                Category
              </Text>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setForm({ ...form, category })}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: form.category === category ? colors.secondary[500] : colors.neutral[100],
                      borderWidth: 1,
                      borderColor: form.category === category ? colors.secondary[500] : colors.neutral[300],
                    }}
                  >
                    <Text style={{
                      color: form.category === category ? 'white' : colors.neutral[700],
                      fontWeight: '600',
                    }}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>

          {/* Action Buttons */}
          <View style={{ gap: 12, marginBottom: 40 }}>
            <Button
              title={isEditing ? "Update Product" : "Add Product"}
              variant="gradient"
              size="lg"
              onPress={handleSubmit}
              loading={loading}
              fullWidth
              icon={isEditing ? "create" : "add-circle"}
            />

            <Button
              title="Cancel"
              variant="outline"
              size="lg"
              onPress={() => navigation.goBack()}
              fullWidth
              icon="close-circle"
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProduct;
