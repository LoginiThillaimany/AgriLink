import { createContext, useContext, useEffect, useReducer } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };

    case 'PLACE_ORDER':
      return {
        ...state,
        cartItems: [],
        orders: [
          ...state.orders,
          {
            id: Date.now().toString(),
            items: state.cartItems,
            total: state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString(),
            status: 'Processing',
          },
        ],
      };

    default:
      return state;
  }
};

const initialState = {
  cartItems: [],
  orders: [
    {
      id: '1',
      items: [
        { id: '1', name: 'Organic Tomatoes', price: 4.99, quantity: 2, image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400' }
      ],
      total: 9.98,
      date: '2024-01-15T10:30:00.000Z',
      status: 'Delivered',
    },
    {
      id: '2',
      items: [
        { id: '3', name: 'Fresh Carrots', price: 3.49, quantity: 1, image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400' }
      ],
      total: 3.49,
      date: '2024-01-10T15:20:00.000Z',
      status: 'Shipped',
    },
  ],
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Load cart for user
  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const res = await api.get(`/api/cart/${user.id}`);
        const items = (res && res.items) || [];
        // Replace local cart with server cart
        dispatch({ type: 'CLEAR_CART' });
        items.forEach(it => {
          dispatch({ type: 'ADD_TO_CART', payload: { id: it.productId || it.id, name: it.name, price: it.price, image: it.image, quantity: it.quantity } });
        });
      } catch (e) {
        // ignore
      }
    })();
  }, [user?.id]);

  // Persist cart when it changes
  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const items = state.cartItems.map(it => ({
          productId: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.image,
        }));
        await api.put(`/api/cart/${user.id}`, { items });
      } catch (e) {}
    })();
  }, [user?.id, state.cartItems]);

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}