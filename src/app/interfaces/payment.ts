export interface Account {
  id?: string;
  userName?: string;
  currentBalance: number;
  accountType: string;
  lastCreditFrom: string;
  lastPaymentTo: string;
  lastTransactionAmount: number;
  updatedAt: string;
}
