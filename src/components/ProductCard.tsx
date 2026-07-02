import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  detailLink: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, detailLink }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem }                                = useCart();
  const { addItem: addWishlistItem, isInWishlist } = useWishlist();

  const isFav  = isInWishlist(product.id);
  const isSTL  = 'fileSize' in product;
  const height = !isSTL && 'height' in product ? (product as any).height : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id:       'cart-' + Date.now() + '-' + Math.random(),
      productId: product.id,
      name:      product.name,
      price:     product.price,
      quantity:  1,
      image:     product.image,
      type:      isSTL ? 'STL' : 'Store',
      fileSize:  isSTL ? (product as any).fileSize : undefined,
      height,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    addWishlistItem({
      id:        'wish-' + Date.now() + '-' + Math.random(),
      productId: product.id,
      name:      product.name,
      price:     product.price,
      image:     product.image,
      type:      isSTL ? 'STL' : 'Store',
      addedAt:   Date.now(),
    });
  };

  return (
    <Link to={detailLink} style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{ y: isHovered ? -5 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: isHovered
            ? '1px solid rgba(139,92,246,0.55)'
            : '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          overflow: 'hidden',
          backdropFilter: 'blur(8px)',
          boxShadow: isHovered
            ? '0 12px 40px rgba(139,92,246,0.18), 0 0 0 1px rgba(139,92,246,0.2)'
            : '0 1px 4px rgba(0,0,0,0.3)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Image Container ── */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
          <motion.img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            loading="lazy"
          />

          {/* Gradient overlay on hover */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(11,15,25,0.85) 0%, rgba(11,15,25,0.2) 50%, transparent 100%)',
              backdropFilter: isHovered ? 'blur(2px)' : 'blur(0px)',
            }}
          />

          {/* Top Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {isSTL ? (
              <span className="up-pill-badge">.STL</span>
            ) : (
              <span className="up-pill-badge"
                style={{ borderColor: 'rgba(6,182,212,0.4)', color: '#06B6D4', background: 'rgba(6,182,212,0.08)' }}
              >
                3D Print
              </span>
            )}
            {('badge' in product && (product as any).badge) && (
              <span className="up-pill-badge"
                style={{ borderColor: 'rgba(245,158,11,0.4)', color: '#F59E0B', background: 'rgba(245,158,11,0.08)' }}
              >
                {(product as any).badge}
              </span>
            )}
          </div>

          {/* Out of Stock */}
          {!isSTL && !product.available && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                padding: '0.2rem 0.6rem',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: 99,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#EF4444',
                letterSpacing: '0.04em',
              }}
            >
              Out of Stock
            </div>
          )}

          {/* Hover Action Buttons */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  right: 12,
                  display: 'flex',
                  gap: 8,
                }}
              >
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!isSTL && !product.available}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0',
                    background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                    border: 'none',
                    borderRadius: 9,
                    color: '#FFF',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    opacity: isSTL || product.available ? 1 : 0.4,
                    boxShadow: '0 4px 16px rgba(139,92,246,0.4)',
                  }}
                >
                  <FiShoppingCart size={14} /> Add to Cart
                </motion.button>

                <motion.button
                  onClick={handleAddToWishlist}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.55rem',
                    background: isFav ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.08)',
                    border: isFav ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 9,
                    color: isFav ? '#8B5CF6' : '#FFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <FiHeart size={15} fill={isFav ? 'currentColor' : 'none'} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '1rem 1.1rem 1.2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Name */}
          <h3
            className="truncate-lines-2"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 500,
              fontSize: '0.95rem',
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
            }}
          >
            {product.name}
          </h3>

          {/* Meta badge row */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {isSTL ? (
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Size: {(product as any).fileSize}
              </span>
            ) : height ? (
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Height: {height}
              </span>
            ) : null}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Price + CTA Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
                fontSize: '1.15rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              Rs. {product.price.toLocaleString('en-LK')}
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '0.3rem 0.7rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 9,
                color: '#94A3B8',
                fontSize: '0.75rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              <FiEye size={12} /> View
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
