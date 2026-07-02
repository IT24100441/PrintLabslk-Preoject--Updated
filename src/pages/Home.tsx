import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowRight, FiLayers, FiCpu, FiZap } from 'react-icons/fi';
import { useIntersectionObserver } from '../hooks/useAuth';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { allProducts } from '../data/products';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0 },
};

const Home: React.FC = () => {
  const statsRef    = useRef<HTMLDivElement>(null);
  const statsVisible = useIntersectionObserver(statsRef);
  const [productsList, setProductsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        if (res.data && res.data.length > 0) {
          setProductsList(res.data.slice(0, 3));
        } else {
          console.warn('No products found in database. Falling back to local data.');
          setProductsList(allProducts.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch products for homepage. Falling back to local data.', err);
        setProductsList(allProducts.slice(0, 3));
      }
    };
    fetchProducts();
  }, []);

  // Counter animation for stats (all logic preserved)
  const Counter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
      if (!statsVisible) return;

      let current = 0;
      const increment = end / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 20);

      return () => clearInterval(timer);
    }, [statsVisible, end]);

    return (
      <span style={{
        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #06B6D4 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {count.toLocaleString('en-LK')}{suffix}
      </span>
    );
  };

  const services = [
    {
      icon: <FiLayers size={24} />,
      title: 'STL File Design',
      description: 'Professional 3D model design and optimization for printing perfection. Every polygon tuned for precision.',
      badge: 'Design',
      color: '#8B5CF6',
    },
    {
      icon: <FiCpu size={24} />,
      title: '3D Printing',
      description: 'State-of-the-art printing services with multiple material options. From prototype to product.',
      badge: 'Print',
      color: '#6366F1',
    },
    {
      icon: <FiZap size={24} />,
      title: 'Custom Orders',
      description: 'Tailored solutions for unique and specialized printing projects. Bring any vision to life.',
      badge: 'Custom',
      color: '#06B6D4',
    },
  ];

  return (
    <>
      {/* ════════════════════════════════════
          AURORA BACKGROUND
      ════════════════════════════════════ */}
      <div className="aurora-container" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      {/* ════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingTop: '4rem',
          paddingBottom: '4rem',
        }}
      >
        <div className="section-container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>

          {/* Version badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 1rem',
                borderRadius: 99,
                border: '1px solid rgba(139,92,246,0.35)',
                background: 'rgba(139,92,246,0.08)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#A78BFA',
                letterSpacing: '0.04em',
                animation: 'badgeGlow 3s ease-in-out infinite',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#8B5CF6',
                boxShadow: '0 0 6px #8B5CF6',
                display: 'inline-block',
              }} />
              v2.0 Marketplace Live — Premium 3D Assets
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1
              style={{
                fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(2.8rem, 7vw, 5.2rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: '#FFFFFF',
                marginBottom: '1.25rem',
                maxWidth: '900px',
                margin: '0 auto 1.25rem',
              }}
            >
              From Polygons{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 40%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 400,
              }}>
                to Reality.
              </span>
              <br />
              <span style={{ fontWeight: 300 }}>
                Supercharge your workflow.
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{
              color: '#94A3B8',
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
              fontWeight: 400,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            Premium 3D design and printing services from Sri Lanka.
            Transform ideas into precision-crafted physical products with cutting-edge technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: 'flex',
              gap: '0.85rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem',
            }}
          >
            <Link
              to="/stl-files"
              id="hero-explore-btn"
              className="up-btn-primary"
              style={{ padding: '0.8rem 2rem', fontSize: '0.95rem' }}
            >
              Explore STL Files <FiArrowRight size={16} />
            </Link>
            <Link
              to="/store"
              id="hero-shop-btn"
              className="up-btn-secondary"
              style={{ padding: '0.8rem 2rem', fontSize: '0.95rem' }}
            >
              Shop 3D Items
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: '#64748B',
              fontSize: '0.75rem',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}>
              <FiArrowDown size={18} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS SECTION
      ════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', position: 'relative', zIndex: 2 }}>
        <div className="section-container">
          {/* Section label */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#64748B',
            }}>
              By the Numbers
            </span>
          </div>

          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Premium Models',   value: 100, suffix: '+', sublabel: 'Ready to print STL files' },
              { label: 'Prints Completed', value: 500, suffix: '+', sublabel: 'Orders fulfilled with precision' },
              { label: 'Happy Clients',    value: 50,  suffix: '+', sublabel: 'Across Sri Lanka' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="up-card"
                style={{ padding: '2rem', textAlign: 'center' }}
              >
                <div style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '3rem',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <p style={{
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontSize: '1rem',
                  marginBottom: '0.4rem',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}>
                  {stat.label}
                </p>
                <p style={{
                  color: '#64748B',
                  fontSize: '0.8rem',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}>
                  {stat.sublabel}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SERVICES SECTION
      ════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', position: 'relative', zIndex: 2 }}>
        <div className="section-container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#8B5CF6',
                marginBottom: '0.75rem',
              }}
            >
              What We Do
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
              }}
            >
              Our{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 400,
              }}>
                Services
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="up-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                style={{ padding: '2rem' }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `rgba(${service.color === '#8B5CF6' ? '139,92,246' : service.color === '#6366F1' ? '99,102,241' : '6,182,212'}, 0.12)`,
                    border: `1px solid rgba(${service.color === '#8B5CF6' ? '139,92,246' : service.color === '#6366F1' ? '99,102,241' : '6,182,212'}, 0.3)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: service.color,
                    marginBottom: '1.25rem',
                  }}
                >
                  {service.icon}
                </div>

                <span className="up-pill-badge" style={{
                  borderColor: `rgba(${service.color === '#8B5CF6' ? '139,92,246' : service.color === '#6366F1' ? '99,102,241' : '6,182,212'}, 0.4)`,
                  color: service.color,
                  background: `rgba(${service.color === '#8B5CF6' ? '139,92,246' : service.color === '#6366F1' ? '99,102,241' : '6,182,212'}, 0.08)`,
                  marginBottom: '1rem',
                  display: 'inline-flex',
                }}>
                  {service.badge}
                </span>

                <h3 style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  color: '#FFFFFF',
                  letterSpacing: '-0.015em',
                  marginBottom: '0.6rem',
                }}>
                  {service.title}
                </h3>

                <p style={{
                  color: '#94A3B8',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}>
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', position: 'relative', zIndex: 2 }}>
        <div className="section-container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#8B5CF6',
                marginBottom: '0.75rem',
              }}
            >
              Catalog Preview
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
              }}
            >
              Featured{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 400,
              }}>
                Products
              </span>
            </motion.h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
          >
            {productsList.map((product, index) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard
                  product={product}
                  detailLink={
                    product.type === 'STL'
                      ? `/stl-files/${product.id}`
                      : `/store/${product.id}`
                  }
                />
              </motion.div>
            ))}
          </motion.div>

          {/* View All */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link
              to="/stl-files"
              id="home-view-all-btn"
              className="up-btn-secondary"
              style={{ padding: '0.8rem 2.5rem' }}
            >
              View All Products <FiArrowRight size={16} style={{ display: 'inline', marginLeft: 4 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          COMPANY INFO SECTION
      ════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', position: 'relative', zIndex: 2 }}>
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Logo mark */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 60%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  color: '#FFF',
                  marginBottom: '1.5rem',
                  boxShadow: '0 0 32px rgba(139,92,246,0.4)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  letterSpacing: '-0.02em',
                }}
              >
                PL
              </div>

              <h2
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 300,
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF',
                  marginBottom: '0.5rem',
                }}
              >
                PrintLabs{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 400,
                }}>
                  LK
                </span>
              </h2>

              <p style={{
                color: '#64748B',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '0.85rem',
                marginBottom: '2rem',
              }}>
                Design It. Print It. Own It.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                {[
                  { label: 'Location', value: 'Yakkala, Sri Lanka', emoji: '📍' },
                  { label: 'Phone',    value: '072 287 6497',        emoji: '📞', href: 'tel:0722876497' },
                  { label: 'Email',    value: 'info@printlabs.lk',  emoji: '✉️', href: 'mailto:info@printlabs.lk' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1rem' }}>{item.emoji}</span>
                    <div>
                      <span style={{ color: '#64748B', fontSize: '0.75rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {item.label}
                      </span>
                      {item.href ? (
                        <a href={item.href} style={{
                          display: 'block',
                          color: '#94A3B8',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          transition: 'color 0.2s',
                        }}
                          className="hover:text-white"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p style={{ color: '#94A3B8', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.9rem', fontWeight: 500 }}>
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{
                color: '#64748B',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '0.9rem',
                lineHeight: 1.7,
              }}>
                We are committed to delivering high-quality 3D printing solutions with exceptional customer
                service. Our state-of-the-art facility and experienced team ensure every project exceeds expectations.
              </p>
            </motion.div>

            {/* Right: Map Card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="up-card"
              style={{ padding: '2.5rem', minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem' }}
            >
              <div style={{ fontSize: '3.5rem' }}>📍</div>
              <h4 style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 500,
                fontSize: '1.2rem',
                color: '#FFFFFF',
                letterSpacing: '-0.015em',
              }}>
                Yakkala, Sri Lanka
              </h4>
              <p style={{ color: '#64748B', fontSize: '0.875rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Visit us or call for inquiries
              </p>
              <a
                href="https://www.google.com/maps/search/Yakkala,+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className="up-btn-primary"
                style={{ marginTop: '0.5rem' }}
              >
                View on Map
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', position: 'relative', zIndex: 2 }}>
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="up-card"
            style={{
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.05) 50%, rgba(6,182,212,0.04) 100%)',
              borderColor: 'rgba(139,92,246,0.25)',
            }}
          >
            {/* Glow accent */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: '60%',
              height: '60%',
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
              borderRadius: '50%',
            }} />

            <h2
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                marginBottom: '1rem',
                position: 'relative',
              }}
            >
              Ready to Bring Your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 400,
              }}>
                Ideas to Life?
              </span>
            </h2>

            <p style={{
              color: '#94A3B8',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '1rem',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '0 auto 2rem',
              position: 'relative',
            }}>
              Join hundreds of satisfied customers who have transformed their visions into
              precision-crafted reality with PrintLabs LK.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link
                to="/instant-price"
                id="cta-price-btn"
                className="up-btn-primary"
                style={{ padding: '0.85rem 2.2rem', fontSize: '0.95rem' }}
              >
                Get Instant Price Quote <FiArrowRight size={16} />
              </Link>
              <Link
                to="/store"
                id="cta-store-btn"
                className="up-btn-secondary"
                style={{ padding: '0.85rem 2.2rem', fontSize: '0.95rem' }}
              >
                Browse Store
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
