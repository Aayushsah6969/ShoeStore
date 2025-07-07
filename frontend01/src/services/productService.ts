import api from './api';

export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  images: string[];
  description: string;
  brand: string;
  category: string;
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  featured: boolean;
  on_sale: boolean;
  rating: number;
  reviews: number;
}

export interface ProductsResponse {
  success: boolean;
  products: ApiProduct[];
  total: number;
}

export interface ProductResponse {
  success: boolean;
  product: ApiProduct;
}

export const productService = {
  // Get all products
  async getAllProducts(): Promise<ApiProduct[]> {
    try {
      const response = await api.get('/api/products/getall');
      return response.data.products || response.data;
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  // Get product by ID
  async getProductById(id: string): Promise<ApiProduct> {
    try {
      const response = await api.get(`/api/products/getall/${id}`);
      return response.data.product || response.data;
    } catch (error: any) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }
};