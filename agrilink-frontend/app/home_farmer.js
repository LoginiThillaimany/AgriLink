// app/farmerHome.js
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function FarmerHome() {
  const categories = [
    { id: 1, name: 'Vegetables', listings: 24 },
    { id: 2, name: 'Fruits', listings: 18 },
    { id: 3, name: 'Grains', listings: 12 },
    { id: 4, name: 'Redos', listings: 8 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Farmer Homepage</Text>
        <Text style={styles.notificationIcon}>🔔</Text>
      </View>

      {/* Product Categories */}
      <Text style={styles.sectionTitle}>Product Categories</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>🌱</Text>
            <Text style={styles.categoryName}>{cat.name}</Text>
            <Text style={styles.categoryListings}>{cat.listings} Listings</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonIcon}>➕</Text>
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionIcon}>📊</Text>
        <Text style={styles.actionText}>View Sales</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionIcon}>📋</Text>
        <Text style={styles.actionText}>My Listings</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Farmer Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home_customer')}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navText}>Customer Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>My Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  notificationIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 10,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    width: '48%',
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  categoryListings: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 15,
  },
  addButtonIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  navIconActive: {
    color: '#1B5E20',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navActive: {
    borderTopWidth: 2,
    borderColor: '#1B5E20',
    paddingTop: 2,
  },
  navTextActive: {
    color: '#1B5E20',
    fontWeight: '600',
  },
});
