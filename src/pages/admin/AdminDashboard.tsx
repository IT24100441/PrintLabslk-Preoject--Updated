import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth as useAuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiPackage, FiUsers, FiDollarSign, FiClock, FiExternalLink, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const { user }  = useAuthContext();
  const navigate  = useNavigate();
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    revenue: 0
  });
  const [recentOrdersList, setRecentOrdersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get('http://localhost:5000/api/orders/stats');
        setStatsData(statsRes.data);

        const ordersRes = await axios.get('http://localhost:5000/api/orders');
        setRecentOrdersList(ordersRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const stats = [
    { label: 'Total Orders',    value: statsData.totalOrders,       icon: FiPackage,   color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)' },
    { label: 'Customers',       value: statsData.totalCustomers,    icon: FiUsers,     color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)' },
    { label: 'Revenue',         value: `Rs. ${statsData.revenue.toLocaleString()}`, icon: FiDollarSign,color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
    { label: 'Pending Orders',  value: statsData.pendingOrders,     icon: FiClock,     color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  ];

  const statusStyle = (s: string) => {
    if (s === 'Delivered')  return { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  color: '#10B981' };
    if (s === 'Processing') return { bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.3)',  color: '#8B5CF6' };
    if (s === 'Shipped')    return { bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.3)',   color: '#06B6D4' };
    return                         { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  color: '#F59E0B' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      {/* Aurora */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: 600, height: 600,
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <p style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#8B5CF6', marginBottom: '0.5rem',
          }}>
            Admin Panel
          </p>
          <h1 style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            marginBottom: '0.4rem',
          }}>
            Dashboard{' '}
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 400,
            }}>
              Overview
            </span>
          </h1>
          <p style={{
            color: '#64748B',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '0.9rem',
          }}>
            Welcome back, <strong style={{ color: '#94A3B8' }}>{user?.name}</strong>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginBottom: '2.5rem' }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: 14,
                  padding: '1.5rem',
                  backdropFilter: 'blur(8px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Accent top bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '0.8rem', color: '#64748B', marginBottom: '0.6rem',
                    }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: '1.75rem',
                      letterSpacing: '-0.03em',
                      color: stat.color,
                      lineHeight: 1,
                    }}>
                      {stat.value}
                    </p>
                  </div>
                  <div style={{
                    width: 42, height: 42, borderRadius: 11,
                    background: stat.bg,
                    border: `1px solid ${stat.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: stat.color,
                    flexShrink: 0,
                  }}>
                    <Icon size={18} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <h2 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 500,
              fontSize: '1rem',
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
            }}>
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '0.8rem', color: '#8B5CF6', textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              className="hover:text-white"
            >
              View all <FiExternalLink size={13} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Order ID', 'Customer', 'Amount', 'Status'].map((h) => (
                    <th key={h} style={{
                      padding: '0.75rem 1.5rem',
                      textAlign: 'left',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#64748B',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrdersList.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>
                      No orders found in database.
                    </td>
                  </tr>
                ) : (
                  recentOrdersList.map((order) => {
                    const ss = statusStyle(order.status);
                    return (
                      <tr
                        key={order.id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        className="hover:bg-white hover:bg-opacity-5"
                      >
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 600, fontSize: '0.875rem',
                            color: '#8B5CF6',
                          }}>
                            {order.id}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontSize: '0.875rem', color: '#94A3B8',
                          }}>
                            {order.shippingDetails?.name || 'Guest'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 600, fontSize: '0.875rem', color: '#FFFFFF',
                          }}>
                            Rs. {order.total.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            padding: '0.2rem 0.7rem',
                            borderRadius: 99,
                            background: ss.bg,
                            border: `1px solid ${ss.border}`,
                            color: ss.color,
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 600, fontSize: '0.72rem',
                            letterSpacing: '0.04em',
                          }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Admin Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {[
            { title: 'Manage Orders',    link: '/admin/orders',    icon: FiPackage,    desc: 'View and update all customer orders' },
            { title: 'Manage Customers', link: '/admin/customers', icon: FiUsers,      desc: 'Browse and manage user accounts' },
            { title: 'Manage Products',  link: '/admin/products',  icon: FiPackage,    desc: 'Add, edit and remove listings' },
            { title: 'Monthly Reports',  link: '/admin/reports',   icon: FiTrendingUp, desc: 'View sales stats and download PDF report' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.link}
                to={item.link}
                style={{
                  display: 'block',
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  textDecoration: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                className="hover:border-up-violet"
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#8B5CF6',
                  marginBottom: '1rem',
                }}>
                  <Icon size={18} />
                </div>
                <h3 style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                  marginBottom: '0.35rem',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5,
                }}>
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
