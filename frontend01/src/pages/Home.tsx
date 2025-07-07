import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, Loader } from 'lucide-react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import { useStore } from '../store/useStore';

const Home: React.FC = () => {
  const { 
    products, 
    productsLoading, 
    productsError, 
    fetchProducts 
  } = useStore();

  // Fetch products on component mount
  useEffect(() => {
    if (products.length === 0 && !productsLoading) {
      fetchProducts();
    }
  }, [products.length, productsLoading, fetchProducts]);

  const featuredProducts = products.filter(p => p.featured);
  const saleProducts = products.filter(p => p.onSale);

  return (
    <div>
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {productsLoading && (
          <section className="py-16">
            <div className="flex flex-col items-center justify-center">
              <Loader className="h-12 w-12 text-orange-500 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Products</h2>
              <p className="text-slate-600">Fetching the latest collection...</p>
            </div>
          </section>
        )}

        {/* Error State */}
        {productsError && (
          <section className="py-16">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Products</h2>
              <p className="text-slate-600 mb-4 text-center">{productsError}</p>
              <button
                onClick={fetchProducts}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </section>
        )}

        {/* Featured Products */}
        {!productsLoading && !productsError && featuredProducts.length > 0 && (
          <section className="py-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Collection</h2>
                <p className="text-slate-600">Handpicked styles that define the season</p>
              </div>
              <Link 
                to="/featured"
                className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </section>
        )}

        {/* Sale Products */}
        {!productsLoading && !productsError && saleProducts.length > 0 && (
          <section className="py-16 bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Limited Time Sale</h2>
                <p className="text-slate-600">Don't miss out on these incredible deals</p>
              </div>
              <Link 
                to="/sale"
                className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
              >
                <span>Shop Sale</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={saleProducts} />
          </section>
        )}

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose SoleStyle?</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Free Shipping</h3>
              <p className="text-slate-600">Free shipping on orders over $50. Fast and reliable delivery to your doorstep.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Easy Returns</h3>
              <p className="text-slate-600">30-day hassle-free returns. Not satisfied? We'll make it right.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Quality Guarantee</h3>
              <p className="text-slate-600">Premium materials and craftsmanship. Built to last, designed to impress.</p>
            </div>
          </div>
        </section>
      </div>

      <Newsletter />
    </div>
  );
};

export default Home;