export interface Product {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  minOrder?: number;
  sellerLocation?: string;
  verifiedSeller?: boolean;
  furtherDetails?: ProductAndSellerDescription;
  discount?: number;
  promoEndDate?: Date;
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
