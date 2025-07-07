import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useUIStore } from './stores/uiStore';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Toast from './components/Common/Toast';
import Dashboard from './components/Pages/Dashboard';
import Products from './components/Pages/Products';
import AddProduct from './components/Pages/AddProduct';
import Orders from './components/Pages/Orders';
import Customers from './components/Pages/Customers';
import Categories from './components/Pages/Categories';
import Messages from './components/Pages/Messages';
import Payments from './components/Pages/Payments';
import Settings from './components/Pages/Settings';

function App() {
  const { isAuthenticated, isLoading, verifyAuth } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, currentPage } = useUIStore();

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <Toast />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'add-product':
        return <AddProduct />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'categories':
        return <Categories />;
      case 'messages':
        return <Messages />;
      case 'payments':
        return <Payments />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderCurrentPage()}
        </main>
      </div>
      
      <Toast />
    </div>
  );
}

export default App;