import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { formatCurrency } from '../utils/priceCalculator';
import axios from 'axios';
import { stlProducts, getSTLProductById } from '../data/products';

const STLDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { addItem: addWishlistItem, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const allProds = res.data;
        const current = allProds && allProds.length > 0 ? allProds.find((p: any) => p.id === id) : null;
        if (current) {
          setProduct(current);
          setRelatedProducts(allProds.filter((p: any) => p.type === 'STL' && p.id !== id).slice(0, 3));
        } else {
          console.warn('Product not found in DB. Trying local fallback.');
          const local = getSTLProductById(id!);
          if (local) {
            setProduct(local);
            setRelatedProducts(stlProducts.filter((p: any) => p.id !== id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Failed to load product details from DB. Trying local fallback.', err);
        const local = getSTLProductById(id!);
        if (local) {
          setProduct(local);
          setRelatedProducts(stlProducts.filter((p: any) => p.id !== id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const isFav = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: 'cart-' + Date.now() + '-' + Math.random(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      type: 'STL',
      fileSize: product.fileSize,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddWishlist = () => {
    if (!product) return;
    addWishlistItem({
      id: 'wish-' + Date.now() + '-' + Math.random(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: 'STL',
      addedAt: Date.now(),
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 45, height: 45 }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <p style={{ color: '#94A3B8', fontFamily: '"Plus Jakarta Sans", sans-serif', marginBottom: '1.5rem' }}>
            Product not found
          </p>
          <Link to="/stl-files" className="up-btn-primary">Back to STL Files</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <section style={{
        padding: '1rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="section-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'STL Files', href: '/stl-files' },
            ].map((crumb, i) => (
              <React.Fragment key={i}>
                <Link to={crumb.href} style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '0.8rem', color: '#64748B', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                  className="hover:text-white"
                >
                  {crumb.label}
                </Link>
                <span style={{ color: '#4B5563', fontSize: '0.75rem' }}>/</span>
              </React.Fragment>
            ))}
            <span style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.8rem', color: '#8B5CF6', fontWeight: 500,
            }}
              className="truncate"
            >
              {product.name}
            </span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="section-container">
          {/* Back button */}
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ x: -4 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94A3B8', fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.875rem', fontWeight: 500,
              marginBottom: '2rem', padding: 0,
              transition: 'color 0.2s',
            }}
            className="hover:text-white"
          >
            <FiArrowLeft size={16} /> Back
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                overflow: 'hidden',
                minHeight: 380,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 380 }}
                loading="lazy"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              {/* Badge + Title */}
              <div>
                <span className="up-pill-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>.STL</span>
                <h1 style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 300,
                  fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                }}>
                  {product.name}
                </h1>
              </div>

              {/* Price card */}
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'rgba(139,92,246,0.06)',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: 12,
              }}>
                <p style={{ color: '#64748B', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                  Price
                </p>
                <p style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '2.2rem',
                  letterSpacing: '-0.04em',
                  background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                }}>
                  {formatCurrency(product.price)}
                </p>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'File Size', value: product.fileSize },
                  {
                    label: 'Availability',
                    value: 'Instant Download',
                    color: '#10B981',
                  },
                ].map((meta) => (
                  <div key={meta.label} style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12,
                  }}>
                    <p style={{ color: '#64748B', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                      {meta.label}
                    </p>
                    <p style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: (meta as any).color || '#FFFFFF',
                    }}>
                      {meta.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{
                padding: '1.25rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
              }}>
                <p style={{ color: '#64748B', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  Description
                </p>
                <p style={{ color: '#94A3B8', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  {product.description}
                </p>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <motion.button
                  onClick={handleAddToCart}
                  disabled={false}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="up-btn-primary"
                  style={{ flex: 1, minWidth: 160, justifyContent: 'center', padding: '0.85rem' }}
                >
                  <FiShoppingCart size={16} /> Add to Cart
                </motion.button>
                <motion.button
                  onClick={handleAddWishlist}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.85rem 1.25rem',
                    background: isFav ? 'rgba(139,92,246,0.15)' : 'transparent',
                    border: isFav ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 99,
                    color: isFav ? '#8B5CF6' : '#94A3B8',
                    cursor: 'pointer',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}
                >
                  <FiHeart size={15} fill={isFav ? 'currentColor' : 'none'} />
                  {isFav ? 'Saved' : 'Wishlist'}
                </motion.button>
              </div>

              {/* Success feedback */}
              {isAdded && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 10,
                    color: '#10B981',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FiCheck size={15} /> Added to cart successfully!
                </motion.div>
              )}

              {/* File Info */}
              <div style={{
                padding: '1.25rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
              }}>
                <h3 style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  color: '#FFFFFF',
                  marginBottom: '0.75rem',
                }}>
                  File Information
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {[
                    'Optimized for FDM printing',
                    'Multiple material compatible',
                    'Ready to print format',
                    'High-resolution model',
                    'Commercial use allowed',
                  ].map((info) => (
                    <li key={info} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '0.825rem', color: '#94A3B8',
                    }}>
                      <FiCheck size={13} style={{ color: '#8B5CF6', flexShrink: 0 }} />
                      {info}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{
          padding: '3rem 0',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div className="section-container">
            <h2 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
              marginBottom: '2rem',
            }}>
              Related{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 400,
              }}>
                STL Files
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <ProductCard product={rp} detailLink={`/stl-files/${rp.id}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default STLDetail;
