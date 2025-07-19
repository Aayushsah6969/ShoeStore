import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useStore } from '../store/useStore';

const ProductCard = ({ product }) => {
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const [selectedSize] = useState(sizes[0]); // keep for addToCart compatibility
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      product,
      quantity: 1,
      selectedSize,
      selectedColor: '', // color removed, pass empty string for type compatibility
    });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  // Helper to get discount percentage from product (for both card and detail)
  function getDiscountPercentage(product) {
    // Try to infer from originalPrice and price if not present
    if (typeof product.discount_percentage === 'number') {
      return product.discount_percentage;
    }
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return undefined;
  }

  return (
    <div
      className="group relative bg-white rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 w-full max-w-xs mx-auto"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Discount Badge */}
          {getDiscountPercentage(product) && getDiscountPercentage(product) > 0 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
              -{getDiscountPercentage(product)}%
            </div>
          )}
          {/* Sale Badge */}
          {product.onSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
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
        </div>
      </Link>

      <div className="p-2 sm:p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1 hover:text-slate-700 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-slate-600 mb-1">{product.brand}</p>
          {/* Rating */}
          <div className="flex items-center mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(typeof product.rating === 'number' ? product.rating : 5)
                      ? 'text-yellow-400 fill-current'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-600 ml-1">({typeof product.reviews === 'number' ? product.reviews : 0})</span>
          </div>
          {/* Price */}
          <div className="flex flex-col items-start">
            {product.originalPrice && product.originalPrice > product.price && getDiscountPercentage(product) && getDiscountPercentage(product) > 0 ? (
              <>
                <div className="flex items-center space-x-1 mb-0.5">
                  <span className="text-xs text-slate-500 line-through">₹{product.originalPrice}</span>
                  <span className="text-xs text-green-600 font-bold ml-1">-{getDiscountPercentage(product)}%</span>
                </div>
                <span className="text-base sm:text-lg font-bold text-slate-900">₹{product.price}</span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-bold text-slate-900">₹{product.price}</span>
            )}
          </div>
        </Link>

        {/* Add to Cart Button - Bottom Right Corner */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-900 transition-colors duration-200 shadow-md transform hover:scale-105"
          aria-label="Add to Cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;