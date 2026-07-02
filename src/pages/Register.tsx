import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth as useAuthContext } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthContext();
  const [name, setName]                         = useState('');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError]                       = useState('');
  const [loading, setLoading]                   = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters long'); return; }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputField = (
    id: string,
    label: string,
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    Icon: React.ElementType,
    showToggle?: boolean,
    onToggle?: () => void,
    showValue?: boolean,
  ) => (
    <div>
      <label style={{
        display: 'block',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontWeight: 500,
        fontSize: '0.8rem',
        color: '#94A3B8',
        marginBottom: '0.5rem',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#64748B',
          pointerEvents: 'none',
        }} />
        <input
          id={id}
          type={showToggle ? (showValue ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ paddingLeft: 40, paddingRight: showToggle ? 44 : undefined, width: '100%' }}
          required
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
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
            {showValue ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      position: 'relative',
    }}>
      {/* Aurora */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 600, height: 600,
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.09) 0%, transparent 70%)',
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
          maxWidth: 460,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.2rem', color: '#FFF',
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
            Create{' '}
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 400,
            }}>Account</span>
          </h1>
          <p style={{
            color: '#64748B',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '0.875rem',
          }}>
            Join the PrintLabs LK community
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {inputField('reg-name', 'Full Name', 'text', name, (e) => setName(e.target.value), 'John Doe', FiUser)}
          {inputField('reg-email', 'Email Address', 'email', email, (e) => setEmail(e.target.value), 'your@email.com', FiMail)}
          {inputField('reg-password', 'Password', 'password', password, (e) => setPassword(e.target.value), '••••••••', FiLock, true, () => setShowPassword(!showPassword), showPassword)}
          {inputField('reg-confirm', 'Confirm Password', 'password', confirmPassword, (e) => setConfirmPassword(e.target.value), '••••••••', FiLock, true, () => setShowConfirmPassword(!showConfirmPassword), showConfirmPassword)}

          {/* Terms */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '0.825rem',
            color: '#64748B',
            cursor: 'pointer',
          }}>
            <input type="checkbox" required style={{ marginTop: 2 }} />
            I agree to the Terms of Service and Privacy Policy
          </label>

          {/* Submit */}
          <motion.button
            id="register-submit-btn"
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
                Creating Account...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Create Account <FiArrowRight size={16} />
              </span>
            )}
          </motion.button>
        </form>

        {/* Link */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.875rem', color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#8B5CF6', fontWeight: 600, textDecoration: 'none' }}
              className="hover:text-white">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
