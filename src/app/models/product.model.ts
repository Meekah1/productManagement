export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  description: string;
  category?: string;
  tags?: string[];
  lowStockThreshold?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Toys',
];

export const TAGS = [
  'New',
  'On Sale',
  'Popular',
  'Limited Edition',
  'Clearance',
];
