import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { generateOrderId, formatCurrency } from '../utils/priceCalculator';
import { Order, ShippingDetails } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // New States for Downloads and grouping after clearing cart
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [downloadedStls, setDownloadedStls] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('downloaded_stl_items') || '{}');
    setDownloadedStls(saved);
  }, []);

  const hasSTLItem = items.some(item => item.type === 'STL');

  useEffect(() => {
    if (hasSTLItem && paymentMethod === 'cod') {
      setPaymentMethod('card');
    }
  }, [items, paymentMethod, hasSTLItem]);

  if (items.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center card-glow p-12">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    if (e.target.name === 'cardNumber') {
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }
    setCardData({
      ...cardData,
      [e.target.name]: value,
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      const newOrderId = generateOrderId();
      
      const orderData = {
        id: newOrderId,
        userId: user.id,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          type: item.type,
          fileSize: item.fileSize,
          height: item.height
        })),
        total: totalPrice,
        status: 'Pending',
        shippingDetails,
        paymentMethod
      };

      // POST to backend MongoDB database
      try {
        await axios.post(`${API_URL}/orders`, orderData);
      } catch (err: any) {
        console.warn('Backend server offline. Saving order to local storage.');
        const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        localOrders.push(orderData);
        localStorage.setItem('mockOrders', JSON.stringify(localOrders));
      }
      
      setOrderNumber(newOrderId);
      setPurchasedItems(items); // Save items before clearing cart!
      clearCart();
      setStep(4);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const stepTitles = ['Cart Review', 'Shipping Details', 'Payment', 'Confirmation'];
  const progressPercentage = (step / 4) * 100;

  return (
    <div className="min-h-screen py-12">
      <div className="section-container max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {stepTitles.map((title, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center ${index + 1 <= step ? 'opacity-100' : 'opacity-50'}`}
                animate={{ scale: index + 1 === step ? 1.1 : 1 }}
              >
                <div
                  className={`w-10 h-10 rounded-full font-bold flex items-center justify-center mb-2 transition-all ${
                    index + 1 < step
                      ? 'bg-green-500 text-white'
                      : index + 1 === step
                        ? 'bg-cosmic-blue text-cosmic-dark'
                        : 'bg-cosmic-darker border-2 border-cosmic-blue border-opacity-50'
                  }`}
                >
                  {index + 1 < step ? '✓' : index + 1}
                </div>
                <span className="text-xs text-center">{title}</span>
              </motion.div>
            ))}
          </div>
          <div className="h-1 bg-cosmic-darker rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cosmic-blue to-cosmic-violet"
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Steps */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {/* Step 1: Cart Review */}
          {step === 1 && (
            <div className="card-glow p-8 space-y-6">
              <h2 className="font-orbitron font-bold text-2xl mb-6 gradient-text">
                Order Review
              </h2>

              <div className="space-y-6 max-h-[30rem] overflow-y-auto pr-2">
                {/* STL Files Section */}
                {items.filter(item => item.type === 'STL').length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider text-cosmic-blue font-semibold border-b border-cosmic-blue border-opacity-20 pb-1">
                      Digital STL Files (1-Time Download)
                    </h3>
                    {items.filter(item => item.type === 'STL').map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-cosmic-darker bg-opacity-50 rounded-lg items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{item.name}</h4>
                          <p className="text-gray-400 text-xs mt-0.5">License: 1-Time Download</p>
                          <p className="text-cosmic-blue font-bold mt-1 text-sm">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3D Models Section */}
                {items.filter(item => item.type === 'Store').length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider text-cosmic-violet font-semibold border-b border-cosmic-violet border-opacity-20 pb-1">
                      Physical 3D Models (3-Day Delivery)
                    </h3>
                    {items.filter(item => item.type === 'Store').map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-cosmic-darker bg-opacity-50 rounded-lg items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-cosmic-dark font-bold text-xs flex items-center justify-center border border-white border-opacity-10 hover:border-cosmic-violet"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold min-w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-cosmic-dark font-bold text-xs flex items-center justify-center border border-white border-opacity-10 hover:border-cosmic-violet"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-cosmic-violet font-bold mt-1 text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="border-t border-cosmic-blue border-opacity-30 pt-6 space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-cosmic-blue">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full btn-primary"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 2: Shipping Details */}
          {step === 2 && (
            <div className="card-glow p-8 space-y-6">
              <h2 className="font-orbitron font-bold text-2xl mb-6 gradient-text">
                Shipping Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={shippingDetails.name}
                  onChange={handleShippingChange}
                  className="md:col-span-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={shippingDetails.email}
                  onChange={handleShippingChange}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={shippingDetails.phone}
                  onChange={handleShippingChange}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={shippingDetails.address}
                  onChange={handleShippingChange}
                  className="md:col-span-2"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingDetails.city}
                  onChange={handleShippingChange}
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={shippingDetails.postalCode}
                  onChange={handleShippingChange}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 btn-ghost"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 btn-primary"
                  disabled={
                    !shippingDetails.name ||
                    !shippingDetails.email ||
                    !shippingDetails.phone ||
                    !shippingDetails.address ||
                    !shippingDetails.city
                  }
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="card-glow p-8 space-y-6">
              <h2 className="font-orbitron font-bold text-2xl mb-6 gradient-text">
                Payment Method
              </h2>

              {/* Payment Options */}
              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all" 
                  style={{ borderColor: paymentMethod === 'card' ? '#00D4FF' : 'transparent', backgroundColor: paymentMethod === 'card' ? 'rgba(0, 212, 255, 0.1)' : 'transparent' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'cod')}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-bold">Credit / Debit Card</p>
                    <p className="text-sm text-gray-400">Secure payment via card</p>
                  </div>
                </label>

                {!hasSTLItem && (
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                    style={{ borderColor: paymentMethod === 'cod' ? '#00D4FF' : 'transparent', backgroundColor: paymentMethod === 'cod' ? 'rgba(0, 212, 255, 0.1)' : 'transparent' }}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'cod')}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-bold">Cash on Delivery</p>
                      <p className="text-sm text-gray-400">Pay when you receive your order</p>
                    </div>
                  </label>
                )}
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-6 border-t border-cosmic-blue border-opacity-30">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    maxLength={19}
                  />
                  <input
                    type="text"
                    name="cardholderName"
                    placeholder="Cardholder Name"
                    value={cardData.cardholderName}
                    onChange={handleCardChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={handleCardChange}
                      maxLength={5}
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      maxLength={3}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 btn-ghost"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || paymentMethod === 'card' && !cardData.cardNumber}
                  className="flex-1 btn-primary"
                >
                  {isProcessing ? 'Processing...' : `Place Order - ${formatCurrency(totalPrice)}`}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="card-glow p-12 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="text-6xl mb-4 text-green-500"
              >
                ✓
              </motion.div>

              <h2 className="font-orbitron font-bold text-3xl gradient-text">
                Order Confirmed!
              </h2>

              <div className="bg-cosmic-darker bg-opacity-50 p-6 rounded-lg space-y-2">
                <p className="text-gray-400">Your Order Number:</p>
                <p className="font-bold text-2xl text-cosmic-blue">{orderNumber}</p>
              </div>

              {/* STL Files Section */}
              {purchasedItems.some(item => item.type === 'STL') && (
                <div className="bg-cosmic-darker bg-opacity-30 p-6 rounded-lg border border-cosmic-blue border-opacity-20 text-left space-y-4">
                  <h3 className="font-orbitron font-bold text-lg text-cosmic-blue flex items-center gap-2">
                    📥 Download STL Files (1-Time Access)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Your payment was successful. You can download each digital STL file exactly **one time** as requested.
                  </p>
                  <div className="space-y-3">
                    {purchasedItems.filter(item => item.type === 'STL').map((item) => {
                      const dlKey = `${orderNumber}-${item.productId}`;
                      const isDownloaded = downloadedStls[dlKey] || false;
                      
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-cosmic-dark rounded border border-white border-opacity-5">
                          <div className="min-w-0 flex-1 pr-4">
                            <p className="text-sm font-bold truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Size: {item.fileSize || 'N/A'}</p>
                          </div>
                          <button
                            onClick={() => {
                              // Trigger download
                              const mockStlContent = `solid PrintLabsLK_${item.name.replace(/\s+/g, '_')}\n  facet normal 0 0 0\n    outer loop\n      vertex 0 0 0\n      vertex 1 0 0\n      vertex 0 1 0\n    endloop\n  endfacet\nendsolid`;
                              const blob = new Blob([mockStlContent], { type: 'model/stl' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${item.name.toLowerCase().replace(/\s+/g, '_')}_design.stl`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);

                              // Update download count
                              const updated = { ...downloadedStls, [dlKey]: true };
                              setDownloadedStls(updated);
                              localStorage.setItem('downloaded_stl_items', JSON.stringify(updated));
                            }}
                            disabled={isDownloaded}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                              isDownloaded
                                ? 'bg-gray-800 text-gray-500 border border-transparent cursor-not-allowed'
                                : 'bg-cosmic-blue text-cosmic-dark hover:shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                            }`}
                          >
                            {isDownloaded ? 'Downloaded (0 remaining)' : 'Download (1 remaining)'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Physical 3D Models Section */}
              {purchasedItems.some(item => item.type === 'Store') && (
                <div className="bg-cosmic-darker bg-opacity-30 p-6 rounded-lg border border-cosmic-violet border-opacity-20 text-left space-y-3">
                  <h3 className="font-orbitron font-bold text-lg text-cosmic-violet flex items-center gap-2">
                    📦 Physical 3D Models Shipping
                  </h3>
                  <p className="text-sm text-gray-300">
                    We will manufacture and deliver your 3D models within **3 Days**.
                  </p>
                  <div className="p-3 bg-cosmic-dark rounded border border-white border-opacity-5 flex justify-between items-center text-xs">
                    <span className="text-gray-400">Estimated Delivery:</span>
                    <span className="font-bold text-cosmic-violet">
                      {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-gray-400">
                We'll send a confirmation email to <strong>{shippingDetails.email}</strong> with your tracking information.
              </p>

              <div className="pt-6 border-t border-cosmic-blue border-opacity-30">
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
