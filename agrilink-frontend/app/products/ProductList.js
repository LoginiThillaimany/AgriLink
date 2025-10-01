import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../../lib/theme";
import { productAPI } from "../../lib/api";
import { toastError, toastSuccess } from "../../lib/toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProducts = useCallback(async (pageNum = 1, searchTerm = "") => {
    try {
      setError(null);
      if (pageNum === 1) {
        setLoading(true);
      }

      const response = await productAPI.getAll({
        page: pageNum,
        limit: 10,
        search: searchTerm,
      });

      if (response.success) {
        const newProducts = response.data;
        
        setProducts(prev => 
          pageNum === 1 ? newProducts : [...prev, ...newProducts]
        );
        
        setHasMore(response.pagination.hasNextPage);
        setTotalItems(response.pagination.totalItems);
        setPage(pageNum);
      }
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1, search);
  }, [search]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts(1, search);
  }, [search]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(page + 1, search);
    }
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await productAPI.delete(id);
              toastSuccess("Product deleted successfully");
              fetchProducts(1, search);
            } catch (err) {
              toastError(err.message);
            }
          },
        },
      ]
    );
  };

  const handleToggleSoldOut = async (id, currentStatus) => {
    try {
      await productAPI.toggleSoldOut(id);
      toastSuccess(
        currentStatus ? "Product restocked" : "Product marked as sold out"
      );
      fetchProducts(page, search);
    } catch (err) {
      toastError(err.message);
    }
  };

  // Calculate stats
  const inStock = products.filter((p) => p.quantity > 0 && !p.soldOut).length;
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < 5).length;
  const soldOut = products.filter((p) => p.soldOut).length;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => router.push(`/products/ProductDetails?id=${item._id}`)}
      >
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>🌾</Text>
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>LKR {item.price}</Text>
            <Text style={styles.unit}>/ {item.unit}</Text>
          </View>
          
          <View style={styles.statusRow}>
            <View style={[
              styles.statusBadge,
              item.soldOut 
                ? styles.soldOutBadge 
                : item.quantity === 0
                ? styles.outOfStockBadge
                : item.quantity < 5
                ? styles.lowStockBadge
                : styles.inStockBadge
            ]}>
              <Text style={styles.statusText}>
                {item.soldOut 
                  ? "🚫 Sold Out" 
                  : item.quantity === 0 
                  ? "❌ Out of Stock"
                  : item.quantity < 5
                  ? `⚠️ Low (${item.quantity})`
                  : `✅ In Stock (${item.quantity})`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => router.push(`/products/EditProduct?id=${item._id}`)}
          style={styles.actionButton}
        >
          <Ionicons name="pencil" size={20} color={colors.info} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleToggleSoldOut(item._id, item.soldOut)}
          style={styles.actionButton}
        >
          <Ionicons 
            name={item.soldOut ? "refresh" : "checkmark-circle"} 
            size={20} 
            color={colors.success} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleDelete(item._id, item.name)}
          style={styles.actionButton}
        >
          <Ionicons name="trash" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  if (loading && page === 1) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error && products.length === 0) {
    return <ErrorMessage message={error} onRetry={() => fetchProducts(1, search)} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <Text style={styles.headerSubtitle}>{totalItems} total items</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.headerButton, { flex: 1 }]}
          onPress={() => router.push("/products/AddProduct")}
        >
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.headerButtonText}>Add Product</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.headerButton, styles.secondaryButton, { flex: 1 }]}
          onPress={() => router.push("/products/SalesTracking")}
        >
          <Ionicons name="bar-chart" size={20} color={colors.primary} />
          <Text style={[styles.headerButtonText, { color: colors.primary }]}>
            Sales
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor={colors.textSecondary}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{inStock}</Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>{lowStock}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.error }]}>{soldOut}</Text>
          <Text style={styles.statLabel}>Sold Out</Text>
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="leaf-outline"
            title="No products found"
            message={search ? "Try a different search term" : "Add your first product to get started"}
          />
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  actionRow: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.sm,
  },
  headerButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.soft,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  headerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  stats: {
    flexDirection: "row",
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    padding: spacing.md,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  imagePlaceholder: {
    fontSize: 30,
  },
  productInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  unit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  inStockBadge: {
    backgroundColor: '#E8F5E9',
  },
  lowStockBadge: {
    backgroundColor: '#FFF3E0',
  },
  outOfStockBadge: {
    backgroundColor: '#FFEBEE',
  },
  soldOutBadge: {
    backgroundColor: '#F5F5F5',
  },
  actions: {
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});