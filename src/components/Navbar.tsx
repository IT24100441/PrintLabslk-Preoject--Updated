import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiMenu, FiX, FiLogOut, FiUser, FiGrid, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen]         = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [logoSrc, setLogoSrc]               = useState('/images/logo.jpg');

  const navigate  = useNavigate();
  const location  = useLocation();
  const { getTotalItems }               = useCart();
  const { items: wishlistItems }        = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();

  const totalCartItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Make logo white background transparent dynamically
  useEffect(() => {
    const makeLogoTransparent = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // If very close to white, make transparent
            if (r > 240 && g > 240 && b > 240) {
              data[i + 3] = 0;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          setLogoSrc(canvas.toDataURL('image/png'));
        } catch (e) {
          console.warn('Canvas transparent logo processing failed:', e);
        }
      };
      img.src = '/images/logo.jpg';
    };
    makeLogoTransparent();
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home',          href: '/' },
    { label: 'STL Files',     href: '/stl-files' },
    { label: '3D Store',      href: '/store' },
    { label: 'Instant Price', href: '/instant-price' },
    { label: 'Photo to STL',  href: '/photo-to-stl' },
  ];

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: scrolled ? 'rgba(11,15,25,0.92)' : 'rgba(11,15,25,0.75)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div className="section-container flex items-center justify-between py-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center" style={{ textDecoration: 'none', zIndex: 60 }}>
          <div
            style={{
              width: 100, // 3x scaled from footer logo
              height: 100,
              borderRadius: '50%', // round circular background
              background: '#FFFFFF', // solid white color behind logo
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(255, 255, 255, 0.4), 0 0 16px rgba(255, 255, 255, 0.5), 0 0 30px rgba(139, 92, 246, 0.3)', // creative glowing white and violet shadows
              border: '3px solid rgba(255, 255, 255, 0.95)',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              margin: '-5px 0 -25px 0', // pop out from the navbar creatively, adjusted to not cover page headings
              position: 'relative',
              flexShrink: 0,
            }}
            className="hover:scale-110 hover:shadow-[0_12px_40px_rgba(255,255,255,0.65),_0_0_30px_rgba(255,255,255,0.9),_0_0_50px_rgba(139,92,246,0.55)]"
          >
            <img
              src="/images/logo.jpg"
              alt="PrintLabs Logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallbackMark = document.getElementById('navbar-fallback-mark');
                if (fallbackMark) fallbackMark.style.display = 'flex';
              }}
              style={{
                width: '88%',
                height: '88%',
                objectFit: 'contain',
              }}
            />
            <div
              id="navbar-fallback-mark"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '2rem',
                color: '#FFF',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              PL
            </div>
          </div>
        </Link>

        {/* ── Desktop Navigation ── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: 8,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: isActive(link.href) ? 600 : 500,
                fontSize: '1.25rem',
                color: isActive(link.href) ? '#FFFFFF' : '#94A3B8',
                textDecoration: 'none',
                background: isActive(link.href) ? 'rgba(139,92,246,0.12)' : 'transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              className="hover:text-white hover:bg-white hover:bg-opacity-5"
            >
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 18,
                    height: 2,
                    borderRadius: 99,
                    background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
                  }}
                />
              )}
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Right Section ── */}
        <div className="flex items-center gap-2">

          {/* Cart */}
          <Link
            to="/checkout"
            style={{
              position: 'relative',
              padding: '0.5rem',
              borderRadius: 9,
              color: '#94A3B8',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
            className="hover:bg-white hover:bg-opacity-5 hover:text-white"
          >
            <FiShoppingCart size={19} />
            {totalCartItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  minWidth: 18,
                  height: 18,
                  background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
                  borderRadius: 99,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#FFF',
                  padding: '0 4px',
                }}
              >
                {totalCartItems}
              </motion.span>
            )}
          </Link>

          {/* Wishlist */}
          <Link
            to="/profile"
            style={{
              position: 'relative',
              padding: '0.5rem',
              borderRadius: 9,
              color: '#94A3B8',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
            className="hover:bg-white hover:bg-opacity-5 hover:text-white"
          >
            <FiHeart size={19} />
            {wishlistItems.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  minWidth: 18,
                  height: 18,
                  background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
                  borderRadius: 99,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#FFF',
                  padding: '0 4px',
                }}
              >
                {wishlistItems.length}
              </motion.span>
            )}
          </Link>

          {/* Separator */}
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

          {/* User / Login */}
          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }}>
              <button
                id="navbar-user-btn"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem 0.35rem 0.35rem',
                  borderRadius: 99,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  transition: 'all 0.2s ease',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                }}
                className="hover:border-up-violet hover:bg-opacity-10"
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: '#FFF',
                    flexShrink: 0,
                  }}
                >
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : user.name.charAt(0).toUpperCase()
                  }
                </div>
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                <FiChevronDown
                  size={14}
                  style={{
                    color: '#64748B',
                    transform: isUserDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: 200,
                      background: '#111827',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1)',
                    }}
                  >
                    {/* User info header */}
                    <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ color: '#FFF', fontWeight: 600, fontSize: '0.85rem' }}>{user.name}</p>
                      <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: 2 }}>{user.email}</p>
                    </div>

                    <div style={{ padding: '0.35rem 0' }}>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 1rem',
                          color: '#94A3B8',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          transition: 'all 0.15s ease',
                        }}
                        className="hover:bg-white hover:bg-opacity-5 hover:text-white"
                      >
                        <FiUser size={15} /> Profile
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.55rem 1rem',
                            color: '#94A3B8',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            transition: 'all 0.15s ease',
                          }}
                          className="hover:bg-white hover:bg-opacity-5 hover:text-white"
                        >
                          <FiGrid size={15} /> Admin Panel
                        </Link>
                      )}

                      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.35rem 0' }} />

                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 1rem',
                          width: '100%',
                          color: '#EF4444',
                          background: 'transparent',
                          border: 'none',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                        }}
                        className="hover:bg-red-500 hover:bg-opacity-10"
                      >
                        <FiLogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              id="navbar-login-btn"
              className="up-btn-primary"
              style={{ padding: '0.5rem 1.35rem', fontSize: '1.05rem' }}
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="navbar-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            style={{
              padding: '0.5rem',
              borderRadius: 9,
              color: '#94A3B8',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{
              borderTop: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(11,15,25,0.96)',
              overflow: 'hidden',
            }}
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.65rem 0.75rem',
                    borderRadius: 9,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: isActive(link.href) ? 500 : 400,
                    fontSize: '1.1rem',
                    color: isActive(link.href) ? '#FFFFFF' : '#94A3B8',
                    textDecoration: 'none',
                    background: isActive(link.href) ? 'rgba(139,92,246,0.1)' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
