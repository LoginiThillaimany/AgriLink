import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { productAPI } from "../../lib/api";
import { toastError, toastSuccess } from "../../lib/toast";
import { colors, spacing, radius, shadows } from "../../lib/theme";
import LoadingSpinner from "../../components/LoadingSpinner";

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Others'];
const DELIVERY_OPTIONS = ['Farm pickup', 'Local delivery', "Farmer's market"];
const UNITS = ['KG', 'LB', 'Piece'];

export default function AddProduct() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Vegetables",
    variety: "",
    description: "",
    price: "",
    unit: "KG",
    quantity: "",
    minOrder: "1",
    harvestDate: new Date(),
    bestByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deliveryOptions: [],
    image: null,
  });

  const [showHarvestPicker, setShowHarvestPicker] = useState(false);
  const [showBestByPicker, setShowBestByPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  // Web-compatible date picker handlers
  const handleHarvestDateChange = (event) => {
    const date = new Date(event.target.value);
    updateForm('harvestDate', date);
  };

  const handleBestByDateChange = (event) => {
    const date = new Date(event.target.value);
    updateForm('bestByDate', date);
  };
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const toggleDeliveryOption = (option) => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: prev.deliveryOptions.includes(option)
        ? prev.deliveryOptions.filter(o => o !== option)
        : [...prev.deliveryOptions, option]
    }));
  };

  const pickImage = async () => {
    try {
      // Request both media library and camera permissions for better mobile compatibility
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      if (!mediaPermission.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photos to add product images",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Grant Permission", onPress: () => pickImage() }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];

        console.log("Image selected:", selectedImage);

        // Use the URI directly - works better on mobile
        updateForm('image', selectedImage.uri);

        toastSuccess("Image selected successfully!");
      } else if (result.canceled) {
        console.log("Image selection cancelled");
      }
    } catch (error) {
      console.error("Image picker error:", error);
      toastError("Failed to pick image. Please try again.");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required (in LKR)";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = `Valid quantity is required (in ${formData.unit})`;
    if (formData.bestByDate < formData.harvestDate) {
      newErrors.bestByDate = "Best by date must be after harvest date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toastError("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const isValidImage = (uri) =>
        typeof uri === 'string' && (
          uri.startsWith('http') || 
          uri.startsWith('data:image/') ||
          uri.startsWith('blob:') // Support blob URLs for web platform
        );

      const productData = {
        name: formData.name,
        category: formData.category,
        variety: formData.variety,
        description: formData.description,
        price: parseFloat(formData.price),
        unit: formData.unit,
        quantity: parseInt(formData.quantity),
        minOrder: parseInt(formData.minOrder) || 1,
        image: isValidImage(formData.image) ? formData.image : undefined,
        harvestDate: formData.harvestDate.toISOString(),
        bestByDate: formData.bestByDate.toISOString(),
        deliveryOptions: formData.deliveryOptions,
      };

      if (formData.image && !isValidImage(formData.image)) {
        toastError('Local images are not supported yet. Skipping image.');
      }

      await productAPI.create(productData);
      toastSuccess("Product added successfully!");
      // Navigate to product list page
      router.push('/products/ProductList');
    } catch (error) {
      toastError(error?.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Adding product..." />;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={styles.backText}>Back to Products</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              placeholder="e.g., Organic Roma Tomatoes"
              value={formData.name}
              onChangeText={(text) => updateForm('name', text)}
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    formData.category === cat && styles.categoryChipActive
                  ]}
                  onPress={() => updateForm('category', cat)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    formData.category === cat && styles.categoryChipTextActive
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Variety (Optional)</Text>
            <TextInput
              placeholder="e.g., Cherry, Heirloom"
              value={formData.variety}
              onChangeText={(text) => updateForm('variety', text)}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Brief description of your product..."
              value={formData.description}
              onChangeText={(text) => updateForm('description', text)}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Image</Text>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.imageButtonText}>
                {formData.image ? "Change Image" : "Upload Image"}
              </Text>
            </TouchableOpacity>
            {formData.image && (
              <Image source={{ uri: formData.image }} style={styles.imagePreview} />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & Stock</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
              <Text style={styles.label}>Price (LKR) *</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>LKR</Text>
                <TextInput
                  placeholder="0.00"
                  value={formData.price}
                  onChangeText={(text) => updateForm('price', text)}
                  keyboardType="numeric"
                  style={[styles.priceInput, errors.price && styles.inputError]}
                />
              </View>
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Unit *</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, errors.unit && styles.inputError]}
                onPress={() => setShowUnitPicker(true)}
              >
                <Text style={styles.dropdownButtonText}>{formData.unit}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.text} />
              </TouchableOpacity>
              {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
              <Text style={styles.label}>Available Quantity ({formData.unit}) *</Text>
              <TextInput
                placeholder="0"
                value={formData.quantity}
                onChangeText={(text) => updateForm('quantity', text)}
                keyboardType="numeric"
                style={[styles.input, errors.quantity && styles.inputError]}
              />
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Min Order ({formData.unit})</Text>
              <TextInput
                placeholder="1"
                value={formData.minOrder}
                onChangeText={(text) => updateForm('minOrder', text)}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Harvest Date</Text>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={formData.harvestDate.toISOString().split('T')[0]}
                onChange={handleHarvestDateChange}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  padding: spacing.md,
                  fontSize: 16,
                  backgroundColor: colors.surface,
                  width: '100%',
                }}
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setShowHarvestPicker(true)}
                  style={styles.dateButton}
                >
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                  <Text style={styles.dateText}>
                    {formData.harvestDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showHarvestPicker && (
                  <DateTimePicker
                    value={formData.harvestDate}
                    mode="date"
                    onChange={(e, date) => {
                      setShowHarvestPicker(false);
                      if (date) updateForm('harvestDate', date);
                    }}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Best By Date</Text>
            {Platform.OS === 'web' ? (
              <>
                <input
                  type="date"
                  value={formData.bestByDate.toISOString().split('T')[0]}
                  onChange={handleBestByDateChange}
                  style={{
                    borderWidth: 1,
                    borderColor: errors.bestByDate ? colors.error : colors.border,
                    borderRadius: radius.md,
                    padding: spacing.md,
                    fontSize: 16,
                    backgroundColor: colors.surface,
                    width: '100%',
                  }}
                />
                {errors.bestByDate && <Text style={styles.errorText}>{errors.bestByDate}</Text>}
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setShowBestByPicker(true)}
                  style={styles.dateButton}
                >
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                  <Text style={styles.dateText}>
                    {formData.bestByDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showBestByPicker && (
                  <DateTimePicker
                    value={formData.bestByDate}
                    mode="date"
                    onChange={(e, date) => {
                      setShowBestByPicker(false);
                      if (date) updateForm('bestByDate', date);
                    }}
                  />
                )}
                {errors.bestByDate && <Text style={styles.errorText}>{errors.bestByDate}</Text>}
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          {DELIVERY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => toggleDeliveryOption(option)}
              style={styles.checkboxRow}
            >
              <View style={[
                styles.checkbox,
                formData.deliveryOptions.includes(option) && styles.checkboxActive
              ]}>
                {formData.deliveryOptions.includes(option) && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.submitButtonText}>Add Product</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* Unit Picker Modal */}
      <Modal
        visible={showUnitPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Unit</Text>
            {UNITS.map((unit) => (
              <TouchableOpacity
                key={unit}
                style={[
                  styles.modalOption,
                  formData.unit === unit && styles.modalOptionSelected
                ]}
                onPress={() => {
                  updateForm('unit', unit);
                  setShowUnitPicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  formData.unit === unit && styles.modalOptionTextSelected
                ]}>
                  {unit}
                </Text>
                {formData.unit === unit && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowUnitPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.card,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  currencySymbol: {
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '80%',
    maxWidth: 300,
    ...shadows.card,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  modalOptionSelected: {
    backgroundColor: colors.primary + '20',
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  modalOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  modalCancelButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalCancelText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  backRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  backText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
});