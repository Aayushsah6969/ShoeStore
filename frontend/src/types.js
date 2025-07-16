// Product type definition (as comments for reference)
/*
Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  brand: string;
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  onSale: boolean;
  rating: number;
  reviews: number;
  stock_quantity?: number;
}

CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

User {
  id: string;
  name: string;
  email: string;
}

Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
}

FilterState {
  search: string;
  priceRange: [number, number];
  brands: string[];
  sizes: string[];
  colors: string[];
  sortBy: 'popularity' | 'price-low' | 'price-high' | 'newest';
}
*/

// Export empty object since this is now just for reference
export default {};