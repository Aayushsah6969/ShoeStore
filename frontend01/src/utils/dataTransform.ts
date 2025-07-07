import { Product } from '../types';
import { ApiProduct } from '../services/productService';

// Transform API product to frontend product format
export function transformApiProduct(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.product_name || apiProduct.name || '',
    price: typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : (apiProduct.price ?? 0),
    originalPrice: apiProduct.original_price ? (typeof apiProduct.original_price === 'string' ? parseFloat(apiProduct.original_price) : apiProduct.original_price) : undefined,
    image: (apiProduct.product_images && apiProduct.product_images[0]) || apiProduct.image || '',
    images: apiProduct.product_images || apiProduct.images || [apiProduct.image || ''],
    description: apiProduct.description || '',
    brand: apiProduct.brand || '',
    category: apiProduct.category || '',
    sizes: apiProduct.available_sizes || apiProduct.sizes || [],
    colors: apiProduct.colors || [],
    inStock: typeof apiProduct.stock_quantity === 'number' ? apiProduct.stock_quantity > 0 : (apiProduct.in_stock ?? true),
    featured: apiProduct.is_featured ?? apiProduct.featured ?? false,
    onSale: (apiProduct.discount_percentage && apiProduct.discount_percentage > 0) || apiProduct.on_sale || false,
    rating: typeof apiProduct.rating === 'number' ? apiProduct.rating : 5,
    reviews: typeof apiProduct.reviews === 'number' ? apiProduct.reviews : 0,
  };
}

// Transform frontend cart items to API order items
export function transformCartToOrderItems(cart: any[]) {
  return cart.map(item => ({
    product_id: item.product.id,
    quantity: item.quantity,
    size: item.selectedSize,
    color: item.selectedColor,
  }));
}