import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ArrowLeft, Truck, RotateCcw, Shield, Zap, AlertCircle, Loader } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductGrid from '../components/ProductGrid';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { 
    addToCart, 
    isInWishlist, 
    addToWishlist, 
    removeFromWishlist, 
    clearCart,
    getProductById,
    products,
    user // <-- get user from store
  } = useStore();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // First try to find in existing products
        const existingProduct = products.find(p => p.id === id);
        if (existingProduct) {
          setProduct(existingProduct);
          setLoading(false);
          return;
        }
        
        // If not found, fetch from API
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById, products]);

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      setSelectedSize((Array.isArray(product.sizes) && product.sizes[0]) || '');
      // Reset quantity to 1 or max available stock if current quantity exceeds stock
      if (product.stock_quantity <= 0) {
        setQuantity(1);
      } else if (quantity > product.stock_quantity) {
        setQuantity(Math.min(quantity, product.stock_quantity));
      }
    }
  }, [product, quantity]);

  const images = (product && Array.isArray(product.images)) ? product.images : [];
  const sizes = (product && Array.isArray(product.sizes)) ? product.sizes : [];

  const relatedProducts = products.filter(p => 
    product && p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select size');
      return;
    }
    if (product.stock_quantity <= 0) {
      alert('Sorry, this product is out of stock');
      return;
    }
    if (quantity > product.stock_quantity) {
      alert(`Only ${product.stock_quantity} items available in stock`);
      return;
    }
    addToCart({
      product,
      quantity,
      selectedSize,
      selectedColor: '', // color removed
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select size');
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }
    if (product.stock_quantity <= 0) {
      alert('Sorry, this product is out of stock');
      return;
    }
    if (quantity > product.stock_quantity) {
      alert(`Only ${product.stock_quantity} items available in stock`);
      return;
    }
    clearCart();
    addToCart({
      product,
      quantity,
      selectedSize,
      selectedColor: '', // color removed
    });
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center">
          <Loader className="h-12 w-12 text-orange-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Product</h2>
          <p className="text-slate-600">Please wait while we fetch the product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-slate-600 mb-4 text-center">
            {error || 'The product you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div>
          <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-slate-100">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                  selectedImage === index ? 'border-orange-500' : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
            <p className="text-lg text-slate-600 mb-4">{product.brand}</p>
            {/* Stock Quantity */}
            {typeof product.stock_quantity !== 'undefined' && (
              <div className="mb-2">
                {product.stock_quantity > 0 ? (
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">In Stock:</span> {product.stock_quantity}
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-semibold">
                    Out of Stock
                  </p>
                )}
              </div>
            )}
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600 ml-2">({product.reviews} reviews)</span>
            </div>
            {/* Price */}
            <div className="flex items-center space-x-2 mb-6">
              {product.originalPrice && product.originalPrice > product.price ? (
                <>
                  <span className="text-lg text-slate-500 line-through">₹{product.originalPrice}</span>
                  {typeof product.discount_percentage === 'number' && product.discount_percentage > 0 && (
                    <span className="text-base text-green-600 font-bold ml-1">-{product.discount_percentage}%</span>
                  )}
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 ml-2">₹{product.price}</span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-slate-900">₹{product.price}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-slate-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Size</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 border-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedSize === size
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock_quantity <= 0}
                className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock_quantity || 0, quantity + 1))}
                disabled={product.stock_quantity <= 0 || quantity >= (product.stock_quantity || 0)}
                className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            {product.stock_quantity > 0 && product.stock_quantity < 10 && (
              <p className="text-sm text-orange-600 mt-2">
                Only {product.stock_quantity} left in stock!
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            {product.stock_quantity <= 0 ? (
              <div className="w-full bg-red-100 text-red-700 px-6 py-4 rounded-lg flex items-center justify-center space-x-2 text-lg font-semibold">
                <AlertCircle className="h-5 w-5" />
                <span>Out of Stock</span>
              </div>
            ) : (
              <>
                {/* Buy Now Button - Primary */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-orange-500 text-white px-6 py-4 rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold transform hover:scale-[1.02]"
                >
                  <Zap className="h-5 w-5" />
                  <span>Buy Now</span>
                </button>

                {/* Add to Cart and Wishlist */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 border-2 border-slate-800 text-slate-800 px-6 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button
                    onClick={handleWishlistToggle}
                    className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-slate-600'}`} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-slate-700">Free shipping on orders over ₹50</span>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-slate-700">30-day hassle-free returns</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-slate-700">2-year warranty included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;