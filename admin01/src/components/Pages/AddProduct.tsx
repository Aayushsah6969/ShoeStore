import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { useUIStore } from '../../stores/uiStore';

const AddProduct: React.FC = () => {
  const { addProduct, categories } = useDataStore();
  const { showToast, setCurrentPage } = useUIStore();
  
  const [formData, setFormData] = useState({
    product_name: '',
    category: categories[0] || '',
    price: '',
    discount_percentage: '',
    stock_quantity: '',
    description: '',
    available_sizes: [] as string[],
    is_featured: false,
    product_images: ['']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      available_sizes: prev.available_sizes.includes(size) 
        ? prev.available_sizes.filter(s => s !== size)
        : [...prev.available_sizes, size]
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      product_images: prev.product_images.map((img, i) => i === index ? value : img)
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      product_images: [...prev.product_images, '']
    }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      product_images: prev.product_images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_name || !formData.category || !formData.price || !formData.stock_quantity) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (formData.available_sizes.length === 0) {
      showToast('Please select at least one size', 'error');
      return;
    }

    const validImages = formData.product_images.filter(img => img.trim() !== '');
    if (validImages.length === 0) {
      showToast('Please provide at least one product image', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        product_name: formData.product_name,
        category: formData.category,
        price: parseFloat(formData.price),
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : undefined,
        stock_quantity: parseInt(formData.stock_quantity),
        description: formData.description,
        available_sizes: formData.available_sizes,
        is_featured: formData.is_featured,
        product_images: validImages
      };

      await addProduct(productData);
      showToast('Product added successfully!', 'success');
      setCurrentPage('products');
    } catch (error: any) {
      showToast(error.message || 'Failed to add product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <input
                type="number"
                id="discount_percentage"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Sizes *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  disabled={isSubmitting}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors disabled:opacity-50 ${
                    formData.available_sizes.includes(size)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images *
            </label>
            <div className="space-y-3">
              {formData.product_images.map((image, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                  />
                  {formData.product_images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-orange-600 hover:text-orange-800 flex items-center text-sm"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Another Image
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
              Featured Product
            </label>
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('products')}
              disabled={isSubmitting}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;