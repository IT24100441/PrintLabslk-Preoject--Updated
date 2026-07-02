import { PriceResult } from '../types';

/**
 * Calculates 3D print price based on file size
 * This is a frontend simulation. Replace with real API call for production.
 */
export function calculatePrice(fileSizeBytes: number): PriceResult {
  const sizeMB = fileSizeBytes / (1024 * 1024);

  const baseCost = 150; // Rs.
  const perMBCost = 12; // Rs. per MB
  const materialCost = Math.round(sizeMB * perMBCost);
  const printTime = Math.ceil(sizeMB * 0.8); // hours estimate
  const materialWeight = Math.ceil(sizeMB * 5); // grams estimate

  // Determine complexity
  let complexity: 'Low' | 'Medium' | 'High';
  if (sizeMB > 100) {
    complexity = 'High';
  } else if (sizeMB > 50) {
    complexity = 'Medium';
  } else {
    complexity = 'Low';
  }

  const total = baseCost + materialCost;

  return {
    estimatedCost: total,
    printTime,
    materialWeight,
    complexity,
  };
}

/**
 * Formats number as currency (LKR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number (basic validation for LK format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^([0-9]{10}|[0-9]{3}\s[0-9]{7})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Generates a random order ID
 */
export function generateOrderId(): string {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

/**
 * Formats date to readable format
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats date with time
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Delays execution (for simulating API calls)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gets initials from a name for avatar
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Calculates time until a given date
 */
export function getTimeUntil(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
