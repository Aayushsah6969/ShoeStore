import React from 'react';
import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';

const Sale: React.FC = () => {
  const saleProducts = products.filter(p => p.onSale);

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
          🔥 Flash Sale: Up to 50% off selected items - Limited time only!
        </p>
      </div>
      
      <ProductGrid products={saleProducts} showAll />
    </div>
  );
};

export default Sale;