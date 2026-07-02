# PrintLabs LK - 3D Design & Printing Website

A modern, production-ready React website for PrintLabs LK, featuring STL file marketplace, 3D item store, instant price calculator, and coming-soon Photo to STL service.

## 🚀 Features

### Core Features
- ✨ **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🎨 **Cosmic Theme** - Dark theme with neon blue, violet, and gold accents
- 🛒 **E-Commerce** - Product listing, cart, wishlist, and checkout
- 👤 **User Authentication** - Login/Register with persistent state
- 💳 **Payment Options** - Card and Cash on Delivery payment methods
- 🔧 **Admin Panel** - Dashboard, order management, customer management, product management
- ⚡ **Animations** - Smooth Framer Motion animations throughout
- 🎯 **Instant Price Calculator** - Upload STL files and get instant pricing
- 🔄 **Coming Soon** - Photo to STL service with countdown timer

### Technical Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js (ready for integration)
- **Routing**: React Router v6
- **State Management**: Context API
- **Build Tool**: Vite
- **Icons**: React Icons

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd printlabs-lk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional dependencies** (if needed)
   ```bash
   npm install react react-dom react-router-dom framer-motion three @react-three/fiber @react-three/drei tailwindcss postcss autoprefixer axios react-hook-form react-icons recharts
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Website Structure

### Pages

#### Public Pages
- **`/`** - Homepage with hero section, services, featured products
- **`/stl-files`** - Browse and filter STL files
- **`/stl-files/:id`** - STL file detail page
- **`/store`** - Browse 3D printed items
- **`/store/:id`** - Store item detail page
- **`/instant-price`** - Upload STL file for instant pricing
- **`/photo-to-stl`** - Coming soon page with countdown timer
- **`/login`** - User login page
- **`/register`** - User registration page
- **`/checkout`** - Multi-step checkout process
- **`/profile`** - User profile management
- **`/*`** - 404 Not Found page

#### Admin Pages (Protected)
- **`/admin`** - Admin dashboard with stats and recent orders
- **`/admin/orders`** - Manage all orders
- **`/admin/customers`** - Manage customers
- **`/admin/products`** - Manage products

### Components

#### Layout
- **Navbar** - Navigation with cart, wishlist, user menu
- **Footer** - Company info, links, social media
- **ParticleBackground** - Animated particle system background
- **CustomCursor** - Custom cursor animation

#### Reusable Components
- **ProductCard** - Display product with hover animations
- **CartDrawer** - Slide-out shopping cart
- **WishlistDrawer** - Slide-out wishlist

### Context & State

#### Providers
- **AuthContext** - User authentication and profile
- **CartContext** - Shopping cart management
- **WishlistContext** - Wishlist management

### Data Structure

All product data is stored in `/src/data/products.ts` and includes:
- STL Files (3D models for download/printing)
- Store Products (Ready-to-print 3D items)
- Product filtering and searching

## 🎨 Design System

### Color Palette
- **Primary**: #00D4FF (Cosmic Blue)
- **Secondary**: #7B2FFF (Cosmic Violet)
- **Accent**: #FFB800 (Cosmic Gold)
- **Dark**: #050A14 (Cosmic Dark)
- **Darker**: #0A0F1E (Cosmic Darker)

### Typography
- **Headings**: Orbitron (font-family: 'Orbitron')
- **Body**: Inter (font-family: 'Inter')
- **Mono**: Rajdhani (font-family: 'Rajdhani')

### Components Classes
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button with border
- `.btn-ghost` - Transparent button
- `.card-glow` - Card with glow effect
- `.gradient-text` - Gradient colored text
- `.neon-glow` - Neon text effect

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

## 🔐 Authentication

### Demo Credentials
- Email: `user@demo.com`
- Password: `demo123`

### Auth Flow
1. User registers or logs in
2. Account stored in localStorage
3. Context maintains global auth state
4. Protected routes require authentication
5. Admin routes require admin role

## 🛒 E-Commerce Features

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent storage in localStorage
- Real-time totals

### Wishlist
- Add/remove items
- Persistent storage in localStorage
- Move items to cart

### Checkout Process
1. **Step 1**: Review cart items
2. **Step 2**: Enter shipping details
3. **Step 3**: Select payment method (Card/COD)
4. **Step 4**: Order confirmation with order number

## 💰 Pricing System

### Instant Price Calculator
- Upload STL files
- Automatic price calculation based on file size
- Estimates for:
  - Estimated cost
  - Print time
  - Material weight
  - Complexity level

### Pricing Formula
- Base cost: Rs. 150
- Per MB cost: Rs. 12
- Material weight: ~5g per MB

## 📊 Admin Dashboard

### Dashboard
- Key metrics (Total Orders, Customers, Revenue, Pending)
- Recent orders table
- Quick navigation to admin pages

### Order Management
- View all orders
- Update order status
- Track customer orders

### Customer Management
- View all customers
- Customer details
- Order history per customer

### Product Management
- Add new products
- Edit existing products
- Delete products
- Manage inventory status

## 🔧 Utilities

### Helper Functions (`/src/utils/priceCalculator.ts`)
- `calculatePrice()` - Calculate 3D print pricing
- `formatCurrency()` - Format numbers as LKR currency
- `formatFileSize()` - Human-readable file sizes
- `isValidEmail()` - Email validation
- `isValidPhone()` - Phone number validation
- `generateOrderId()` - Create unique order IDs
- `formatDate()` - Format timestamps
- `getInitials()` - Extract initials from names
- `getTimeUntil()` - Calculate countdown timers

### Custom Hooks (`/src/hooks/`)
- `useIntersectionObserver()` - Scroll animations
- `useRequireAuth()` - Protect routes
- `useRequireAdmin()` - Admin-only routes
- `useLocalStorage()` - Persist state
- `useAsync()` - Handle async operations
- `useDebounce()` - Debounce values

## 🎬 Animations

### Framer Motion
- Page transitions
- Hover effects
- Scroll animations
- Loading states
- Count-up animations
- Particle animations

### CSS Animations
- Glow pulse effect
- Float animations
- Shimmer effects
- Smooth scrolling

## 📦 Build & Deployment

### Build Output
```bash
npm run build
# Output: dist/
```

### Deployment Ready
- Optimized bundle size
- Code splitting
- Asset optimization
- Production build

### Deployment Platforms
- Vercel (Recommended for Vite)
- Netlify
- AWS S3 + CloudFront
- Docker container

## 🐛 Known Issues & Improvements

### Current Limitations
- Mock authentication (no real backend)
- Products data hardcoded
- Payment processing is simulated
- No actual file upload for prices
- Photo to STL is coming soon

### Future Enhancements
1. **Backend Integration**
   - Real authentication with JWT
   - Database for products/orders
   - Payment gateway integration

2. **Features**
   - Implement Photo to STL with AI
   - Order tracking with real-time updates
   - Email notifications
   - User reviews and ratings
   - Advanced search with filters

3. **Performance**
   - Server-side rendering (Next.js migration)
   - Image optimization
   - CDN integration
   - Database caching

## 📞 Contact & Support

- **Location**: Yakkala, Sri Lanka
- **Phone**: 072 287 6497
- **Email**: info@printlabs.lk
- **Website**: https://printlabs.lk

## 📄 License

This project is proprietary and confidential.

## 👨‍💻 Development

### Project Structure
```
src/
├── components/        # Reusable components
├── context/          # Context providers
├── data/             # Static data
├── hooks/            # Custom hooks
├── pages/            # Page components
│   └── admin/        # Admin pages
├── types/            # TypeScript types
├── utils/            # Utility functions
├── App.tsx           # Main app component
├── index.css         # Global styles
└── main.tsx          # Entry point
```

### Code Standards
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- Component composition
- Proper error handling

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push and create PR
git push origin feature/feature-name
```

## 🚀 Getting Started Guide

1. **First Time Setup**
   - Clone repository
   - Run `npm install`
   - Run `npm run dev`
   - Open http://localhost:5173

2. **Exploring the App**
   - Browse STL files and store
   - Add items to cart
   - Try checkout (no payment required)
   - Login with demo credentials
   - Visit admin dashboard

3. **Development**
   - Edit files in `/src`
   - Hot reload is automatic
   - Check console for errors
   - Use TypeScript for new code

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com)

---

**Made with ❤️ for PrintLabs LK**
