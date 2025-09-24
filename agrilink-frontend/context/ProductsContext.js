import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { api } from '@/lib/api';

const ProductsContext = createContext();

function productsReducer(state, action) {
	switch (action.type) {
    case '__INIT__':
      return { ...state, products: action.payload };
		case 'ADD_PRODUCT': {
			const newProduct = {
				id: Date.now().toString(),
				name: action.payload.name,
				price: Number(action.payload.price) || 0,
				category: action.payload.category || 'Other',
				description: action.payload.description || '',
				image: action.payload.image || 'https://via.placeholder.com/400x300.png?text=AgriLink',
				inStock: Boolean(action.payload.inStock),
				rating: action.payload.rating || 4.5,
				unit: action.payload.unit || 'per kg',
				weightKg: Number(action.payload.weightKg) || 1,
				dateAdded: new Date().toISOString()
			};
			return { ...state, products: [newProduct, ...state.products] };
		}
		default:
			return state;
	}
}

const initialState = { products: [] };

export function ProductsProvider({ children }) {
	const [state, dispatch] = useReducer(productsReducer, initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/products');
        const mapped = res.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          category: p.category ?? 'Other',
          description: p.description ?? '',
          image: p.image ?? 'https://via.placeholder.com/400x300.png?text=AgriLink',
          inStock: p.inStock ?? true,
          rating: p.rating ?? 4.5,
          unit: p.unit ?? 'per kg',
          weightKg: p.weightKg ?? 1,
          dateAdded: p.dateAdded ?? p.createdAt ?? new Date().toISOString(),
        }));
        // initialize state directly
        dispatch({ type: '__INIT__', payload: mapped });
      } catch (e) {
        // noop for now
      } finally {
        setLoading(false);
      }
    })();
  }, []);

	const categories = useMemo(() => {
		const set = new Set(['All']);
		state.products.forEach(p => set.add(p.category));
		return Array.from(set);
	}, [state.products]);

  const addProduct = (payload) => dispatch({ type: 'ADD_PRODUCT', payload });

	return (
    <ProductsContext.Provider value={{ products: state.products, categories, addProduct, loading }}>
			{children}
		</ProductsContext.Provider>
	);
}

export function useProducts() {
	const ctx = useContext(ProductsContext);
	if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
	return ctx;
}


