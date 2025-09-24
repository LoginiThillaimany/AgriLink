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
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const statusIcons = {
  'Processing': (props) => <Ionicons name="time-outline" {...props} />,
  'Shipped': (props) => <Ionicons name="car-outline" {...props} />,
  'Delivered': (props) => <Ionicons name="checkmark-circle-outline" {...props} />,
};

const statusColors = {
  'Processing': '#F59E0B',
  'Shipped': '#3B82F6',
  'Delivered': '#22C55E',
};

export default function Orders() {
  const { orders } = useCart();
  const { user } = useAuth();
  const [remoteOrders, setRemoteOrders] = useState([]);

  useEffect(() => {
    (async () => {
      if (!user) return setRemoteOrders([]);
      try {
        const res = await api.get(`/api/orders/user/${user.id}`);
        const mapped = res.map(o => ({
          id: o._id,
          items: o.items,
          total: o.total,
          date: o.createdAt,
          status: (o.status || 'pending').charAt(0).toUpperCase() + (o.status || 'pending').slice(1),
        }));
        setRemoteOrders(mapped);
      } catch (e) {
        setRemoteOrders([]);
      }
    })();
  }, [user?.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const list = user ? remoteOrders : orders;
  if (list.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Order History</Text>
        </View>
        <View style={styles.emptyOrders}>
          <Ionicons name="cube-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyOrdersTitle}>No orders yet</Text>
          <Text style={styles.emptyOrdersText}>Your order history will appear here</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.orderCount}>{list.length} orders</Text>
      </View>

      <ScrollView style={styles.ordersContainer} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {list.map((order) => {
          const StatusIcon = statusIcons[order.status];
          const statusColor = statusColors[order.status];

          return (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                  <StatusIcon size={16} color={statusColor} />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                    </View>
                    <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.orderTotal}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
              </View>

              <TouchableOpacity style={styles.reorderButton}>
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
  orderCount: {
    fontSize: 14,
    color: '#DCFCE7',
    marginTop: 4,
  },
  emptyOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyOrdersTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyOrdersText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  ordersContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  reorderButton: {
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});