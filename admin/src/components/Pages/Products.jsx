import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Plus, RefreshCw } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { useUIStore } from '../../stores/uiStore';

const Products = () => {
  const { products, productsLoading, categories, fetchProducts, deleteProduct } = useDataStore();
  const { showToast, setCurrentPage } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadingId, setLoadingId] = useState(null);
  const [productsState, setProductsState] = useState(products);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line
  }, []);

  // Fetch products from API with credentials
  const loadProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products/getall', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProductsState(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      showToast(error.message || 'Failed to load products', 'error');
      setProductsState([]);
    }
  };

  // Update product via API (PUT)
  const handleUpdate = async (id, updateData) => {
    setLoadingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/products/update/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updateData),
        }
      );
      if (!res.ok) throw new Error('Failed to update product');
      showToast('Product updated successfully', 'success');
      await loadProducts();
      setEditModalOpen(false);
    } catch (error) {
      showToast(error.message || 'Failed to update product', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  // Delete product via API
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoadingId(id);
      try {
        const res = await fetch(`http://localhost:5000/api/products/delete/${id}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );
        if (!res.ok) throw new Error('Failed to delete product');
        showToast('Product deleted successfully', 'success');
        setProductsState((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        showToast(error.message || 'Failed to delete product', 'error');
      } finally {
        setLoadingId(null);
      }
    }
  };

  const allCategories = ['all', ...categories];
  const statuses = ['all', 'in_stock', 'out_of_stock'];

  const filteredProducts = (productsState || []).filter(product => {
    const matchesSearch = (product.product_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'in_stock' && product.stock_quantity > 0) ||
      (filterStatus === 'out_of_stock' && product.stock_quantity === 0);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getDiscountedPrice = (price, discountPercentage) => {
    if (!discountPercentage) return null;
    return price - (price * discountPercentage / 100);
  };

  // Modal component for editing product
  const EditProductModal = ({ open, onClose, onSave, product, loading }) => {
    const [form, setForm] = useState({
      product_name: product?.product_name || '',
      price: product?.price || 0,
      discount_percentage: product?.discount_percentage || 0,
      stock_quantity: product?.stock_quantity || 0,
      category: product?.category || '',
      is_featured: product?.is_featured || false,
      product_images: product?.product_images || [],
      description: product?.description || '',
      available_sizes: product?.available_sizes || [],
    });

    useEffect(() => {
      setForm({
        product_name: product?.product_name || '',
        price: product?.price || 0,
        discount_percentage: product?.discount_percentage || 0,
        stock_quantity: product?.stock_quantity || 0,
        category: product?.category || '',
        is_featured: product?.is_featured || false,
        product_images: product?.product_images || [],
        description: product?.description || '',
        available_sizes: product?.available_sizes || [],
      });
    }, [product]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

    // For product_images and available_sizes (comma separated)
    const handleArrayChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value.split(',').map((v) => v.trim()),
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(form);
    };

    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
          <h2 className="text-xl font-bold mb-4">Edit Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input name="product_name" value={form.product_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Discount (%)</label>
              <input name="discount_percentage" type="number" value={form.discount_percentage} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Product Images (comma separated URLs)</label>
              <input name="product_images" value={form.product_images.join(', ')} onChange={handleArrayChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Available Sizes (comma separated)</label>
              <input name="available_sizes" value={form.available_sizes.join(', ')} onChange={handleArrayChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex items-center">
              <input name="is_featured" type="checkbox" checked={form.is_featured} onChange={handleChange} className="mr-2" />
              <label className="text-sm">Featured</label>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadProducts}
            disabled={productsLoading}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${productsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setCurrentPage('add-product')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {allCategories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : 
                 status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {productsLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const discountedPrice = getDiscountedPrice(product.price, product.discount_percentage);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.product_images[0] || 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300'}
                            alt={product.product_name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                            {product.is_featured && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {discountedPrice ? (
                            <>
                              <span className=" text-gray-500">₹{product.price}</span>
                              {/* <span className="ml-2 text-orange-600 font-semibold">₹{discountedPrice.toFixed(2)}</span> */}
                              <span className="ml-1 text-xs text-green-600">({product.discount_percentage}% off)</span>
                            </>
                          ) : (
                            <span>₹{product.price}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            onClick={() => { setEditProduct(product); setEditModalOpen(true); }}
                            disabled={loadingId === product.id}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                            disabled={loadingId === product.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {!productsLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No products found matching your criteria.</div>
          </div>
        )}
      </div>

      <EditProductModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={(data) => editProduct && handleUpdate(editProduct.id, data)}
        product={editProduct}
        loading={!!loadingId}
      />
    </div>
  );
};

export default Products;