import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiEdit2, FiLock, FiPackage, FiHeart } from 'react-icons/fi';
import { useAuth as useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import { formatCurrency } from '../utils/priceCalculator';


const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    birthday: user?.birthday || '',
  });

  // New states for orders and downloads
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [downloadedStls, setDownloadedStls] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('downloaded_stl_items') || '{}');
    setDownloadedStls(saved);
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await axios.get('http://localhost:5000/api/orders');
          const userOrders = res.data.filter((o: any) => o.userId === user.id);
          setOrders(userOrders);
        } catch (err) {
          console.warn('Backend server offline. Loading mock orders from local storage.');
          const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
          setOrders(localOrders.filter((o: any) => o.userId === user.id));
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, user]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const handleSaveProfile = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glow p-8 mb-12 flex items-center gap-6"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cosmic-blue to-cosmic-violet flex items-center justify-center font-bold text-3xl text-cosmic-dark">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-orbitron font-bold text-3xl mb-2 gradient-text">{user.name}</h1>
            <p className="text-gray-400 mb-2">{user.email}</p>
            <div className="badge">{user.role === 'admin' ? 'Admin' : 'Member'}</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="card-glow p-6 h-fit">
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Edit Profile', icon: FiEdit2 },
                { id: 'orders', label: 'My Orders', icon: FiPackage },
                { id: 'wishlist', label: 'My Wishlist', icon: FiHeart },
                { id: 'security', label: 'Security', icon: FiLock },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-cosmic-blue bg-opacity-20 text-cosmic-blue border-l-2 border-cosmic-blue'
                        : 'text-gray-400 hover:text-cosmic-blue'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500 hover:bg-opacity-20 transition-all"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </nav>
          </div>

          {/* Content */}
          <motion.div
            className="lg:col-span-3"
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Edit Profile */}
            {activeTab === 'profile' && (
              <div className="card-glow p-8 space-y-6">
                <h2 className="font-orbitron font-bold text-2xl gradient-text mb-6">
                  Edit Profile
                </h2>

                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-cosmic-darker bg-opacity-50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-2">Full Name</p>
                        <p className="font-bold">{user.name}</p>
                      </div>
                      <div className="bg-cosmic-darker bg-opacity-50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-2">Email</p>
                        <p className="font-bold">{user.email}</p>
                      </div>
                      <div className="bg-cosmic-darker bg-opacity-50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-2">Phone</p>
                        <p className="font-bold">{user.phone || 'Not provided'}</p>
                      </div>
                      <div className="bg-cosmic-darker bg-opacity-50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-2">City</p>
                        <p className="font-bold">{user.city || 'Not provided'}</p>
                      </div>
                      <div className="bg-cosmic-darker bg-opacity-50 p-4 rounded-lg md:col-span-2">
                        <p className="text-gray-400 text-sm mb-2">Address</p>
                        <p className="font-bold">{user.address || 'Not provided'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary"
                    >
                      Edit Information
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name"
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone Number"
                    />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                    />
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      placeholder="Birthday"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 btn-primary"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My Orders */}
            {activeTab === 'orders' && (
              <div className="card-glow p-8 space-y-6">
                <h2 className="font-orbitron font-bold text-2xl gradient-text mb-6">
                  My Orders
                </h2>
                
                {loadingOrders ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <span className="spinner" style={{ width: 35, height: 35 }} />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📦</div>
                    <p className="text-gray-400">No orders yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Your orders will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 bg-cosmic-darker bg-opacity-40 rounded-xl border border-white border-opacity-5 space-y-4">
                        {/* Order Header Info */}
                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white border-opacity-5 pb-3 text-sm">
                          <div>
                            <span className="text-gray-400">Order ID: </span>
                            <span className="font-mono font-bold text-cosmic-blue">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Placed: </span>
                            <span className="font-bold">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Status: </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-green-500 bg-opacity-10 text-green-400' :
                              order.status === 'Cancelled' ? 'bg-red-500 bg-opacity-10 text-red-400' :
                              'bg-cosmic-blue bg-opacity-10 text-cosmic-blue'
                            }`}>{order.status}</span>
                          </div>
                          <div className="font-bold text-cosmic-blue">
                            {formatCurrency(order.total)}
                          </div>
                        </div>

                        {/* Order Items & Actions */}
                        <div className="space-y-4">
                          {order.items.map((item: any, idx: number) => {
                            const isStl = item.type === 'STL';
                            const dlKey = `${order.id}-${item.productId}`;
                            const isDownloaded = downloadedStls[dlKey] || false;
                            
                            return (
                              <div key={idx} className="flex flex-wrap gap-4 items-center justify-between p-3 bg-cosmic-dark bg-opacity-50 rounded-lg border border-white border-opacity-5">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold truncate max-w-[20rem]">{item.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {isStl ? `License: 1-Time Download (${item.fileSize || 'N/A'})` : `Height: ${item.height || 'N/A'}`}
                                    </p>
                                    {!isStl && (
                                      <p className="text-xs text-cosmic-violet font-semibold mt-1">
                                        📦 Will be delivered within 3 Days
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {isStl ? (
                                    <button
                                      onClick={() => {
                                        // Trigger download
                                        const mockStlContent = `solid PrintLabsLK_${item.name.replace(/\s+/g, '_')}\n  facet normal 0 0 0\n    outer loop\n      vertex 0 0 0\n      vertex 1 0 0\n      vertex 0 1 0\n    endloop\n  endfacet\nendsolid`;
                                        const blob = new Blob([mockStlContent], { type: 'model/stl' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `${item.name.toLowerCase().replace(/\s+/g, '_')}_design.stl`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);

                                        // Update download count
                                        const updated = { ...downloadedStls, [dlKey]: true };
                                        setDownloadedStls(updated);
                                        localStorage.setItem('downloaded_stl_items', JSON.stringify(updated));
                                      }}
                                      disabled={isDownloaded}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        isDownloaded
                                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                          : 'bg-cosmic-blue text-cosmic-dark hover:shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                                      }`}
                                    >
                                      {isDownloaded ? 'Downloaded (0 left)' : 'Download STL (1 left)'}
                                    </button>
                                  ) : (
                                    <span className="text-xs text-gray-400 italic">
                                      Est. Delivery: {new Date(new Date(order.createdAt || Date.now()).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="card-glow p-8">
                <h2 className="font-orbitron font-bold text-2xl gradient-text mb-6">
                  My Wishlist
                </h2>
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">❤️</div>
                  <p className="text-gray-400">Your wishlist is empty</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add items to your wishlist from the store
                  </p>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="card-glow p-8 space-y-6">
                <h2 className="font-orbitron font-bold text-2xl gradient-text mb-6">
                  Security Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-cosmic-blue">
                      Current Password
                    </label>
                    <input type="password" placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-cosmic-blue">
                      New Password
                    </label>
                    <input type="password" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-cosmic-blue">
                      Confirm New Password
                    </label>
                    <input type="password" placeholder="Confirm new password" />
                  </div>
                  <button className="btn-primary w-full md:w-auto">
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
