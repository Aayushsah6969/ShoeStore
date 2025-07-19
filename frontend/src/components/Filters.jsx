import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { sizes } from '../data/products';

const categories = ['Sports', 'Fashion', 'Party', 'Tourist', 'Jungle'];

const Filters = ({ isOpen, onClose }) => {
  const { filters, setFilters, resetFilters } = useStore();
  
  // Initialize filters if they don't exist
  React.useEffect(() => {
    if (!filters || !filters.categories || !filters.sizes || !filters.priceRange || !filters.sortBy) {
      setFilters({
        ...defaultFilters,
        ...(filters || {})
      });
    }
  }, [filters, setFilters]);

  const handlePriceChange = (value, index) => {
    const currentRange = filters?.priceRange || [0, 10000];
    const newRange = [...currentRange];
    newRange[index] = value;
    setFilters({ ...filters, priceRange: newRange });
  };

  const handleCategoryToggle = (category) => {
    const currentCategories = filters?.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const handleSizeToggle = (size) => {
    const currentSizes = filters?.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    setFilters({ ...filters, sizes: newSizes });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">Price Range</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={filters?.priceRange?.[0] || 0}
                    onChange={(e) => handlePriceChange(Number(e.target.value), 0)}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    max="50000"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="number"
                    value={filters?.priceRange?.[1] || 10000}
                    onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    max="50000"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(filters?.categories || []).includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-slate-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

         {/* Sizes */}
<div>
  <h3 className="text-lg font-medium text-slate-900 mb-3">Sizes</h3>
  <div className="grid grid-cols-4 gap-2">
    {sizes.map((size) => (
      <button
        key={size}
        onClick={() => handleSizeToggle(size)}
        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors duration-200 ${
          filters?.sizes?.includes(size)
            ? 'border-orange-500 bg-orange-500 text-white'
            : 'border-slate-300 text-slate-700 hover:border-slate-400'
        }`}
      >
        {size}
      </button>
    ))}
  </div>
</div>


            {/* Sort */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 p-6 border-t">
            <button
              onClick={resetFilters}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
