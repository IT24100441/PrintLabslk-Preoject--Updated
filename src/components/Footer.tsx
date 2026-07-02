import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Home',          href: '/' },
    { label: 'STL Files',     href: '/stl-files' },
    { label: '3D Store',      href: '/store' },
    { label: 'Instant Price', href: '/instant-price' },
    { label: 'Photo to STL',  href: '/photo-to-stl' },
  ];

  const socialLinks = [
    { icon: FaFacebook,  href: 'https://facebook.com',  label: 'Facebook' },
    { icon: FaTwitter,   href: 'https://twitter.com',   label: 'Twitter' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaLinkedin,  href: 'https://linkedin.com',  label: 'LinkedIn' },
  ];

  return (
    <footer style={{
      position: 'relative',
      background: '#0D0E12',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      zIndex: 2,
    }}>
      {/* Top gradient line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, #8B5CF6 30%, #6366F1 60%, transparent 100%)',
        opacity: 0.6,
      }} />

      <div className="section-container" style={{ paddingTop: '4rem', paddingBottom: '2.5rem' }}>
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10" style={{ marginBottom: '3rem' }}>

          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'block', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <img
                src="/images/logo_text.jpg"
                alt="PrintLabs LK"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallbackText = document.getElementById('footer-fallback-text');
                  if (fallbackText) fallbackText.style.display = 'block';
                }}
                style={{
                  height: 38,
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              <span
                id="footer-fallback-text"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '1.35rem',
                  color: '#FFFFFF',
                  letterSpacing: '-0.015em',
                  display: 'none',
                }}
              >
                PrintLabs <span style={{ color: '#8B5CF6', fontWeight: 300 }}>LK</span>
              </span>
            </Link>

            <p style={{
              color: '#64748B',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
            }}>
              Premium 3D design and printing services from Sri Lanka. Design It. Print It. Own It.
            </p>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { icon: FiMapPin, text: 'Yakkala, Sri Lanka', href: undefined },
                { icon: FiPhone,  text: '072 287 6497',       href: 'tel:0722876497' },
                { icon: FiMail,   text: 'info@printlabs.lk', href: 'mailto:info@printlabs.lk' },
              ].map((item) => {
                const Icon = item.icon;
                const content = (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Icon size={14} style={{ color: '#8B5CF6', flexShrink: 0 }} />
                    <span style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '0.825rem',
                      color: '#94A3B8',
                      transition: 'color 0.2s',
                    }}>
                      {item.text}
                    </span>
                  </div>
                );
                return item.href ? (
                  <a key={item.text} href={item.href}
                    style={{ textDecoration: 'none' }}
                    className="hover:text-white group"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.text}>{content}</div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              marginBottom: '1.25rem',
            }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '0.85rem',
                      color: '#64748B',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'color 0.2s',
                    }}
                    className="hover:text-white"
                  >
                    <FiArrowRight size={12} style={{ opacity: 0.5 }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              marginBottom: '1.25rem',
            }}>
              Services
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['3D Modeling', '3D Printing', 'Custom Orders', 'Consulting', 'Photo to STL'].map((s) => (
                <li key={s}>
                  <span style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '0.85rem',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                    className="hover:text-white"
                  >
                    <FiArrowRight size={12} style={{ opacity: 0.5 }} />
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              marginBottom: '1.25rem',
            }}>
              Follow Us
            </h3>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748B',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    className="hover:border-up-violet hover:text-white hover:bg-opacity-10"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>

            {/* Newsletter teaser */}
            <div style={{
              padding: '1rem',
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 12,
            }}>
              <p style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '0.8rem',
                color: '#8B5CF6',
                fontWeight: 600,
                marginBottom: '0.25rem',
              }}>
                Stay Updated
              </p>
              <p style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '0.75rem',
                color: '#64748B',
                lineHeight: 1.5,
              }}>
                New models, offers and printing tips delivered to your inbox.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: '1.75rem' }} />

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}>
          <p style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '0.8rem',
            color: '#4B5563',
          }}>
            © {currentYear} PrintLabs LK. All Rights Reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '0.8rem',
                  color: '#4B5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                className="hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
