import React, { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';

const Featured = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/products/getall');
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          // Transform API products to match frontend Product type
          const featured = data.products
            .filter((p) => p.is_featured === true)
            .map((p) => ({
              id: p.id,
              name: p.product_name,
              price: parseFloat(p.price),
              image: p.product_images?.[0] || '',
              images: p.product_images || [],
              description: p.description || '',
              brand: p.brand || '',
              category: p.category || '',
              sizes: p.available_sizes || [],
              colors: [],
              inStock: (typeof p.stock_quantity === 'number' ? p.stock_quantity > 0 : true),
              featured: p.is_featured === true,
              onSale: false,
              rating: 5,
              reviews: 0,
              discount_percentage: p.discount_percentage || 0,
              stock_quantity: p.stock_quantity || 0
            }));
          setFeaturedProducts(featured);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Featured Collection</h1>
        <p className="text-lg text-slate-600">
          Our carefully curated selection of the season's most coveted styles
        </p>
      </div>
      {loading ? (
        <div className="text-center text-slate-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <ProductGrid products={featuredProducts} showAll />
      )}
    </div>
  );
};

export default Featured;