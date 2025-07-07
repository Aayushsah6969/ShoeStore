import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  showAll?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title, showAll = false }) => {
  const displayProducts = showAll ? products : products.slice(0, 8);

  return (
    <div className="py-8 sm:py-12">
      {title && (
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{title}</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 px-4 sm:px-0">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;