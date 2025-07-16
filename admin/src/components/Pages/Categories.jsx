import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { useUIStore } from '../../stores/uiStore';

const Categories = () => {
  const { categories, products } = useDataStore();
  const { showToast } = useUIStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

  const getCategoryProductCount = (category) => {
    return products.filter(product => product.category === category).length;
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      showToast('Category added successfully!', 'success');
      setNewCategory('');
      setIsAdding(false);
    } else {
      showToast('Category already exists or is empty', 'error');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditValue(category);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (editValue.trim() && editValue !== editingCategory) {
      showToast('Category updated successfully!', 'success');
      setEditingCategory(null);
      setEditValue('');
    } else {
      setEditingCategory(null);
      setEditValue('');
    }
  };

  const handleDeleteCategory = (category) => {
    const productCount = getCategoryProductCount(category);
    if (productCount > 0) {
      showToast(`Cannot delete category with ${productCount} products`, 'error');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the "${category}" category?`)) {
      showToast('Category deleted successfully!', 'success');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewCategory('');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Package className="w-6 h-6 text-orange-500 mr-3" />
                {editingCategory === category ? (
                  <form onSubmit={handleUpdateCategory} className="flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </form>
                ) : (
                  <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {editingCategory === category ? (
                  <>
                    <button
                      onClick={handleUpdateCategory}
                      className="text-green-600 hover:text-green-800 p-1 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setEditValue('');
                      }}
                      className="text-gray-600 hover:text-gray-800 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {getCategoryProductCount(category)} products
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500">No categories found.</div>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add First Category
          </button>
        </div>
      )}
    </div>
  );
};

export default Categories;