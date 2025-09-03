import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { getProducts, deleteProduct } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductsScreen = ({ navigation, route }) => {
  const { userType, userId } = route.params || { userType: 'farmer', userId: '123' }; // Role-based access
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userType === 'farmer') fetchProducts();
  }, [userType]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(userId);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    Alert.alert('Confirm', 'Delete this product?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => {
        try {
          await deleteProduct(productId);
          setProducts(products.filter(p => p._id !== productId));
        } catch (err) {
          Alert.alert('Error', err.message);
        }
      }},
    ]);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (userType !== 'farmer') {
    return <Text style={styles.message}>Only farmers can view products!</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onEdit={() => navigation.navigate('AddProduct', { product: item, userId })}
            onDelete={() => handleDelete(item._id)}
          />
        )}
        ListEmptyComponent={<Text>No products found</Text>}
        refreshing={loading}
        onRefresh={fetchProducts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  searchBar: { borderWidth: 1, borderColor: '#4CAF50', padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: '#F44336', marginBottom: 10 },
  message: { textAlign: 'center', fontSize: 18, color: '#FF9800', padding: 20 },
});

export default ProductsScreen;