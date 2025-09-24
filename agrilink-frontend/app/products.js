import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Search, Filter, Plus, Star, SlidersHorizontal, Tags, Weight, CalendarDays, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';

export default function ProductList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Relevance');
  const router = useRouter();
  const { dispatch } = useCart();
  const { products, categories } = useProducts();

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = products.filter(product => {
      const matchesSearch = !q || product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    const sorted = [...filtered];
    if (sortBy === 'Price: Low to High') {
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === 'Price: High to Low') {
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortBy === 'Rating') {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === 'Newest') {
      sorted.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
    }
    return sorted;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const ProductCard = ({ product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${product.id}`)}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.metaRow}>
          <Tags size={14} color="#6B7280" />
          <Text style={styles.productCategory}>{product.category}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FFC107" fill="#FFC107" />
          <Text style={styles.rating}>{product.rating}</Text>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.unit}>{product.unit}</Text>
          </View>
          <View style={styles.weightContainer}>
            <Weight size={14} color="#6B7280" />
            <Text style={styles.weightText}>{product.weightKg ?? 1} kg</Text>
          </View>
        </View>
        <View style={styles.dateRow}>
          <CalendarDays size={14} color="#6B7280" />
          <Text style={styles.dateText}>{new Date(product.dateAdded || Date.now()).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, !product.inStock && styles.disabledButton]}
          onPress={() => addToCart(product)}
          disabled={!product.inStock}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AgriLink</Text>
        <Text style={styles.headerSubtitle}>Fresh Farm Products</Text>
      </View>

      {/* Continue to App Button */}
      <View style={styles.continueContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.continueButtonText}>Continue to App</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={20} color="#16A34A" />
        </TouchableOpacity>
      </View>

      {/* Filters Modal */}
      <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>Category</Text>
                <View style={styles.chipsWrap}>
                  {['All', ...categories].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.chip,
                        selectedCategory === category && styles.chipActive,
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text style={[styles.chipText, selectedCategory === category && styles.chipTextActive]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>Sort by</Text>
                <View style={styles.chipsWrap}>
                  {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.chip, sortBy === option && styles.chipActive]}
                      onPress={() => setSortBy(option)}
                    >
                      <Text style={[styles.chipText, sortBy === option && styles.chipTextActive]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.clearButton]}
                onPress={() => {
                  setSelectedCategory('All');
                  setSortBy('Relevance');
                }}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.applyButton]}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Products Grid */}
      <ScrollView style={styles.productsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {filteredProducts.length} Products Found
        </Text>
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
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
  headerSubtitle: {
    fontSize: 14,
    color: '#DCFCE7',
    marginTop: 4,
  },
  continueContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#16A34A',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: '#16A34A',
    fontSize: 16,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeText: {
    color: '#16A34A',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  clearButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#16A34A',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  productCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  rating: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceContainer: { },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  unit: {
    fontSize: 12,
    color: '#6B7280',
  },
  weightContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  weightText: { fontSize: 12, color: '#6B7280' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  dateText: { fontSize: 12, color: '#6B7280' },
  addButton: {
    backgroundColor: '#16A34A',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});