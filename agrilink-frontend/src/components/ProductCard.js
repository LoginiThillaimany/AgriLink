import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

const ProductCard = ({ product, onEdit, onDelete }) => (
  <View style={styles.card}>
    {product.images?.[0] && <Image source={{ uri: product.images[0] }} style={styles.image} />}
    <View style={styles.info}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={[styles.stock, product.stock < 10 ? styles.lowStock : null]}>
        {product.stock} in stock
      </Text>
    </View>
    <View style={styles.actions}>
      <Button mode="contained" onPress={onEdit} style={styles.button} color="#FF9800">
        Edit
      </Button>
      <Button mode="contained" onPress={onDelete} style={styles.button} color="#F44336">
        Delete
      </Button>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, marginVertical: 5, backgroundColor: '#FFF', borderRadius: 5 },
  image: { width: 60, height: 60, borderRadius: 5, marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
  price: { fontSize: 14, color: '#FF9800' },
  stock: { fontSize: 12, color: '#000' },
  lowStock: { color: '#F44336' },
  actions: { justifyContent: 'center' },
  button: { marginVertical: 5, marginHorizontal: 5 },
});

export default ProductCard;