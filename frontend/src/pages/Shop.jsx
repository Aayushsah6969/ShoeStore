import React, { useState, useMemo, useEffect } from 'react';
import { Filter, AlertCircle, Loader } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { useStore } from '../store/useStore';

const Shop = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { 
    products = [], 
    productsLoading, 
    productsError, 
    fetchProducts, 
    filters = {
      search: '',
      priceRange: [0, 10000],
      categories: [],
      sizes: [],
      sortBy: 'popularity'
    }
  } = useStore();

  // Fetch products on component mount
  useEffect(() => {
    if (products.length === 0 && !productsLoading) {
      fetchProducts();
    }
  }, [products.length, productsLoading, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter(product => {
      if (!product) return false;

      // Search filter
      if (filters?.search && (product.product_name || product.name)) {
        const searchTerm = filters.search.toLowerCase();
        const productName = (product.product_name || product.name || '').toLowerCase();
        const productBrand = (product.brand || '').toLowerCase();
        if (!productName.includes(searchTerm) && !productBrand.includes(searchTerm)) {
          return false;
        }
      }

      // Price filter
      if (filters?.priceRange && product.price) {
        const productPrice = parseFloat(product.price);
        if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
          return false;
        }
      }

      // Category filter
      if (filters?.categories?.length > 0 && product.category) {
        if (!filters.categories.includes(product.category)) {
          return false;
        }
      }

      // Size filter
      if (filters?.sizes?.length > 0) {
        const productSizes = product.available_sizes || product.sizes || [];
        if (!Array.isArray(productSizes) || !filters.sizes.some(size => productSizes.includes(size))) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
          break;
        case 'price-high':
          filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
          break;
        case 'newest':
          // In a real app, you'd sort by date
          filtered.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
          break;
        case 'popularity':
        default:
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
    }

    return filtered;
  }, [products, filters]);

  if (productsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center">
          <Loader className="h-12 w-12 text-orange-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Products</h2>
          <p className="text-slate-600">Please wait while we fetch the latest products...</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Products</h2>
          <p className="text-slate-600 mb-4 text-center">{productsError}</p>
          <button
            onClick={fetchProducts}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Shop All Shoes</h1>
          <p className="text-slate-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        
        <button
          onClick={() => setIsFiltersOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {filteredProducts.length === 0 && products.length > 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your filters to see more results.</p>
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            Adjust Filters
          </button>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} showAll />
      )}

      <Filters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </div>
  );
};

export default Shop;