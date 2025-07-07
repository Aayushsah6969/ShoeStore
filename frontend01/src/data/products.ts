import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Air Max Revolution',
    price: 129.99,
    originalPrice: 159.99,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Experience ultimate comfort with our Air Max Revolution. Featuring advanced cushioning technology and premium materials for all-day wear.',
    brand: 'Nike',
    category: 'Running',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Red'],
    inStock: true,
    featured: true,
    onSale: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Classic Leather Sneaker',
    price: 89.99,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Timeless design meets modern comfort in our Classic Leather Sneaker. Perfect for everyday wear with premium leather construction.',
    brand: 'Adidas',
    category: 'Casual',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Black', 'Brown'],
    inStock: true,
    featured: true,
    onSale: false,
    rating: 4.2,
    reviews: 89
  },
  {
    id: '3',
    name: 'Pro Basketball High',
    price: 149.99,
    originalPrice: 179.99,
    image: 'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Dominate the court with our Pro Basketball High. Superior ankle support and responsive cushioning for peak performance.',
    brand: 'Jordan',
    category: 'Basketball',
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    colors: ['Black', 'Red', 'Blue'],
    inStock: true,
    featured: false,
    onSale: true,
    rating: 4.8,
    reviews: 203
  },
  {
    id: '4',
    name: 'Urban Street Walker',
    price: 79.99,
    image: 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Style meets function in our Urban Street Walker. Designed for the modern lifestyle with premium comfort and street-ready aesthetics.',
    brand: 'Vans',
    category: 'Casual',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Gray', 'Black', 'Navy'],
    inStock: true,
    featured: true,
    onSale: false,
    rating: 4.3,
    reviews: 156
  },
  {
    id: '5',
    name: 'Trail Runner Pro',
    price: 119.99,
    image: 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Conquer any terrain with our Trail Runner Pro. Built for outdoor adventures with superior grip and durability.',
    brand: 'Merrell',
    category: 'Running',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Green', 'Brown', 'Orange'],
    inStock: true,
    featured: false,
    onSale: false,
    rating: 4.6,
    reviews: 94
  },
  {
    id: '6',
    name: 'Minimalist Lifestyle',
    price: 99.99,
    originalPrice: 129.99,
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Less is more with our Minimalist Lifestyle shoe. Clean lines and premium materials for the discerning individual.',
    brand: 'Allbirds',
    category: 'Casual',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White', 'Beige', 'Light Gray'],
    inStock: true,
    featured: true,
    onSale: true,
    rating: 4.4,
    reviews: 67
  }
];

export const brands = ['Nike', 'Adidas', 'Jordan', 'Vans', 'Merrell', 'Allbirds'];
export const categories = ['Running', 'Basketball', 'Casual', 'Formal', 'Sport'];
export const sizes = ['6', '7', '8', '9', '10', '11', '12', '13'];
export const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Brown', 'Gray', 'Navy', 'Orange', 'Beige', 'Light Gray'];