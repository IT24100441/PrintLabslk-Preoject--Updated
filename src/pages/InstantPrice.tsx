import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload } from 'react-icons/fi';
import { calculatePrice, formatCurrency, formatFileSize } from '../utils/priceCalculator';
import { useCart } from '../context/CartContext';

const InstantPrice: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.name.endsWith('.stl')) {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Please select a valid .stl file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const calculatePriceClick = () => {
    if (!file) return;

    setLoading(true);
    // Simulate calculation
    setTimeout(() => {
      const priceResult = calculatePrice(file.size);
      setResult({
        file,
        ...priceResult,
      });
      setLoading(false);
    }, 1000);
  };

  const handleOrderPrint = () => {
    if (!result) return;

    addItem({
      productId: 'custom-' + Date.now(),
      name: `Custom 3D Print - ${result.file.name}`,
      price: result.estimatedCost,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=500&fit=crop',
      type: 'Custom',
    });

    alert('Added to cart! Proceed to checkout.');
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 border-b border-cosmic-blue border-opacity-30">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-orbitron font-bold text-5xl mb-4 gradient-text">
              Instant 3D Price Calculator
            </h1>
            <p className="text-xl text-gray-400">
              Upload your STL file and get an instant price estimate. No waiting. No forms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload Zone */}
      <section className="py-20 section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {/* Upload Area */}
          <motion.div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="card-glow p-12 text-center border-2 border-dashed border-cosmic-blue border-opacity-50 hover:border-opacity-100 cursor-pointer transition-all"
            whileHover={{ borderColor: '#00D4FF' }}
          >
            {!file ? (
              <>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  📦
                </motion.div>
                <h3 className="font-bold text-2xl mb-2">Drop your STL file here</h3>
                <p className="text-gray-400 mb-4">or click to select a file</p>
                <input
                  type="file"
                  accept=".stl"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="btn-primary inline-block cursor-pointer">
                  <FiUpload className="inline mr-2" /> Select File
                </label>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">✓</div>
                <p className="font-bold text-lg mb-2">{file.name}</p>
                <p className="text-gray-400 mb-6">{formatFileSize(file.size)}</p>
                <button
                  onClick={calculatePriceClick}
                  disabled={loading}
                  className="btn-primary animate-glow-pulse"
                >
                  {loading ? 'Calculating...' : 'Calculate Price'}
                </button>
              </>
            )}
          </motion.div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <h2 className="font-orbitron font-bold text-3xl mb-8 text-center gradient-text">
                Price Estimate
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Estimated Price */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0 }}
                  className="card-glow p-6 text-center"
                >
                  <p className="text-gray-400 text-sm mb-2">Estimated Price</p>
                  <p className="text-4xl font-bold text-cosmic-blue">
                    {formatCurrency(result.estimatedCost)}
                  </p>
                </motion.div>

                {/* Print Time */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="card-glow p-6 text-center"
                >
                  <p className="text-gray-400 text-sm mb-2">Est. Print Time</p>
                  <p className="text-4xl font-bold text-cosmic-violet">{result.printTime} hrs</p>
                </motion.div>

                {/* Material Weight */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="card-glow p-6 text-center"
                >
                  <p className="text-gray-400 text-sm mb-2">Material Weight</p>
                  <p className="text-4xl font-bold text-cosmic-gold">~{result.materialWeight}g</p>
                </motion.div>

                {/* Complexity */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="card-glow p-6 text-center"
                >
                  <p className="text-gray-400 text-sm mb-2">Complexity</p>
                  <p className="text-4xl font-bold text-cosmic-blue">{result.complexity}</p>
                </motion.div>
              </div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="card-glow p-6 mb-8 text-center text-sm text-gray-400"
              >
                ⚠️ This is an estimate. Final price may vary based on material choice and print settings.
              </motion.div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <motion.button
                  onClick={handleOrderPrint}
                  whileHover={{ scale: 1.05 }}
                  className="btn-primary px-8 py-3"
                >
                  Order This Print
                </motion.button>
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  className="btn-secondary px-8 py-3"
                >
                  Reset
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Materials Section */}
      <section className="py-20 border-t border-cosmic-blue border-opacity-30 section-container">
        <h2 className="font-orbitron font-bold text-3xl text-center mb-12 gradient-text">
          Available Materials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'PLA',
              icon: '🟢',
              desc: 'Standard, biodegradable, great for beginners',
            },
            {
              name: 'PETG',
              icon: '🔵',
              desc: 'Durable, flexible, good strength',
            },
            {
              name: 'Resin',
              icon: '🟠',
              desc: 'High detail, smooth finish, premium option',
            },
          ].map((material) => (
            <motion.div
              key={material.name}
              className="card-glow p-8 text-center"
              whileHover={{ y: -5 }}
            >
              <div className="text-5xl mb-4">{material.icon}</div>
              <h3 className="font-bold text-xl mb-2 text-cosmic-blue">{material.name}</h3>
              <p className="text-gray-400 text-sm">{material.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default InstantPrice;
