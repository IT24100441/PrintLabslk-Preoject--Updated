import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/priceCalculator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();

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
                <FiShoppingBag size={18} style={{ color: '#8B5CF6' }} />
                <h2 style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                }}>
                  Shopping Cart
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
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FiShoppingBag size={24} style={{ color: '#4B5563' }} />
                  </div>
                  <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#94A3B8', fontWeight: 500 }}>
                    Your cart is empty
                  </p>
                  <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748B', fontSize: '0.85rem' }}>
                    Add items to get started
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* STL Group */}
                  {items.filter(item => item.type === 'STL').length > 0 && (
                    <div>
                      <h4 style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#06B6D4',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06B6D4' }} />
                        Digital STL Files (1-Time Download)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {items.filter(item => item.type === 'STL').map((item) => (
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
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                              loading="lazy"
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h3 style={{
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                color: '#FFFFFF',
                                marginBottom: '0.25rem',
                                lineHeight: 1.4,
                              }} className="truncate-lines-2">
                                {item.name}
                              </h3>
                              <p style={{
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                background: 'linear-gradient(135deg, #06B6D4, #6366F1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: '0.6rem',
                              }}>
                                {formatCurrency(item.price)}
                              </p>
                              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Qty: 1 (Digital License)</span>
                            </div>
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
                    </div>
                  )}

                  {/* 3D Store Group */}
                  {items.filter(item => item.type === 'Store').length > 0 && (
                    <div>
                      <h4 style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#8B5CF6',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }} />
                        3D Models (3-Day Delivery)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {items.filter(item => item.type === 'Store').map((item) => (
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
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                              loading="lazy"
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h3 style={{
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                color: '#FFFFFF',
                                marginBottom: '0.25rem',
                                lineHeight: 1.4,
                              }} className="truncate-lines-2">
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
                                marginBottom: '0.6rem',
                              }}>
                                {formatCurrency(item.price)}
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  style={{
                                    width: 26, height: 26,
                                    borderRadius: 6,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.04)',
                                    color: '#94A3B8',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                  }}
                                  className="hover:border-up-violet hover:text-white"
                                >
                                  <FiMinus size={11} />
                                </button>
                                <span style={{
                                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                                  fontWeight: 700,
                                  fontSize: '0.875rem',
                                  color: '#FFF',
                                  minWidth: 22,
                                  textAlign: 'center',
                                }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  style={{
                                    width: 26, height: 26,
                                    borderRadius: 6,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.04)',
                                    color: '#94A3B8',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                  }}
                                  className="hover:border-up-violet hover:text-white"
                                >
                                  <FiPlus size={11} />
                                </button>
                              </div>
                            </div>
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
                    </div>
                  )}
                </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                {/* Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                }}>
                  <span style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 500,
                    color: '#94A3B8',
                    fontSize: '0.875rem',
                  }}>
                    Subtotal
                  </span>
                  <span style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '1.35rem',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                {/* Checkout */}
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="up-btn-primary"
                  style={{ justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}
                >
                  Proceed to Checkout
                </Link>

                {/* Clear */}
                <button
                  onClick={clearCart}
                  className="up-btn-danger"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
                >
                  <FiTrash2 size={14} /> Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
