import React, { useState, useEffect } from 'react';
import { Eye, Filter, Search, RefreshCw, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

const Orders = () => {
  const { showToast } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersState, setOrdersState] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders/getAllOrders', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrdersState(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      showToast(error.message || 'Failed to load orders', 'error');
      setOrdersState([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/update/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ delivery_status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      showToast(`Order status updated to ${newStatus}`, 'success');
      await loadOrders();
    } catch (error) {
      showToast(error.message || 'Failed to update order status', 'error');
    }
  };

  const statuses = ['all', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = ordersState.filter(order => {
    const matchesSearch =
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || order.delivery_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
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

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Order ID:</span> {order.id}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(order.created_at)}</p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(order.delivery_status)}`}>
                      {order.delivery_status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Total:</span>{' '}
                    ₹{order.total_price ? Number(order.total_price).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {order.customer_name || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {order.customer_email || 'N/A'}</p>
                  <p><span className="font-medium">User ID:</span> {order.user_id}</p>
                </div>
              </div>
            </div>

            {order.order_items && order.order_items.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {order.order_items.map((item, index) => {
                    let price = 0;
                    if (item.price !== undefined) {
                      price = Number(item.price);
                    } else if (item.price_at_purchase !== undefined) {
                      price = Number(item.price_at_purchase);
                    }
                    const quantity = Number(item.quantity) || 1;
                    const total = !isNaN(price) && !isNaN(quantity) ? price * quantity : 0;
                    return (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                            {item.size && ` | Size: ${item.size}`}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₹{typeof total === 'number' && isFinite(total) ? total.toFixed(2) : '0.00'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <button
          onClick={loadOrders}
          disabled={ordersLoading}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customer_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.customer_email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total_price ? Number(order.total_price).toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.delivery_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full border-none px-2 py-1 ${getStatusColor(order.delivery_status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!ordersLoading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No orders found matching your criteria.</div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default Orders;