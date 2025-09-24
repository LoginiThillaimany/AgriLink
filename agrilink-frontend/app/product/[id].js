import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';

export default function ProductDetails() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const { dispatch } = useCart();
	const { products } = useProducts();
	const product = products.find(p => p.id === id);

	if (!product) {
		return (
			<SafeAreaView style={styles.center}>
				<Text>Product not found.</Text>
			</SafeAreaView>
		);
	}

	const addToCart = () => {
		dispatch({ type: 'ADD_TO_CART', payload: product });
	};

	return (
		<SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
				<Image source={{ uri: product.image }} style={styles.image} />
				<View style={styles.content}>
					<Text style={styles.title}>{product.name}</Text>
					<Text style={styles.category}>{product.category}</Text>
					<Text style={styles.price}>${product.price} <Text style={styles.unit}>{product.unit}</Text></Text>
					<Text style={styles.description}>{product.description}</Text>
				</View>
			</ScrollView>
			<View style={styles.bottomBar}>
				<TouchableOpacity style={styles.addButton} onPress={addToCart} disabled={!product.inStock}>
					<Text style={styles.addButtonText}>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#FFFFFF' },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	image: { width: '100%', height: 260 },
	content: { padding: 20 },
	title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 6 },
	category: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
	price: { fontSize: 22, fontWeight: '700', color: '#16A34A', marginBottom: 12 },
	unit: { fontSize: 12, color: '#6B7280', fontWeight: '400' },
	description: { fontSize: 16, color: '#374151', lineHeight: 22 },
	bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
	addButton: { backgroundColor: '#16A34A', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
	addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});


