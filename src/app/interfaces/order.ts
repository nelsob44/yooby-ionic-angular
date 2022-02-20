export interface Order {
  id?: string;
  itemName: string;
  unitPrice: number;
  itemQuantity: number;
  amount: number;
  finalAmount?: number;
  transactionReference: string;
  buyerEmail: string;
  sellerEmail: string;
  buyerName: string;
  sellerName: string;
  isPaidFor: boolean;
  isDispatched: boolean;
  isCompleteTransaction: boolean;
  shippingDetails: string;
  createdAt: string;
}
