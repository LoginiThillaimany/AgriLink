import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function Cart() {
  const { cartItems, dispatch } = useCart();
  const { user } = useAuth();
  const [placing, setPlacing] = useState(false);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const placeOrder = async () => {
    if (!user) return;
    try {
      setPlacing(true);
      const items = cartItems.map(it => ({
        productId: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
        unit: it.unit,
        weightKg: it.weightKg,
      }));
      const subtotal = total;
      const tax = 0;
      const totalAmount = subtotal + tax;
      await api.post('/api/orders', { userId: user.id, items, subtotal, tax, total: totalAmount, status: 'pending' });
      dispatch({ type: 'PLACE_ORDER' });
    } catch (e) {
      // optionally handle error
    } finally {
      setPlacing(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <View style={styles.emptyCart}>
          <Ionicons name="bag-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>Add some products to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.itemCount}>{cartItems.length} items</Text>
      </View>

      <ScrollView style={styles.cartItems} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Ionicons name="remove" size={16} color="#16A34A" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Ionicons name="add" size={16} color="#16A34A" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={placeOrder} disabled={!user || placing}>
          <Text style={styles.checkoutButtonText}>{placing ? 'Placing...' : (user ? 'Place Order' : 'Login to Order')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemCount: {
    fontSize: 14,
    color: '#DCFCE7',
    marginTop: 4,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    minWidth: 30,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  checkoutButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});