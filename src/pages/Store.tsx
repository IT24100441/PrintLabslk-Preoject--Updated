import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { useDebounce } from '../hooks/useAuth';
import { storeProducts } from '../data/products';
import axios from 'axios';

const Store: React.FC = () => {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange]   = useState([0, 5000]);
  const [sortBy, setSortBy]           = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const store = res.data.filter((p: any) => p.type === 'Store');
        if (store && store.length > 0) {
          setProductsList(store);
        } else {
          console.warn('No Store products found in database. Falling back to local data.');
          setProductsList(storeProducts);
        }
      } catch (err) {
        console.warn('Backend API offline. Falling back to local data.', err);
        setProductsList(storeProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = productsList.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });

    if (sortBy === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);

    return result;
  }, [productsList, debouncedSearch, priceRange, sortBy]);

  return (
    <>
      {/* ── Page Header ── */}
      <section style={{
        padding: '4rem 0 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
      }}>
        {/* Subtle aurora */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 500,
          height: 300,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#8B5CF6',
              marginBottom: '0.75rem',
            }}>
              Marketplace
            </p>
            <h1 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              marginBottom: '0.75rem',
            }}>
              3D Items{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 400,
              }}>
                Store
              </span>
            </h1>
            <p style={{
              color: '#94A3B8',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.95rem',
            }}>
              Browse our collection of ready-to-print 3D items
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky Search Bar ── */}
      <section style={{
        padding: '1.25rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky',
        top: 65,
        zIndex: 30,
        background: 'rgba(11,15,25,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search */}
            <div style={{ flex: 1, position: 'relative' }}>
              <FiSearch
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="store-search"
                type="text"
                placeholder="Search 3D items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 40, width: '100%' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                  }}
                >
                  <FiX size={14} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              id="store-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ minWidth: 180 }}
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {/* Filter toggle */}
            <button
              id="store-filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
              className="up-btn-secondary"
              style={{
                padding: '0.68rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: showFilters ? 'rgba(139,92,246,0.12)' : 'transparent',
                borderColor: showFilters ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.12)',
              }}
            >
              <FiSliders size={15} /> Filters
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: '1.25rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  color: '#94A3B8',
                  marginBottom: '0.75rem',
                }}>
                  Price Range: Rs. {priceRange[0].toLocaleString('en-LK')} — Rs. {priceRange[1].toLocaleString('en-LK')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  style={{ width: '100%', maxWidth: 320 }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section style={{ padding: '3rem 0' }}>
        <div className="section-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <span className="spinner" style={{ width: 45, height: 45 }} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '6rem 0' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{
                color: '#94A3B8',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '1rem',
              }}>
                No items found matching your criteria
              </p>
              <button
                onClick={() => { setSearchQuery(''); setPriceRange([0, 5000]); }}
                className="up-btn-secondary"
                style={{ marginTop: '1.5rem' }}
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
                }}
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  >
                    <ProductCard product={product} detailLink={`/store/${product.id}`} />
                  </motion.div>
                ))}
              </motion.div>

              <p style={{
                textAlign: 'center',
                color: '#64748B',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '0.85rem',
                marginTop: '2.5rem',
              }}>
                Showing {filteredProducts.length} of {productsList.length} items
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Store;
