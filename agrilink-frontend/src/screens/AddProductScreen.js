import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { addProduct, updateProduct } from '../services/api';

const AddProductScreen = ({ navigation, route }) => {
  const { product, userId } = route.params || {}; // For editing
  const { userType } = route.params || { userType: 'farmer' };
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState(product?.category || 'Other');
  const [stock, setStock] = useState(product?.stock?.toString() || '');
  const [image, setImage] = useState(product?.images?.[0] || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Oops!', 'We need photo permission to add pictures!');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const submit = async () => {
    if (!name || !price || !stock) {
      Alert.alert('Oops!', 'Please fill in name, price, and stock!');
      return;
    }
    setLoading(true);
    try {
      const productData = { name, description, price: parseFloat(price), category, stock: parseInt(stock), images: image ? [image] : [], farmerId: userId };
      if (product) {
        await updateProduct(product._id, productData);
        Alert.alert('Yay!', 'Product updated!');
      } else {
        await addProduct(productData);
        Alert.alert('Yay!', 'Product added!');
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Oops!', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userType !== 'farmer') {
    return <Text style={styles.message}>Only farmers can add products!</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{product ? 'Edit Product' : 'Add Product'}</Text>
      <TextInput placeholder="Product Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} multiline />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />
      <TextInput placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" style={styles.input} />
      <Button mode="contained" onPress={pickImage} style={styles.button} color="#FF9800">
        {image ? 'Change Photo' : 'Upload Photo'}
      </Button>
      {image && <Text style={styles.imageText}>Photo ready!</Text>}
      <Button mode="contained" onPress={submit} loading={loading} style={styles.button} color="#4CAF50">
        {product ? 'Update' : 'Add'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#4CAF50', padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { marginVertical: 10 },
  imageText: { color: '#FF9800', marginBottom: 10 },
  message: { textAlign: 'center', fontSize: 18, color: '#FF9800', padding: 20 },
});

export default AddProductScreen;