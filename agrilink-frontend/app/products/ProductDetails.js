import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { productAPI } from "../../lib/api";
import { toastError, toastSuccess } from "../../lib/toast";
import { colors, spacing, radius, shadows } from "../../lib/theme";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getById(id);
      
      if (response.success) {
        setProduct(response.data);
      }
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await productAPI.delete(id);
              toastSuccess("Product deleted successfully");
              router.back();
            } catch (err) {
              toastError(err.message);
            }
          },
        },
      ]
    );
  };

  const handleToggleSoldOut = async () => {
    try {
      await productAPI.toggleSoldOut(id);
      toastSuccess(product.soldOut ? "Product restocked" : "Product marked as sold out");
      fetchProduct();
    } catch (err) {
      toastError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProduct} />;
  }

  if (!product) {
    return <ErrorMessage message="Product not found" />;
  }

  const getStatusColor = () => {
    if (product.soldOut) return colors.textDisabled;
    if (product.quantity === 0) return colors.error;
    if (product.quantity < 5) return colors.warning;
    return colors.success;
  };

  const getStatusText = () => {
    if (product.soldOut) return "Sold Out";
    if (product.quantity === 0) return "Out of Stock";
    if (product.quantity < 5) return `Low Stock (${product.quantity})`;
    return `In Stock (${product.quantity})`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>🌾</Text>
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>LKR {product.price}</Text>
            <Text style={styles.unit}>/ {product.unit}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Information</Text>

        {product.variety && (
          <View style={styles.detailRow}>
            <Ionicons name="leaf" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Variety</Text>
              <Text style={styles.detailValue}>{product.variety}</Text>
            </View>
          </View>
        )}

        {product.description && (
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{product.description}</Text>
            </View>
          </View>
        )}

        <View style={styles.detailRow}>
          <Ionicons name="cube" size={20} color={colors.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Available Quantity</Text>
            <Text style={styles.detailValue}>{product.quantity} {product.unit}</Text>
          </View>
        </View>

        {product.minOrder && product.minOrder > 1 && (
          <View style={styles.detailRow}>
            <Ionicons name="cart" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Minimum Order</Text>
              <Text style={styles.detailValue}>{product.minOrder} {product.unit}</Text>
            </View>
          </View>
        )}

        {product.sales > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="trending-up" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Total Sales</Text>
              <Text style={styles.detailValue}>{product.sales} units</Text>
            </View>
          </View>
        )}
      </View>

      {/* Dates Section */}
      {(product.harvestDate || product.bestByDate) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Dates</Text>

          {product.harvestDate && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Harvest Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(product.harvestDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}

          {product.bestByDate && (
            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Best By Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(product.bestByDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Delivery Options */}
      {product.deliveryOptions && product.deliveryOptions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          <View style={styles.deliveryContainer}>
            {product.deliveryOptions.map((option, index) => (
              <View key={index} style={styles.deliveryChip}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.deliveryText}>{option}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push(`/products/EditProduct?id=${product._id}`)}
        >
          <Ionicons name="pencil" size={20} color="white" />
          <Text style={styles.actionButtonText}>Edit Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.soldOutButton]}
          onPress={handleToggleSoldOut}
        >
          <Ionicons 
            name={product.soldOut ? "refresh" : "checkmark-done"} 
            size={20} 
            color="white" 
          />
          <Text style={styles.actionButtonText}>
            {product.soldOut ? "Restock" : "Mark Sold Out"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.actionButtonText}>Delete Product</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.card,
    flexDirection: 'row',
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  imagePlaceholder: {
    fontSize: 40,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  unit: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
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
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  detailContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
  },
  deliveryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  deliveryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  deliveryText: {
    fontSize: 14,
    color: colors.text,
  },
  actionSection: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.card,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: colors.info,
  },
  soldOutButton: {
    backgroundColor: colors.warning,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
});