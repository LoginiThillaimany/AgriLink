// app/customerHome.js
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CustomerHome() {
  const categories = [
    { id: 1, name: 'Vegetables', icon: 'leaf-outline' },
    { id: 2, name: 'Fruits', icon: 'nutrition-outline' },
    { id: 3, name: 'Grains', icon: 'restaurant-outline' },
  ];

  const products = [
    { id: 1, name: 'Organic Vine Ripe Tomatoes', price: '$3.99', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400' },
    { id: 2, name: 'Crisp Green Leaf Lettuce', price: '$2.49', image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400' },
    { id: 3, name: 'Farm Fresh Sweet Potatoes', price: '$1.89', image: 'https://images.unsplash.com/photo-1605478521005-d51e56f3d1a3?w=400' },
    { id: 4, name: 'Hass Avocados (Pack of 3)', price: '$5.29', image: 'https://images.unsplash.com/photo-1609692814858-fd5d91c71d44?w=400' },
    { id: 5, name: 'Assorted Bell Peppers', price: '$4.50', image: 'https://images.unsplash.com/photo-1582515073490-dc84e7ba1e79?w=400' },
    { id: 6, name: 'Sweet Orchard Strawberries', price: '$6.99', image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fresh Harvest</Text>
        <Ionicons name="cart-outline" size={24} color="#1B5E20" />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Popular Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map((cat) => (
          <View key={cat.id} style={styles.categoryCard}>
            <Ionicons name={cat.icon} size={28} color="#1B5E20" />
            <Text style={styles.categoryText}>{cat.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Products */}
      <Text style={styles.sectionTitle}>Top Picks for You</Text>
      <View style={styles.productsGrid}>
        {products.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            <TouchableOpacity style={styles.cartButton}>
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={22} color="#666" />
          <Text style={styles.navText}>Farmer Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <Ionicons name="cart-outline" size={22} color="#1B5E20" />
          <Text style={[styles.navText, styles.navTextActive]}>Customer Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="basket-outline" size={22} color="#666" />
          <Text style={styles.navText}>My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={22} color="#666" />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  categories: {
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#1B5E20',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cartButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 10,
  },
  navItem: {
    alignItems: 'center',
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
