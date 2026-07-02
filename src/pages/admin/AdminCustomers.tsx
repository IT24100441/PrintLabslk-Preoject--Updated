import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch customers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer account?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete customer.');
      console.error(err);
    }
  };

  return (
    <div className="py-12">
      <div className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="font-orbitron font-bold text-4xl gradient-text">Manage Customers</h1>
          <button 
            onClick={fetchCustomers}
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
            {customers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748B', padding: '2rem 0' }}>No customer accounts found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cosmic-blue border-opacity-30">
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Name</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Email</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Joined</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Orders Count</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-cosmic-blue border-opacity-20 hover:bg-cosmic-blue hover:bg-opacity-10">
                      <td className="px-4 py-3 font-bold">{customer.name}</td>
                      <td className="px-4 py-3 text-gray-400">{customer.email}</td>
                      <td className="px-4 py-3">{customer.joined}</td>
                      <td className="px-4 py-3 font-bold text-cosmic-blue">{customer.orders}</td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleDeleteCustomer(customer.id)}
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

export default AdminCustomers;
