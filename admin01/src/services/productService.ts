import api from './api';

export interface Product {
  id: string;
  product_name: string;
  category: string;
  price: number;
  discount_percentage?: number;
  stock_quantity: number;
  product_images: string[];
  description: string;
  is_featured: boolean;
  available_sizes: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductData {
  product_name: string;
  category: string;
  price: number;
  discount_percentage?: number;
  stock_quantity: number;
  product_images: string[];
  description: string;
  is_featured: boolean;
  available_sizes: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const response = await api.post('/api/products/upload', productData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  async updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
    try {
      const response = await api.put(`/api/products/update/${id}`, productData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/api/products/delete/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  }
};