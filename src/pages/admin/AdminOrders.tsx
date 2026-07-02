import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch orders from database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      alert('Failed to update order status.');
      console.error(err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err: any) {
      alert('Failed to delete order.');
      console.error(err);
    }
  };

  return (
    <div className="py-12">
      <div className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="font-orbitron font-bold text-4xl gradient-text">Manage Orders</h1>
          <button 
            onClick={fetchOrders}
            className="up-btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
          >
            <FiRefreshCw size={15} /> Refresh
          </button>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#EF4444', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <span className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glow p-8 overflow-x-auto"
          >
            {orders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748B', padding: '2rem 0' }}>No orders found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cosmic-blue border-opacity-30">
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Order ID</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Customer</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Items count</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Total</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Date</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Status</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-cosmic-blue border-opacity-20 hover:bg-cosmic-blue hover:bg-opacity-10">
                      <td className="px-4 py-3 font-bold text-cosmic-blue">{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{order.shippingDetails?.name || 'Guest'}</div>
                        <div className="text-xs text-gray-500">{order.shippingDetails?.phone || ''}</div>
                      </td>
                      <td className="px-4 py-3">{order.items?.length || 0}</td>
                      <td className="px-4 py-3">Rs. {order.total.toLocaleString()}</td>
                      <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString('en-LK')}</td>
                      <td className="px-4 py-3">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs bg-cosmic-blue bg-opacity-20 border border-cosmic-blue rounded px-2 py-1 text-white"
                          style={{ background: '#111827' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 hover:bg-red-500 hover:bg-opacity-20 text-red-400 rounded"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
