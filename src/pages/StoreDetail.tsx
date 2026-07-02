import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { formatCurrency } from '../utils/priceCalculator';
import axios from 'axios';
import { storeProducts, getStoreProductById } from '../data/products';

const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { addItem: addWishlistItem, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = React.useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const allProds = res.data;
        const current = allProds && allProds.length > 0 ? allProds.find((p: any) => p.id === id) : null;
        if (current) {
          setProduct(current);
          setRelatedProducts(allProds.filter((p: any) => p.type === 'Store' && p.id !== id).slice(0, 3));
        } else {
          console.warn('Product not found in DB. Trying local fallback.');
          const local = getStoreProductById(id!);
          if (local) {
            setProduct(local);
            setRelatedProducts(storeProducts.filter((p: any) => p.id !== id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Failed to load product details from DB. Trying local fallback.', err);
        const local = getStoreProductById(id!);
        if (local) {
          setProduct(local);
          setRelatedProducts(storeProducts.filter((p: any) => p.id !== id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const isFav = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: 'cart-' + Date.now() + '-' + Math.random(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      type: 'Store',
      height: product.height,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddWishlist = () => {
    if (!product) return;
    addWishlistItem({
      id: 'wish-' + Date.now() + '-' + Math.random(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: 'Store',
      addedAt: Date.now(),
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 45, height: 45 }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-gray-400 text-lg mb-6">Product not found</p>
          <Link to="/store" className="btn-primary">
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="py-4 border-b border-cosmic-blue border-opacity-30">
        <div className="section-container flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-400 hover:text-cosmic-blue">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/store" className="text-gray-400 hover:text-cosmic-blue">
            Store
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-cosmic-blue font-bold truncate">{product.name}</span>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 section-container">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cosmic-blue hover:text-cosmic-gold transition mb-8"
          whileHover={{ x: -5 }}
        >
          <FiArrowLeft /> Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-glow p-8 flex items-center justify-center min-h-96"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-orbitron font-bold text-4xl mb-4 gradient-text">
              {product.name}
            </h1>

            {product.badge && (
              <div className="inline-block badge mb-4">
                {product.badge}
              </div>
            )}

            <div className="space-y-6 mb-8">
              {/* Price */}
              <div className="card-glow p-6">
                <p className="text-gray-400 text-sm mb-2">Price</p>
                <p className="text-4xl font-bold text-cosmic-blue">
                  {formatCurrency(product.price)}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card-glow p-6">
                  <p className="text-gray-400 text-sm mb-2">Height</p>
                  <p className="text-xl font-bold text-cosmic-blue">{product.height}</p>
                </div>
                <div className="card-glow p-6">
                  <p className="text-gray-400 text-sm mb-2">Status</p>
                  <p className={`text-xl font-bold ${product.available ? 'text-green-400' : 'text-red-400'}`}>
                    {product.available ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="card-glow p-6">
                <p className="text-gray-400 text-sm mb-3">Description</p>
                <p className="text-gray-300">{product.description}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiShoppingCart /> Add to Cart
                </motion.button>
                <motion.button
                  onClick={handleAddWishlist}
                  className={`px-6 py-3 font-bold rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                    isFav
                      ? 'border-cosmic-gold bg-cosmic-gold bg-opacity-20 text-cosmic-gold'
                      : 'border-cosmic-blue text-cosmic-blue hover:border-cosmic-gold hover:text-cosmic-gold'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiHeart fill={isFav ? 'currentColor' : 'none'} /> Wishlist
                </motion.button>
              </div>

              {/* Feedback */}
              {isAdded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 p-4 rounded-lg"
                >
                  ✓ Added to cart successfully!
                </motion.div>
              )}
            </div>

            {/* Additional Info */}
            <div className="card-glow p-6">
              <h3 className="font-bold text-lg mb-4 text-cosmic-blue">Product Information</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>✓ High-quality 3D print</li>
                <li>✓ Professional finish</li>
                <li>✓ Ready to display</li>
                <li>✓ Perfect for gifting</li>
                <li>✓ Unique design</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 border-t border-cosmic-blue border-opacity-30 section-container">
          <h2 className="font-orbitron font-bold text-3xl mb-8 gradient-text">
            Related Items
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <ProductCard
                  product={relatedProduct}
                  detailLink={`/store/${relatedProduct.id}`}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default StoreDetail;
