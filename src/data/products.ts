import { STLProduct, StoreProduct } from '../types';

export const stlProducts: STLProduct[] = [
  {
    id: 'stl-001',
    name: 'Phone Holder Design for Bicycle - iPhone 12 Pro Max',
    type: 'STL',
    fileSize: '128MB',
    price: 3500,
    image: '/images/phone_holder_stl.jpg',
    available: true,
    description:
      'Precision-designed STL file for a bicycle phone mount, perfectly fitted for iPhone 12 Pro Max. Ready for FDM printing. Includes mounting hardware specifications.',
  },
  {
    id: 'stl-002',
    name: 'Crown (STL)',
    type: 'STL',
    fileSize: '200MB',
    price: 700,
    image: '/images/crown_stl.jpg',
    available: true,
    description:
      'Ornate royal crown 3D model STL file. Highly detailed, suitable for resin or FDM printing. Multi-part model for easy assembly.',
  },
  {
    id: 'stl-003',
    name: 'Lion in Sri Lankan Flag 3D',
    type: 'STL',
    fileSize: '167MB',
    price: 3800,
    image: '/images/lion_stl.jpg',
    available: true,
    description:
      'Detailed 3D representation of the Lion from the Sri Lankan National Flag. Perfect for cultural display prints. Represents national pride and heritage.',
  },
];

export const storeProducts: StoreProduct[] = [
  {
    id: 'store-001',
    name: 'Lion Face Bas Relief',
    height: '6 inch',
    price: 800,
    image: '/images/lion_face_print.jpg',
    available: true,
    description:
      "Stunning bas relief of a lion's face. Hand-finish quality print. Perfect for wall decor. Professionally finished and ready to mount.",
  },
  {
    id: 'store-002',
    name: 'Lion in Sri Lankan Flag',
    height: '5 inch',
    price: 1000,
    image: '/images/lion_srilankan_print.jpg',
    available: true,
    description:
      '3D printed Sri Lankan flag lion figurine. Patriotic decor piece, beautifully detailed. Perfect for office or home display.',
  },
  {
    id: 'store-003',
    name: 'Luminous Whale (Glowing in the Dark)',
    height: '6cm height model with base',
    price: 3800,
    image: '/images/luminous_whale.jpg',
    available: true,
    description:
      'Magical glow-in-the-dark whale figurine with display base. Uses photoluminescent filament. Glows for hours after light exposure. Unique and magical decorative piece.',
    badge: 'Special Edition',
  },
];

export const allProducts = [...stlProducts, ...storeProducts];

export function getProductById(id: string) {
  return allProducts.find((product) => product.id === id);
}

export function getSTLProductById(id: string) {
  return stlProducts.find((product) => product.id === id);
}

export function getStoreProductById(id: string) {
  return storeProducts.find((product) => product.id === id);
}
