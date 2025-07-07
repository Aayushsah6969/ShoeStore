import React from 'react';
import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';

const Featured: React.FC = () => {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Featured Collection</h1>
        <p className="text-lg text-slate-600">
          Our carefully curated selection of the season's most coveted styles
        </p>
      </div>
      
      <ProductGrid products={featuredProducts} showAll />
    </div>
  );
};

export default Featured;