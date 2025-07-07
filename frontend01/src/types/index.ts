export interface Product {
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
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: CartItem[];
}

export interface FilterState {
  search: string;
  priceRange: [number, number];
  brands: string[];
  sizes: string[];
  colors: string[];
  sortBy: 'price-low' | 'price-high' | 'popularity' | 'newest';
}