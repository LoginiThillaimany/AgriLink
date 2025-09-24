import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useProducts } from '@/context/ProductsContext';
import { api } from '@/lib/api';

export default function AddProduct() {
	const { addProduct } = useProducts();
	const [form, setForm] = useState({
		name: '',
		price: '',
		category: '',
		description: '',
		image: '',
		inStock: true,
		unit: 'per kg',
		weightKg: '1'
	});

	const onSubmit = async () => {
		if (!form.name || !form.price) return;
		try {
			const payload = {
				name: form.name,
				price: Number(form.price),
				category: form.category || 'Other',
				description: form.description,
				image: form.image,
				inStock: form.inStock,
				unit: form.unit,
				weightKg: Number(form.weightKg)
			};
			const saved = await api.post('/api/products', payload);
			addProduct({ ...payload, id: saved._id });
			setForm({ name: '', price: '', category: '', description: '', image: '', inStock: true, unit: 'per kg', weightKg: '1' });
		} catch (e) {
			// optionally show error UI
		}
	};

	const onChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Add Product</Text>
			</View>
			<ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 20 }}>
				<TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={(v) => onChange('name', v)} />
				<TextInput style={styles.input} placeholder="Price" keyboardType="decimal-pad" value={form.price} onChangeText={(v) => onChange('price', v)} />
				<TextInput style={styles.input} placeholder="Category" value={form.category} onChangeText={(v) => onChange('category', v)} />
				<TextInput style={styles.input} placeholder="Unit (e.g., per kg)" value={form.unit} onChangeText={(v) => onChange('unit', v)} />
				<TextInput style={styles.input} placeholder="Weight (kg)" keyboardType="decimal-pad" value={form.weightKg} onChangeText={(v) => onChange('weightKg', v)} />
				<TextInput style={[styles.input, styles.textArea]} placeholder="Description" multiline value={form.description} onChangeText={(v) => onChange('description', v)} />
				<TextInput style={styles.input} placeholder="Image URL" value={form.image} onChangeText={(v) => onChange('image', v)} />
				<View style={styles.row}> 
					<Text style={styles.label}>In Stock</Text>
					<Switch value={form.inStock} onValueChange={(v) => onChange('inStock', v)} />
				</View>
				<TouchableOpacity style={styles.submit} onPress={onSubmit}>
					<Text style={styles.submitText}>Add Product</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#F9FAFB' },
	header: { backgroundColor: '#16A34A', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
	headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
	form: { paddingHorizontal: 20, paddingTop: 20 },
	input: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
	textArea: { height: 100, textAlignVertical: 'top' },
	row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
	label: { fontSize: 16, color: '#374151' },
	submit: { backgroundColor: '#16A34A', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
	submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }
});


