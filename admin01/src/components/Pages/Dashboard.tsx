import React, { useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, Users, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { useUIStore } from '../../stores/uiStore';

const Dashboard: React.FC = () => {
  const { products, orders, fetchProducts, fetchOrders, productsLoading, ordersLoading } = useDataStore();
  const { showToast } = useUIStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await Promise.all([fetchProducts(), fetchOrders()]);
    } catch (error: any) {
      showToast(error.message || 'Failed to load dashboard data', 'error');
    }
  };

  const totalSales = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.stock_quantity <= 5);

  const stats = [
    { title: 'Total Products', value: totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Sales', value: `$${totalSales.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'bg-purple-500' },
    { title: 'Low Stock Items', value: lowStockProducts.length, icon: AlertCircle, color: 'bg-orange-500' },
  ];

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={loadDashboardData}
          disabled={productsLoading || ordersLoading}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${(productsLoading || ordersLoading) ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Sales Overview
          </h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Sales visualization</p>
              <p className="text-sm text-gray-400 mt-1">Total Revenue: ${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Notifications
          </h3>
          <div className="space-y-4">
            {lowStockProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Low Stock Alert</p>
                  <p className="text-xs text-gray-600">
                    {product.product_name} has {product.stock_quantity} items left
                  </p>
                </div>
              </div>
            ))}
            
            {orders.filter(o => o.delivery_status === 'Pending').slice(0, 2).map((order) => (
              <div key={order.id} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-800">New Order</p>
                  <p className="text-xs text-gray-600">Order {order.id} needs attention</p>
                </div>
              </div>
            ))}

            {lowStockProducts.length === 0 && orders.filter(o => o.delivery_status === 'Pending').length === 0 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-800">All Good!</p>
                  <p className="text-xs text-gray-600">No urgent notifications</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        </div>
        {ordersLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600">Loading orders...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.delivery_status)}`}>
                        {order.delivery_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!ordersLoading && recentOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No orders found.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;