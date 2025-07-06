import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickAdd = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      product,
      quantity: 1,
      selectedSize,
      selectedColor
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Sale Badge */}
          {product.onSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              SALE
            </div>
          )}
          
          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              FEATURED
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors duration-200"
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-slate-600'}`}
            />
          </button>

          {/* Quick Add Overlay - Hidden on mobile */}
          {showQuickAdd && isHovered && (
            <div className="hidden lg:flex absolute inset-0 bg-black bg-opacity-50 items-center justify-center transition-opacity duration-300">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-sm"
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        Size {size}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-sm"
                  >
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 hover:text-slate-700 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-slate-600 mb-2">{product.brand}</p>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-slate-600 ml-2">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-bold text-slate-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </Link>

        {/* Mobile Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="lg:hidden w-full mt-3 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;