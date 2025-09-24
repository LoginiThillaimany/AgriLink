import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import colors from '../styles/colors';

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStock: 0
  });
  
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    fetchFarmerProducts();
    fetchFarmerOrders();
  }, []);

  const fetchFarmerProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products?farmerId=${user.userId}`);
      const data = await response.json();
      setProducts(data);
      updateStats(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to fetch products");
    }
  };

  const updateStats = (productsData) => {
    const totalProducts = productsData.length;
    const lowStock = productsData.filter(p => p.stock < 10).length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const totalRevenue = orders.reduce((sum, order) => {
      const orderProducts = order.items.filter(item =>
        productsData.some(p => p._id === item.productId)
      );
      return sum + orderProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, 0);

    setStats({ totalProducts, totalRevenue, pendingOrders, lowStock });
  };

  const fetchFarmerOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();
      // Filter orders related to farmer's products
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteProduct = async (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `http://localhost:5000/api/products/${productId}`,
                { method: "DELETE" }
              );
              if (response.ok) {
                Alert.alert("Success", "Product deleted");
                fetchFarmerProducts();
              } else {
                Alert.alert("Error", "Failed to delete product");
              }
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Network error");
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }) => {
    const isLowStock = item.stock < 10;
    
    return (
      <Card variant="elevated" style={{ margin: 8, padding: 16, flex: 1 }}>
        <Image
          source={{
            uri: item.image || "https://via.placeholder.com/150x150?text=Product",
          }}
          style={{ width: '100%', height: 120, borderRadius: 12 }}
          resizeMode="cover"
        />
        
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: colors.neutral[800],
          marginTop: 12
        }}>
          {item.name}
        </Text>
        
        <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }}>
          <Text style={{
            fontSize: 14,
            color: colors.neutral[600],
            backgroundColor: colors.primary[50],
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 12,
          }}>
            {item.category}
          </Text>
        </View>

        <Text style={{
          fontSize: 18,
          fontWeight: '800',
          color: colors.primary[600],
          marginTop: 8
        }}>
          LKR {item.price}
        </Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
          backgroundColor: isLowStock ? colors.error + '10' : colors.success + '10',
          padding: 8,
          borderRadius: 8
        }}>
          <Ionicons
            name={isLowStock ? "alert-circle" : "checkmark-circle"}
            size={16}
            color={isLowStock ? colors.error : colors.success}
          />
          <Text style={{
            marginLeft: 4,
            color: isLowStock ? colors.error : colors.success,
            fontSize: 12,
            fontWeight: '600'
          }}>
            {item.stock} {item.unit}s in stock
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
          <Button
            title="Edit"
            variant="outline"
            size="sm"
            icon="create-outline"
            onPress={() => navigation.navigate("AddProduct", { product: item })}
            style={{ flex: 1 }}
          />
          <Button
            title="Delete"
            variant="danger"
            size="sm"
            icon="trash-outline"
            onPress={() => deleteProduct(item._id)}
            style={{ flex: 1 }}
          />
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: '900',
              color: colors.neutral[800],
            }}>
              🌾 Welcome back,
            </Text>
            <Text style={{
              fontSize: 16,
              color: colors.neutral[600],
              marginTop: 4,
            }}>
              {user?.name || 'Farmer'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductHistory')}
              style={{
                padding: 8,
                backgroundColor: colors.secondary[50],
                borderRadius: 20,
              }}
            >
              <Ionicons name="list" size={24} color={colors.secondary[600]} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{
                padding: 8,
                backgroundColor: colors.primary[50],
                borderRadius: 20,
              }}
            >
              <Ionicons name="person" size={24} color={colors.primary[600]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <Card variant="elevated" style={{ flex: 1, padding: 16, minWidth: '45%' }}>
            <Ionicons name="leaf" size={24} color={colors.primary[600]} />
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.neutral[800] }}>
              {stats.totalProducts}
            </Text>
            <Text style={{ color: colors.neutral[600] }}>Products</Text>
          </Card>

          <Card variant="elevated" style={{ flex: 1, padding: 16, minWidth: '45%' }}>
            <Ionicons name="cash" size={24} color={colors.success} />
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.neutral[800] }}>
              LKR {stats.totalRevenue}
            </Text>
            <Text style={{ color: colors.neutral[600] }}>Revenue</Text>
          </Card>

          <Card variant="elevated" style={{ flex: 1, padding: 16, minWidth: '45%' }}>
            <Ionicons name="time" size={24} color={colors.warning} />
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.neutral[800] }}>
              {stats.pendingOrders}
            </Text>
            <Text style={{ color: colors.neutral[600] }}>Pending Orders</Text>
          </Card>

          <Card variant="elevated" style={{ flex: 1, padding: 16, minWidth: '45%' }}>
            <Ionicons name="alert-circle" size={24} color={colors.error} />
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.neutral[800] }}>
              {stats.lowStock}
            </Text>
            <Text style={{ color: colors.neutral[600] }}>Low Stock</Text>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.primary[500],
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              shadowColor: colors.primary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={() => navigation.navigate("AddProduct")}
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={{ color: 'white', fontWeight: '700', marginTop: 4 }}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.secondary[500],
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              shadowColor: colors.secondary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={() => navigation.navigate("ProductHistory")}
          >
            <Ionicons name="list" size={24} color="white" />
            <Text style={{ color: 'white', fontWeight: '700', marginTop: 4 }}>My Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.neutral[600],
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              shadowColor: colors.neutral[600],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={() => navigation.navigate("ProductList")}
          >
            <Ionicons name="storefront" size={24} color="white" />
            <Text style={{ color: 'white', fontWeight: '700', marginTop: 4 }}>Browse All</Text>
          </TouchableOpacity>
        </View>

        {/* My Products */}
        <Text className="text-xl font-bold text-green-800 mb-4">My Products</Text>
        {products.length === 0 ? (
          <View className="bg-white p-8 rounded-2xl shadow-md items-center mb-6">
            <Ionicons name="leaf-outline" size={60} color="#9CA3AF" />
            <Text className="text-gray-600 text-lg mt-4">No products yet</Text>
            <Text className="text-gray-500 text-center mt-2">
              Start by adding your first product
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
            className="mb-6"
          />
        )}

        {/* Recent Orders */}
        <Text className="text-xl font-bold text-green-800 mb-4">Recent Orders</Text>
        {orders.length === 0 ? (
          <View className="bg-white p-8 rounded-2xl shadow-md items-center">
            <Ionicons name="receipt-outline" size={60} color="#9CA3AF" />
            <Text className="text-gray-600 text-lg mt-4">No orders yet</Text>
          </View>
        ) : (
          orders.slice(0, 5).map((order) => (
            <View key={order._id} className="bg-white p-4 rounded-2xl shadow-md mb-3">
              <Text className="text-green-800 font-bold">Order #{order._id.slice(-6)}</Text>
              <Text className="text-gray-600">Total: LKR {order.total}</Text>
              <Text className="text-gray-500">Status: {order.status || "Pending"}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default FarmerDashboard;