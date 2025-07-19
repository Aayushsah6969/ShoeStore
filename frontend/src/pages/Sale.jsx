import React, { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';

const Sale = () => {
  const [saleProducts, setSaleProducts] = useState([]);
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
          const sale = data.products
            .filter((p) => typeof p.discount_percentage === 'number' && p.discount_percentage >= 30)
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
              onSale: true,
              rating: 5,
              reviews: 0,
              discount_percentage: p.discount_percentage || 0,
              stock_quantity: p.stock_quantity || 0
            }));
          setSaleProducts(sale);
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
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          <span className="text-red-500">Sale</span> Collection
        </h1>
        <p className="text-lg text-slate-600">
          Limited time offers on premium footwear - Don't miss out!
        </p>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-800 text-center font-medium">
          🔥 Flash Sale: Up to 30% off selected items - Limited time only!
        </p>
      </div>
      {loading ? (
        <div className="text-center text-slate-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <ProductGrid products={saleProducts} showAll />
      )}
    </div>
  );
};

export default Sale;