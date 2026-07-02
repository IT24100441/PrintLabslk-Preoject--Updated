import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/priceCalculator';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart({
      id:        'cart-' + Date.now() + '-' + Math.random(),
      productId: item.productId,
      name:      item.name,
      price:     item.price,
      quantity:  1,
      image:     item.image,
      type:      item.type,
    });
    removeItem(item.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100vh',
              width: '100%',
              maxWidth: 400,
              background: '#0F1420',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '-24px 0 80px rgba(0,0,0,0.5)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FiHeart size={18} style={{ color: '#8B5CF6' }} />
                <h2 style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                }}>
                  Wishlist
                </h2>
                {items.length > 0 && (
                  <span style={{
                    padding: '0.1rem 0.5rem',
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: 99,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#8B5CF6',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                  }}>
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: '0.4rem',
                  color: '#64748B',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 7,
                  display: 'flex',
                  transition: 'all 0.2s',
                }}
                className="hover:text-white hover:bg-white hover:bg-opacity-5"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
              {items.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: '0.75rem',
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: 64, height: 64,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FiHeart size={24} style={{ color: '#4B5563' }} />
                  </div>
                  <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#94A3B8', fontWeight: 500 }}>
                    Your wishlist is empty
                  </p>
                  <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748B', fontSize: '0.85rem' }}>
                    Save items for later
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        padding: '0.9rem',
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 12,
                      }}
                    >
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                        loading="lazy"
                      />

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          color: '#FFFFFF',
                          marginBottom: '0.35rem',
                          lineHeight: 1.4,
                        }}
                          className="truncate-lines-2"
                        >
                          {item.name}
                        </h3>
                        <p style={{
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          marginBottom: '0.65rem',
                        }}>
                          {formatCurrency(item.price)}
                        </p>

                        {/* Move to cart */}
                        <button
                          onClick={() => handleMoveToCart(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                            border: 'none',
                            borderRadius: 7,
                            color: '#FFF',
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          <FiShoppingCart size={12} /> Add to Cart
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          padding: '0.4rem',
                          color: '#64748B',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: 7,
                          display: 'flex',
                          alignSelf: 'flex-start',
                          transition: 'all 0.2s',
                          flexShrink: 0,
                        }}
                        className="hover:text-red-400 hover:bg-red-500 hover:bg-opacity-10"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
