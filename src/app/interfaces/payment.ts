export default interface Product {
  id?: number;
  amount: number;
  purpose: string;
  transactionReference: string;
  paymentFrom: string;
  paymentTo: string;
  createdAt?: string;
}
