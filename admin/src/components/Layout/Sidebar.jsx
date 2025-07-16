import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Plus, 
  CreditCard, 
  LogOut,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage } = useUIStore();
  const { logout } = useAuthStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'add-product', label: 'Add Product', icon: Plus },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  const handleItemClick = (id) => {
    setCurrentPage(id);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        overflow-scroll fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center px-6 py-3 text-left transition-colors duration-200
                  ${currentPage === item.id 
                    ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 mt-8 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;