export interface Product {
  id?: string;
  category: string;
  description: string;
  price: number;
  title: string;
  minOrder?: number;
  sellerCountry?: string;
  sellerLocation?: string;
  sellerEmail?: string;
  verifiedSeller?: boolean;
  furtherDetails?: string;
  availableQuantity?: number;
  discount?: number;
  promoStartDate?: string;
  promoEndDate?: string;
  images?: string;
}

export interface ProductAndSellerDescription {
  productDetails: string;
  reviews: number;
  transactions: Transactions;
}

export interface Transactions {
  totalQuantities: number;
  totalBuyers: number;
  totalTransactions: number;
}

export type ImagePath = {
  url: string;
  key: string;
};
