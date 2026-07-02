/* User & Auth Types */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  birthday?: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

/* Product Types */
export interface STLProduct {
  id: string;
  name: string;
  type: 'STL';
  fileSize: string;
  price: number;
  image: string;
  available: boolean;
  description: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  height: string;
  price: number;
  image: string;
  available: boolean;
  description: string;
  badge?: string;
}

export type Product = STLProduct | StoreProduct;

/* Cart Types */
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: 'STL' | 'Store' | 'Custom';
  fileSize?: string;
  height?: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

/* Wishlist Types */
export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  type: 'STL' | 'Store';
  addedAt: number;
}

export interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (itemId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

/* Order Types */
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: number;
  updatedAt: number;
  shippingDetails: ShippingDetails;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

/* Price Calculator Types */
export interface PriceResult {
  estimatedCost: number;
  printTime: number;
  materialWeight: number;
  complexity: 'Low' | 'Medium' | 'High';
}

/* Notification Types */
export interface Notification {
  id: string;
  email: string;
  type: 'photo-to-stl' | 'product-alert' | 'price-drop';
  createdAt: number;
  notified?: boolean;
}

/* Table Data Types */
export interface OrderTableData {
  id: string;
  customerId: string;
  customerName: string;
  items: number;
  total: number;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface CustomerTableData {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  joinedDate: string;
  ordersCount: number;
}
