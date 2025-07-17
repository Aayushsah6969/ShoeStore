import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User, ShoppingCart, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout, getCartCount } = useStore();
  
  const cartCount = getCartCount();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Featured', href: '/featured' },
    { name: 'Sale', href: '/sale' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/contact' }
  ];

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Sneakers</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6 text-slate-600" />
            </button>
          </div>

          {/* User Section */}
          {isAuthenticated && user && (
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 py-6">
            <div className="space-y-1 px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={handleLinkClick}
                  className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                    location.pathname === link.href
                      ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 px-6">
              <div className="space-y-3">
                <Link
                  to="/cart"
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="h-5 w-5 text-slate-600" />
                    <span className="font-medium text-slate-900">Shopping Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-orange-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button className="flex items-center space-x-3 px-4 py-3 w-full text-left bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <Heart className="h-5 w-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Wishlist</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="block w-full bg-slate-800 text-white text-center py-3 rounded-lg hover:bg-slate-900 transition-colors duration-200 font-medium"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full border border-slate-300 text-slate-700 text-center py-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="block w-full border border-slate-300 text-slate-700 text-center py-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={handleLinkClick}
                  className="block w-full bg-slate-800 text-white text-center py-3 rounded-lg hover:bg-slate-900 transition-colors duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;