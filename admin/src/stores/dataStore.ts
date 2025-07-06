import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  image: string;
  status: 'active' | 'out_of_stock';
  featured: boolean;
  description: string;
  sizes: string[];
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  date: string;
  products: { id: string; name: string; quantity: number; price: number }[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  joinedDate: string;
  status: 'active' | 'banned';
}

interface DataState {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  categories: string[];
  messages: any[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Air Force 1 Low',
    brand: 'Nike',
    category: 'Sneakers',
    price: 110,
    salePrice: 89,
    stock: 25,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    featured: true,
    description: 'Classic basketball shoe with premium leather upper',
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: '2',
    name: 'Chuck Taylor All Star',
    brand: 'Converse',
    category: 'Sneakers',
    price: 65,
    stock: 15,
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'active',
    featured: false,
    description: 'Iconic canvas sneaker with rubber sole',
    sizes: ['6', '7', '8', '9', '10', '11']
  },
  {
    id: '3',
    name: 'Stan Smith',
    brand: 'Adidas',
    category: 'Sneakers',
    price: 85,
    stock: 0,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'out_of_stock',
    featured: false,
    description: 'Minimalist tennis shoe with perforated stripes',
    sizes: ['7', '8', '9', '10', '11']
  }
];

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    total: 89,
    status: 'pending',
    date: '2024-01-15',
    products: [{ id: '1', name: 'Air Force 1 Low', quantity: 1, price: 89 }]
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    total: 150,
    status: 'shipped',
    date: '2024-01-14',
    products: [
      { id: '1', name: 'Air Force 1 Low', quantity: 1, price: 89 },
      { id: '2', name: 'Chuck Taylor All Star', quantity: 1, price: 65 }
    ]
  },
  {
    id: 'ORD-003',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    total: 85,
    status: 'delivered',
    date: '2024-01-13',
    products: [{ id: '3', name: 'Stan Smith', quantity: 1, price: 85 }]
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    totalOrders: 3,
    joinedDate: '2023-12-01',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    totalOrders: 7,
    joinedDate: '2023-11-15',
    status: 'active'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    totalOrders: 1,
    joinedDate: '2024-01-10',
    status: 'active'
  }
];

export const useDataStore = create<DataState>((set) => ({
  products: mockProducts,
  orders: mockOrders,
  customers: mockCustomers,
  categories: ['Sneakers', 'Boots', 'Sandals', 'Loafers'],
  messages: [
    {
      id: '1',
      name: 'Customer Support',
      email: 'support@example.com',
      message: 'Need help with order tracking',
      date: '2024-01-15'
    }
  ],
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Date.now().toString() }]
  })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  }))
}));