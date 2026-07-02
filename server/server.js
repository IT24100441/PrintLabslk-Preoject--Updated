const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection status check middleware
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is offline. Please make sure MongoDB is running on port 27017 and is accessible.'
    });
  }
  next();
};

// Apply connection check to all API routes
app.use('/api', checkDbConnection);

// MongoDB Connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/Printlabs';
console.log('Connecting to MongoDB at:', MONGO_URI);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // Fast fail if MongoDB is offline
})
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Please make sure your MongoDB service is running on port 27017.');
  });

// ────────────────────────────────────────────────────────────────
// Mongoose Schemas & Models
// ────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  birthday: { type: String, default: '' },
  avatar: { type: String, default: '' }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['STL', 'Store'], required: true },
  fileSize: { type: String }, // For STL
  height: { type: String },   // For Store
  price: { type: Number, required: true },
  image: { type: String, required: true },
  available: { type: Boolean, default: true },
  description: { type: String, default: '' },
  badge: { type: String, default: '' }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
      type: { type: String },
      fileSize: { type: String },
      height: { type: String }
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  shippingDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, default: '' }
  },
  paymentMethod: { type: String, enum: ['card', 'cod'], required: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// ────────────────────────────────────────────────────────────────
// Database Seeding
// ────────────────────────────────────────────────────────────────

async function seedDatabase() {
  try {
    // 1. Seed Users (Admin + Demo User)
    const adminExists = await User.findOne({ email: 'admin@printlabs.lk' });
    if (!adminExists) {
      console.log('Seeding PrintLabs Admin...');
      const adminUser = new User({
        id: 'user-admin',
        name: 'PrintLabs Admin',
        email: 'admin@printlabs.lk',
        password: 'AdminPass123!',
        role: 'admin',
        phone: '072 287 6497',
        address: 'Yakkala',
        birthday: '1990-01-01',
        avatar: ''
      });
      await adminUser.save();
      console.log('Admin user seeded.');
    }

    const demoExists = await User.findOne({ email: 'user@demo.com' });
    if (!demoExists) {
      console.log('Seeding Demo User...');
      const demoUser = new User({
        id: 'user-demo',
        name: 'Demo User',
        email: 'user@demo.com',
        password: 'demo123',
        role: 'user',
        phone: '077 123 4567',
        address: 'Colombo, Sri Lanka',
        birthday: '1995-05-15',
        avatar: ''
      });
      await demoUser.save();
      console.log('Demo user seeded.');
    }

    // 2. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial products...');
      await Product.insertMany([
        {
          id: 'stl-001',
          name: 'Phone Holder Design for Bicycle - iPhone 12 Pro Max',
          type: 'STL',
          fileSize: '128MB',
          price: 3500,
          image: '/images/phone_holder_stl.jpg',
          available: true,
          description: 'Precision-designed STL file for a bicycle phone mount, perfectly fitted for iPhone 12 Pro Max. Ready for FDM printing. Includes mounting hardware specifications.'
        },
        {
          id: 'stl-002',
          name: 'Crown (STL)',
          type: 'STL',
          fileSize: '200MB',
          price: 700,
          image: '/images/crown_stl.jpg',
          available: true,
          description: 'Ornate royal crown 3D model STL file. Highly detailed, suitable for resin or FDM printing. Multi-part model for easy assembly.'
        },
        {
          id: 'stl-003',
          name: 'Lion in Sri Lankan Flag 3D',
          type: 'STL',
          fileSize: '167MB',
          price: 3800,
          image: '/images/lion_stl.jpg',
          available: true,
          description: 'Detailed 3D representation of the Lion from the Sri Lankan National Flag. Perfect for cultural display prints. Represents national pride and heritage.'
        },
        {
          id: 'store-001',
          name: 'Lion Face Bas Relief',
          type: 'Store',
          height: '6 inch',
          price: 800,
          image: '/images/lion_face_print.jpg',
          available: true,
          description: "Stunning bas relief of a lion's face. Hand-finish quality print. Perfect for wall decor. Professionally finished and ready to mount."
        },
        {
          id: 'store-002',
          name: 'Lion in Sri Lankan Flag',
          type: 'Store',
          height: '5 inch',
          price: 1000,
          image: '/images/lion_srilankan_print.jpg',
          available: true,
          description: '3D printed Sri Lankan flag lion figurine. Patriotic decor piece, beautifully detailed. Perfect for office or home display.'
        },
        {
          id: 'store-003',
          name: 'Luminous Whale (Glowing in the Dark)',
          type: 'Store',
          height: '6cm height model with base',
          price: 3800,
          image: '/images/luminous_whale.jpg',
          available: true,
          description: 'Magical glow-in-the-dark whale figurine with display base. Uses photoluminescent filament. Glows for hours after light exposure. Unique and magical decorative piece.',
          badge: 'Special Edition'
        }
      ]);
      console.log('Products seeded.');
    }

    // 3. Seed some mock orders if none exist
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('Seeding mock orders for reports...');
      const mockOrders = [
        {
          id: 'ORD-MOCK-001',
          userId: 'user-demo',
          items: [
            { productId: 'stl-001', name: 'Phone Holder Design for Bicycle - iPhone 12 Pro Max', price: 3500, quantity: 1, type: 'STL', fileSize: '128MB' },
            { productId: 'store-002', name: 'Lion in Sri Lankan Flag', price: 1000, quantity: 2, type: 'Store', height: '5 inch' }
          ],
          total: 5500,
          status: 'Delivered',
          shippingDetails: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '077 123 4567',
            address: '123 Main St',
            city: 'Colombo'
          },
          paymentMethod: 'card',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        },
        {
          id: 'ORD-MOCK-002',
          userId: 'user-demo',
          items: [
            { productId: 'stl-002', name: 'Crown (STL)', price: 700, quantity: 1, type: 'STL', fileSize: '200MB' },
            { productId: 'store-001', name: 'Lion Face Bas Relief', price: 800, quantity: 1, type: 'Store', height: '6 inch' }
          ],
          total: 1500,
          status: 'Delivered',
          shippingDetails: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '072 987 6543',
            address: '456 Galle Rd',
            city: 'Kandy'
          },
          paymentMethod: 'card',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
        },
        {
          id: 'ORD-MOCK-003',
          userId: 'user-demo',
          items: [
            { productId: 'stl-003', name: 'Lion in Sri Lankan Flag 3D', price: 3800, quantity: 1, type: 'STL', fileSize: '167MB' }
          ],
          total: 3800,
          status: 'Processing',
          shippingDetails: {
            name: 'Bob Wilson',
            email: 'bob@example.com',
            phone: '071 555 4321',
            address: '789 Temple Rd',
            city: 'Yakkala'
          },
          paymentMethod: 'card',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }
      ];
      await Order.insertMany(mockOrders);
      console.log('Mock orders seeded.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

// ────────────────────────────────────────────────────────────────
// API Routes
// ────────────────────────────────────────────────────────────────

// ── Auth Endpoints ──

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      birthday: user.birthday,
      avatar: user.avatar
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({
      id: 'user-' + Date.now(),
      name,
      email,
      password,
      role: 'user'
    });

    await newUser.save();
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Update Profile
app.put('/api/auth/profile/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const user = await User.findOneAndUpdate({ id }, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// GET Customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' });
    
    // Map order counts
    const mapped = await Promise.all(customers.map(async (c) => {
      const ordersCount = await Order.countDocuments({ userId: c.id });
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        joined: c.createdAt.toISOString().split('T')[0],
        orders: ordersCount
      };
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// DELETE Customer
app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.findOneAndDelete({ id, role: 'user' });
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // Also delete their orders to keep database clean
    await Order.deleteMany({ userId: id });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


// ── Product Endpoints ──

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// POST create product
app.post('/api/products', async (req, res) => {
  const productData = req.body;
  try {
    const newProduct = new Product({
      id: productData.id || 'prod-' + Date.now(),
      ...productData
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// PUT edit product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const product = await Product.findOneAndUpdate({ id }, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndDelete({ id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


// ── Order Endpoints ──

// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// POST place order
app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  try {
    const newOrder = new Order({
      ...orderData
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// PUT edit order status
app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findOneAndUpdate({ id }, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// DELETE order
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOneAndDelete({ id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


// ── Stats and Reports Endpoints ──

// GET admin dashboard stats
app.get('/api/orders/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: { $in: ['Pending', 'Processing'] } });
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // Calculate total income
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      totalOrders,
      pendingOrders,
      totalCustomers,
      revenue
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// GET monthly reports data
app.get('/api/orders/report', async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });

    // Sell counts per product
    const productSales = {};
    let totalRevenue = 0;

    orders.forEach(order => {
      totalRevenue += order.total;
      order.items.forEach(item => {
        const pId = item.productId;
        if (!productSales[pId]) {
          productSales[pId] = {
            productId: pId,
            name: item.name,
            type: item.type || 'Store',
            quantity: 0,
            revenue: 0
          };
        }
        productSales[pId].quantity += item.quantity;
        productSales[pId].revenue += item.price * item.quantity;
      });
    });

    // Group revenue by month
    const monthlyRevenue = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt || order.updatedAt);
      const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      if (!monthlyRevenue[monthYear]) {
        monthlyRevenue[monthYear] = { month: monthYear, revenue: 0, salesCount: 0 };
      }
      monthlyRevenue[monthYear].revenue += order.total;
      monthlyRevenue[monthYear].salesCount += 1;
    });

    res.json({
      totalIncomes: totalRevenue,
      productSales: Object.values(productSales),
      monthlyRevenue: Object.values(monthlyRevenue)
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


// Serve React frontend (Production bundle path if required)
// Optional, for now just expose API.

app.listen(PORT, () => {
  console.log(`PrintLabs LK Server running on http://localhost:${PORT}`);
});
