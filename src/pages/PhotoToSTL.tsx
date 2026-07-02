import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTimeUntil } from '../utils/priceCalculator';

const PhotoToSTL: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [countdown, setCountdown] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 });

  // Set target date to 30 days from now
  const targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      const time = getTimeUntil(targetDate);
      setCountdown(time);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(123, 47, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Floating orbs */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-40 h-40 rounded-full border border-cosmic-blue border-opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            delay: i * 3,
          }}
          style={{
            top: `${20 + i * 20}%`,
            left: `${10 + i * 25}%`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="section-container z-10 text-center max-w-3xl">
        {/* Icon Animation */}
        <motion.div
          className="mb-8"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <motion.div
            className="inline-block text-7xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            📷
          </motion.div>
          <motion.div
            className="inline-block text-5xl mx-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            ↓
          </motion.div>
          <motion.div
            className="inline-block text-7xl"
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            🎲
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-orbitron font-black text-5xl md:text-6xl mb-4 gradient-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Photo to STL
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Turn any photo into a 3D-printable model in moments.
        </motion.p>

        {/* Coming Soon Badge */}
        <motion.div
          className="inline-block mb-12"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 212, 255, 0.5)',
              '0 0 40px rgba(123, 47, 255, 0.8)',
              '0 0 20px rgba(0, 212, 255, 0.5)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="px-8 py-4 border-2 border-cosmic-blue rounded-full font-orbitron font-bold text-2xl neon-glow">
            COMING SOON
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Upload a photo of your pet, a person, or any object — and our AI will generate a fully printable STL file automatically. This revolutionary feature is currently in development.
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-gray-400 mb-4 font-bold">Launching In:</p>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Minutes', value: countdown.minutes },
              { label: 'Seconds', value: countdown.seconds },
            ].map((item) => (
              <motion.div
                key={item.label}
                className="card-glow p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-cosmic-blue mb-2">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Email Notification */}
        <motion.form
          onSubmit={handleNotify}
          className="max-w-md mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <motion.button
              type="submit"
              className="btn-primary px-6 py-2 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Notify Me
            </motion.button>
          </div>
        </motion.form>

        {/* Feedback */}
        {isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 p-4 rounded-lg max-w-md mx-auto"
          >
            ✓ Thank you! We'll notify you when Photo to STL launches.
          </motion.div>
        )}

        {/* Key Features */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            {
              icon: '🤖',
              title: 'AI-Powered',
              desc: 'Advanced machine learning algorithms',
            },
            {
              icon: '⚡',
              title: 'Instant',
              desc: 'Generate STL files in seconds',
            },
            {
              icon: '🎯',
              title: 'Accurate',
              desc: 'Professional-grade 3D models',
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              className="card-glow p-6"
              whileHover={{ y: -10 }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-cosmic-blue">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Teaser Image */}
        <motion.div
          className="mt-16 card-glow p-8"
          whileHover={{ boxShadow: '0 0 50px rgba(0, 212, 255, 0.4)' }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-400">Experience the future of 3D modeling with Photo to STL</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PhotoToSTL;
