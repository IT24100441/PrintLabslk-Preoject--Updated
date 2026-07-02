import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-9xl font-bold mb-6 gradient-text"
        >
          404
        </motion.div>

        <h1 className="font-orbitron font-bold text-4xl mb-4">Page Not Found</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have drifted into the cosmic void.
        </p>

        <div className="text-5xl mb-8">🌌</div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
          <Link to="/stl-files" className="btn-secondary">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
