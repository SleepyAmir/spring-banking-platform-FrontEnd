export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
  path: string;
  timestamp: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  enabled?: boolean;
  roles?: string[];
}

export type Role = 'CUSTOMER' | 'ADMIN' | 'MANAGER';

export interface Account {
  id: number;
  accountNumber: string;
  type: 'CHECKING' | 'SAVINGS';
  balance: number;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  alias?: string;
  dailyTransferLimit?: number;
  monthlyTransferLimit?: number;
  userId: number;
  branchId?: number;
}

export interface Card {
  id: number;
  cardNumber: string;
  cvv2?: string;
  pin?: string;
  type: 'DEBIT' | 'CREDIT';
  status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
  expiryDate: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  accountId: number;
}

export interface Transaction {
  id?: number;
  trackingCode: string;
  amount: number;
  currency?: string;
  type: string;
  status: string;
  description?: string;
  spendingCategory?: string;
  fromAccountId?: number | null;
  toAccountId?: number | null;
  userId?: number;
  createdAt?: string;
}

export interface Loan {
  id: number;
  amount: number;
  interestRate: number;
  durationMonths: number;
  monthlyInstallment: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  purpose?: string;
  remainingAmount?: number;
  userId: number;
  accountId: number;
  approvedBy?: string;
}

export interface LoanInstallment {
  id: number;
  loanId: number;
  installmentNumber: number;
  amount: number;
  principalPart?: number;
  interestPart?: number;
  dueDate: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'WAIVED';
  lateFee?: number;
  daysOverdue?: number;
}

export interface KycVerification {
  id: number;
  userId: number;
  username?: string;
  status: 'PENDING' | 'DOCUMENT_UPLOADED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  level: 'BASIC' | 'STANDARD' | 'ENHANCED';
  rejectionReason?: string;
  verifiedBy?: string;
  dailyTransferLimit?: number;
  monthlyTransferLimit?: number;
}

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  channel: string;
  createdAt?: string;
}

export interface FraudAlert {
  id: number;
  riskScore: number;
  riskLevel: 'ALLOW' | 'REVIEW' | 'CHALLENGE' | 'BLOCK';
  triggeredRules?: string;
  trackingCode?: string;
  transactionId?: number | null;
  userId: number;
}

export interface AmlAlert {
  id: number;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
  description: string;
  userId: number;
  transactionId?: number | null;
}

export interface SpendingSnapshot {
  id: number;
  snapshotMonth: string;
  totalIncome: number;
  totalExpense: number;
  savingsRate?: number;
  comparedToPrevMonth?: number;
  transactionCount?: number;
  topCategory?: string;
  userId: number;
}
