import { Slot } from 'expo-router';
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <Slot />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}