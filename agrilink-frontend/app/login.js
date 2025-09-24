import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Redirect, Link } from 'expo-router';

export default function Login() {
	const { user, login, register, loading } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [mode, setMode] = useState('login');

	if (loading) return null;
	if (user) return <Redirect href="/products" />;

	async function onSubmit() {
		try {
			setError('');
			if (mode === 'login') {
				await login(email, password);
			} else {
				await register(name, email, password);
			}
		} catch (e) {
			setError(String(e.message || e));
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>{mode === 'login' ? 'Login' : 'Create account'}</Text>
			{!!error && <Text style={styles.error}>{error}</Text>}
			{mode === 'register' && (
				<TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
			)}
			<TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
			<TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
			<TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
				<Text style={styles.buttonText}>{mode === 'login' ? 'Login' : 'Register'}</Text>
			</TouchableOpacity>
			<View style={styles.switchRow}>
				<Text style={styles.switchText}>{mode === 'login' ? "Don't have an account?" : 'Already have an account?'}</Text>
				<TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
					<Text style={styles.switchLink}>{mode === 'login' ? 'Register' : 'Login'}</Text>
				</TouchableOpacity>
			</View>
			<View style={{ marginTop: 20 }}>
				<Link href="/products" style={styles.skipLink}>Skip for now</Link>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, justifyContent: 'center' },
	title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 16, textAlign: 'center' },
	input: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
	button: { backgroundColor: '#16A34A', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
	buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
	switchRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
	switchText: { color: '#6B7280' },
	switchLink: { color: '#16A34A', fontWeight: '700' },
	error: { color: '#DC2626', marginBottom: 6, textAlign: 'center' },
	skipLink: { color: '#6B7280', textAlign: 'center' },
});


