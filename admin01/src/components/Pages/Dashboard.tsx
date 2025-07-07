import React, { useEffect, useState } from 'react';
import { Package, DollarSign, ShoppingCart, AlertCircle, RefreshCw } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

const Dashboard: React.FC = () => {
  const { showToast } = useUIStore();

  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    lowStockItems: 0,
    loading: true,
  });

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line
  }, []);

  const loadDashboardData = async () => {
    setDashboardData((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('http://localhost:5000/api/users/dashboard-data', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const data = await res.json();
      if (data.success) {
        setDashboardData({
          totalProducts: data.totalProducts,
          totalOrders: data.totalOrders,
          totalSales: data.totalSales,
          lowStockItems: data.lowStockItems,
          loading: false,
        });
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to load dashboard data', 'error');
      setDashboardData((prev) => ({ ...prev, loading: false }));
    }
  };

  const stats = [
    { title: 'Total Products', value: dashboardData.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Sales', value: `$${dashboardData.totalSales.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Orders', value: dashboardData.totalOrders, icon: ShoppingCart, color: 'bg-purple-500' },
    { title: 'Low Stock Items', value: dashboardData.lowStockItems, icon: AlertCircle, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={loadDashboardData}
          disabled={dashboardData.loading}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${dashboardData.loading ? 'animate-spin' : ''}`} />
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
    </div>
  );
};

export default Dashboard;