import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import MobileMenu from './MobileMenu';

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const { 
    isAuthenticated, 
    user, 
    logout, 
    getCartCount,
    filters,
    setFilters
  } = useStore();

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/shop');
    setIsSearchOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Featured', href: '/featured' },
    { name: 'Sale', href: '/sale' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Sneakers</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search shoes..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors duration-200"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist - Hidden on mobile */}
              {/* <button className="hidden sm:block p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors duration-200 relative">
                <Heart className="h-5 w-5" />
              </button> */}

              {/* Cart */}
              <Link 
                to="/cart" 
                className="p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors duration-200 relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Desktop User Account */}
              {isAuthenticated ? (
                <div className="hidden lg:block relative group">
                  <button className="p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors duration-200">
                    <User className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-slate-200">
                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-600">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors duration-200 font-medium text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors duration-200"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search shoes..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar;