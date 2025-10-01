import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { productAPI } from "../../lib/api";
import { colors, spacing, radius, shadows } from "../../lib/theme";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await productAPI.getAll({ page: 1, limit: 100 });
      
      if (response.success) {
        const products = response.data;
        const inStock = products.filter(p => p.quantity > 0 && !p.soldOut).length;
        const lowStock = products.filter(p => p.quantity > 0 && p.quantity < 5).length;
        const soldOut = products.filter(p => p.soldOut).length;
        const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);

        setStats({
          total: products.length,
          inStock,
          lowStock,
          soldOut,
          totalRevenue,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>AgriLink Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="leaf" size={28} color={colors.primary} />
          </View>
          <Text style={styles.statNumber}>{stats?.total || 0}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          </View>
          <Text style={styles.statNumber}>{stats?.inStock || 0}</Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="alert-circle" size={28} color={colors.warning} />
          </View>
          <Text style={styles.statNumber}>{stats?.lowStock || 0}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.error + '20' }]}>
            <Ionicons name="close-circle" size={28} color={colors.error} />
          </View>
          <Text style={styles.statNumber}>{stats?.soldOut || 0}</Text>
          <Text style={styles.statLabel}>Sold Out</Text>
        </View>
      </View>

      {/* Revenue Card */}
      <View style={styles.revenueCard}>
        <View style={styles.revenueHeader}>
          <View>
            <Text style={styles.revenueLabel}>Total Revenue</Text>
            <Text style={styles.revenueAmount}>
              LKR {(stats?.totalRevenue || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.revenueIcon}>
            <Ionicons name="cash" size={32} color={colors.success} />
          </View>
        </View>
        <Text style={styles.revenueNote}>Based on completed sales</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/products/AddProduct')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="add" size={24} color="white" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Add New Product</Text>
            <Text style={styles.actionDescription}>List a new product for sale</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/products/ProductList')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
            <Ionicons name="list" size={24} color="white" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Products</Text>
            <Text style={styles.actionDescription}>View and edit your products</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/products/SalesTracking')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
            <Ionicons name="analytics" size={24} color="white" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Analytics</Text>
            <Text style={styles.actionDescription}>Track your sales performance</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>💡 Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={20} color={colors.warning} />
          <Text style={styles.tipText}>
            Keep your product quantities updated to avoid overselling
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="camera" size={20} color={colors.info} />
          <Text style={styles.tipText}>
            Add high-quality photos to increase customer interest
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="pricetag" size={20} color={colors.success} />
          <Text style={styles.tipText}>
            Competitive pricing helps move inventory faster
          </Text>
        </View>
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
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadows.card,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  revenueCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.success,
  },
  revenueIcon: {
    width: 64,
    height: 64,
    backgroundColor: colors.success + '20',
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revenueNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  actionsSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tipsSection: {
    paddingHorizontal: spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: spacing.md,
    lineHeight: 20,
  },
});