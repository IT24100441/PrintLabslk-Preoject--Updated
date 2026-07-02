import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth as useAuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthContext();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      position: 'relative',
    }}>
      {/* Aurora bg */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0,
        width: 600, height: 600,
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0,
        width: 500, height: 500,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18,
          padding: 'clamp(2rem, 5vw, 3rem)',
          width: '100%',
          maxWidth: 440,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo & header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: '#FFF',
            margin: '0 auto 1.25rem',
            boxShadow: '0 0 24px rgba(139,92,246,0.4)',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}>
            PL
          </div>
          <h1 style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 300,
            fontSize: '1.8rem',
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            marginBottom: '0.4rem',
          }}>
            Welcome{' '}
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 400,
            }}>
              Back
            </span>
          </h1>
          <p style={{
            color: '#64748B',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '0.875rem',
          }}>
            Sign in to your PrintLabs account
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10,
              color: '#EF4444',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 500,
              fontSize: '0.8rem',
              color: '#94A3B8',
              marginBottom: '0.5rem',
            }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail size={15} style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748B',
                pointerEvents: 'none',
              }} />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ paddingLeft: 40, width: '100%' }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 500,
              fontSize: '0.8rem',
              color: '#94A3B8',
              marginBottom: '0.5rem',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock size={15} style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748B',
                pointerEvents: 'none',
              }} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: 40, paddingRight: 44, width: '100%' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                  transition: 'color 0.2s',
                }}
                className="hover:text-white"
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '0.85rem',
            color: '#64748B',
            cursor: 'pointer',
          }}>
            <input type="checkbox" /> Remember me
          </label>

          {/* Submit */}
          <motion.button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="up-btn-primary"
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.95rem',
              marginTop: '0.25rem',
              justifyContent: 'center',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Signing in...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Sign In <FiArrowRight size={16} />
              </span>
            )}
          </motion.button>
        </form>

        {/* Links */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.875rem', color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#8B5CF6', fontWeight: 600, textDecoration: 'none' }}
              className="hover:text-white">
              Sign Up
            </Link>
          </p>
          <a href="#" style={{ color: '#64748B', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.825rem' }}
            className="hover:text-white">
            Forgot your password?
          </a>
        </div>

        {/* Demo credentials */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.75rem', color: '#4B5563', marginBottom: '0.5rem' }}>
            Demo Credentials
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
              <span style={{ color: '#4B5563' }}>Customer:</span> <strong style={{ color: '#94A3B8' }}>user@demo.com</strong> / <strong style={{ color: '#94A3B8' }}>demo123</strong>
            </p>
            <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
              <span style={{ color: '#4B5563' }}>Admin:</span> <strong style={{ color: '#94A3B8' }}>admin@printlabs.lk</strong> / <strong style={{ color: '#94A3B8' }}>AdminPass123!</strong>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
