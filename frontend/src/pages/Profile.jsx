import React, { useEffect } from 'react';
import { User, Package, Heart, Settings, LogOut, AlertCircle, Loader } from 'lucide-react';
import { useStore } from '../store/useStore';

const Profile = () => {
  const { 
    user, 
    orders, 
    ordersLoading, 
    ordersError, 
    fetchOrders, 
    logout 
  } = useStore();

  // Fetch orders when component mounts
  useEffect(() => {
    if (user && orders.length === 0 && !ordersLoading) {
      fetchOrders();
    }
  }, [user, orders.length, ordersLoading, fetchOrders]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Please log in to view your profile</h1>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-slate-500" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">{user.name}</h1>
              <p className="text-slate-600">{user.email}</p>
            </div>

            <nav className="space-y-2">
              {/* <a href="#" className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">
                <User className="h-5 w-5" />
                <span>Profile Details</span>
              </a> */}
              <a href="#" className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">
                <Package className="h-5 w-5" />
                <span>Order History</span>
              </a>
              {/* <a href="#" className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">
                <Heart className="h-5 w-5" />
                <span>Wishlist</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a> */}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Order History</h2>
              
              {ordersLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader className="h-8 w-8 text-orange-500 animate-spin mb-4" />
                  <p className="text-slate-600">Loading your orders...</p>
                </div>
              ) : ordersError ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
                  <p className="text-slate-600 mb-4">{ordersError}</p>
                  <button
                    onClick={fetchOrders}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">Order #{order.id}</h3>
                          <p className="text-sm text-slate-600">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-slate-900">
                            ${order.total}
                          </div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status }
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-slate-900">{item.product.name}</h4>
                              <p className="text-xs text-slate-600">
                                {item.selectedSize} • {item.selectedColor} • Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-sm text-slate-900">
                              {item && item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number' && !isNaN(item.product.price) && !isNaN(item.quantity)
                                ? `$${(item.product.price * item.quantity).toFixed(2)}`
                                : '--'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;