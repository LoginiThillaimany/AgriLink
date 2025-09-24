import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function ProfileScreen() {
  const { user, login, register, logout, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (loading) {
    return (
      <View style={styles.container}><Text>Loading...</Text></View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}> 
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.name}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
        <TouchableOpacity style={styles.buttonDanger} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput style={styles.input} placeholder="Name (for register)" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={async () => { try { setError(''); await login(email, password); } catch (e) { setError(String(e.message||e)); } }}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={async () => { try { setError(''); await register(name, email, password); } catch (e) { setError(String(e.message||e)); } }}>
          <Text style={styles.buttonSecondaryText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  row: { flexDirection: 'row', gap: 12 },
  button: { backgroundColor: '#16A34A', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  buttonSecondary: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  buttonSecondaryText: { color: '#111827', fontSize: 14, fontWeight: '600' },
  buttonDanger: { backgroundColor: '#DC2626', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', marginTop: 20 },
  label: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  value: { fontSize: 16, color: '#111827', fontWeight: '600' },
  error: { color: '#DC2626', marginBottom: 8 },
});