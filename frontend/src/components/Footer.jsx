import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">Sneakers</span>
            </div>
            <p className="text-slate-400 mb-4 text-sm sm:text-base">
              Your premium destination for the latest in footwear fashion. Step into style with our carefully curated collection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" onClick={handleLinkClick} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Home</Link></li>
              <li><Link to="/shop" onClick={handleLinkClick} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Shop</Link></li>
              <li><Link to="/featured" onClick={handleLinkClick} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Featured</Link></li>
              <li><Link to="/sale" onClick={handleLinkClick} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Sale</Link></li>
              <li><Link to="/contact" onClick={handleLinkClick} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Size Guide</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Shipping Info</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Returns</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">FAQ</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm sm:text-base">123 Style Street, Fashion City, FC 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-slate-400 text-sm sm:text-base">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-slate-400 text-sm sm:text-base">info@Sneakers.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-slate-400 text-sm sm:text-base">
            © 2024 Sneakers. All rights reserved. Made with ❤️ for shoe lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;