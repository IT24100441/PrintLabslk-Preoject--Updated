import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiX, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [type, setType] = useState<'STL' | 'Store'>('STL');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [height, setHeight] = useState('');
  const [available, setAvailable] = useState(true);
  const [badge, setBadge] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch products from database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setType('STL');
    setPrice(0);
    setImage('');
    setDescription('');
    setFileSize('');
    setHeight('');
    setAvailable(true);
    setBadge('');
    setIsOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setName(p.name);
    setType(p.type);
    setPrice(p.price);
    setImage(p.image);
    setDescription(p.description || '');
    setFileSize(p.fileSize || '');
    setHeight(p.height || '');
    setAvailable(p.available);
    setBadge(p.badge || '');
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product.');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name,
      type,
      price: Number(price),
      image: image || '/images/logo.jpg',
      description,
      available,
      badge,
      ...(type === 'STL' ? { fileSize } : { height })
    };

    try {
      if (editingProduct) {
        // Edit PUT request
        const res = await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, productData);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data : p));
      } else {
        // Create POST request
        const customId = type === 'STL' ? `stl-${Date.now()}` : `store-${Date.now()}`;
        const res = await axios.post('http://localhost:5000/api/products', { id: customId, ...productData });
        setProducts(prev => [...prev, res.data]);
      }
      setIsOpen(false);
    } catch (err) {
      alert('Failed to save product listing.');
      console.error(err);
    }
  };

  return (
    <div className="py-12">
      <div className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="font-orbitron font-bold text-4xl gradient-text">Manage Products</h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={fetchProducts}
              className="up-btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
            >
              <FiRefreshCw /> Refresh
            </button>
            <button 
              onClick={openAddModal}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
            >
              <FiPlus /> Add Product
            </button>
          </div>
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
            {products.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748B', padding: '2rem 0' }}>No products found in catalog.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cosmic-blue border-opacity-30">
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Name</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Type</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Price</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Details</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Status</th>
                    <th className="px-4 py-3 text-left text-cosmic-blue font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-cosmic-blue border-opacity-20 hover:bg-cosmic-blue hover:bg-opacity-10">
                      <td className="px-4 py-3 font-bold truncate-lines-2">{product.name}</td>
                      <td className="px-4 py-3">
                        <span style={{ color: product.type === 'STL' ? '#8B5CF6' : '#06B6D4' }}>{product.type}</span>
                      </td>
                      <td className="px-4 py-3">Rs. {product.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {product.type === 'STL' ? `Size: ${product.fileSize || '-'}` : `Height: ${product.height || '-'}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.available
                            ? 'bg-green-500 bg-opacity-20 text-green-400'
                            : 'bg-red-500 bg-opacity-20 text-red-400'
                        }`}>
                          {product.available ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 hover:bg-cosmic-blue hover:bg-opacity-20 rounded"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
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

      {/* ── Glassmorphic Edit Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'rgba(5, 7, 12, 0.75)',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              style={{
                width: '100%',
                maxWidth: '550px',
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.15)',
                padding: '2rem',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="font-orbitron font-bold text-2xl text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                  className="hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="text-xs text-gray-400 font-bold block mb-1">Product Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter name" 
                    required 
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 font-bold block mb-1">Type</label>
                    <select 
                      value={type} 
                      onChange={(e) => setType(e.target.value as any)}
                      style={{ width: '100%', background: '#1F2937' }}
                    >
                      <option value="STL">STL File (Digital)</option>
                      <option value="Store">3D Print (Physical)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-bold block mb-1">Price (Rs.)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(Number(e.target.value))} 
                      placeholder="Price in LKR" 
                      required 
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {type === 'STL' ? (
                    <div>
                      <label className="text-xs text-gray-400 font-bold block mb-1">File Size</label>
                      <input 
                        type="text" 
                        value={fileSize} 
                        onChange={(e) => setFileSize(e.target.value)} 
                        placeholder="e.g. 150MB" 
                        required={type === 'STL'}
                        style={{ width: '100%' }}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs text-gray-400 font-bold block mb-1">Product Height</label>
                      <input 
                        type="text" 
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)} 
                        placeholder="e.g. 6 inch" 
                        required={type === 'Store'}
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-gray-400 font-bold block mb-1">Badge (Optional)</label>
                    <input 
                      type="text" 
                      value={badge} 
                      onChange={(e) => setBadge(e.target.value)} 
                      placeholder="e.g. Special Edition" 
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-bold block mb-1">Image Path</label>
                  <input 
                    type="text" 
                    value={image} 
                    onChange={(e) => setImage(e.target.value)} 
                    placeholder="e.g. /images/your_image.jpg" 
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-bold block mb-1">Description</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Product details..." 
                    rows={3}
                    style={{ width: '100%', background: '#1F2937', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', padding: '0.5rem 0.75rem', fontSize: '0.9rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="modal-available"
                    checked={available} 
                    onChange={(e) => setAvailable(e.target.checked)} 
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor="modal-available" style={{ color: '#94A3B8', fontSize: '0.85rem', cursor: 'pointer' }}>Active and Available for sale</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    className="up-btn-secondary"
                    style={{ flex: 1, padding: '0.75rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.75rem' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
