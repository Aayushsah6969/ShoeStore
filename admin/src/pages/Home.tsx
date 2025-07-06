import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import { products } from '../data/products';

const Home: React.FC = () => {
  const featuredProducts = products.filter(p => p.featured);
  const saleProducts = products.filter(p => p.onSale);

  return (
    <div>
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Products */}
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

        {/* Sale Products */}
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