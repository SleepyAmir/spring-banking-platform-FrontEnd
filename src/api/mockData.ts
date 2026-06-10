import type {
  Account, Card, Transaction, Loan, LoanInstallment, KycVerification,
  NotificationItem, FraudAlert, AmlAlert, SpendingSnapshot, User,
} from '@/types';

/** داده‌ی نمونه برای حالت دمو (وقتی بک‌اند بالا نیست). */

export const mockUsers: Record<string, { user: User; role: 'CUSTOMER' | 'ADMIN' | 'MANAGER'; password: string }> = {
  customer: {
    password: 'customer123',
    user: { id: 2, username: 'customer', email: 'customer@springbank.com', firstName: 'Ali', lastName: 'Ahmadi', roles: ['CUSTOMER'] },
    role: 'CUSTOMER',
  },
  admin: {
    password: 'admin123',
    user: { id: 1, username: 'admin', email: 'admin@springbank.com', firstName: 'System', lastName: 'Admin', roles: ['ADMIN'] },
    role: 'ADMIN',
  },
  manager: {
    password: 'manager123',
    user: { id: 3, username: 'manager', email: 'manager@springbank.com', firstName: 'Reza', lastName: 'Karimi', roles: ['MANAGER'] },
    role: 'MANAGER',
  },
};

export const mockAccounts: Account[] = [
  { id: 1, accountNumber: 'IR123456789012345678901234', type: 'CHECKING', balance: 128_500_000, status: 'ACTIVE', alias: 'حساب اصلی', userId: 2, dailyTransferLimit: 50_000_000, monthlyTransferLimit: 200_000_000 },
  { id: 2, accountNumber: 'IR998877665544332211009988', type: 'SAVINGS', balance: 42_000_000, status: 'ACTIVE', alias: 'پس‌انداز', userId: 2, dailyTransferLimit: 50_000_000, monthlyTransferLimit: 200_000_000 },
];

export const mockCards: Card[] = [
  { id: 1, cardNumber: '6274129812345670', type: 'DEBIT', status: 'ACTIVE', expiryDate: '2030-03-31', accountId: 1, dailyLimit: 10_000_000, monthlyLimit: 50_000_000 },
];

export const mockTransactions: Transaction[] = [
  { id: 5, trackingCode: 'TXN9F2A77C1B0E4D5A6F0B1', amount: 12_000_000, type: 'DEPOSIT', status: 'COMPLETED', spendingCategory: 'salary', toAccountId: 1, userId: 2, createdAt: '2026-06-01T10:12:00' },
  { id: 4, trackingCode: 'TXN1A2B3C4D5E6F7A8B9C0D', amount: 3_500_000, type: 'TRANSFER', status: 'COMPLETED', fromAccountId: 1, toAccountId: 2, userId: 2, createdAt: '2026-06-03T15:40:00' },
  { id: 3, trackingCode: 'TXNAABBCCDDEEFF00112233', amount: 850_000, type: 'CARD_PAYMENT', status: 'COMPLETED', fromAccountId: 1, spendingCategory: 'shopping', userId: 2, createdAt: '2026-06-05T19:05:00' },
  { id: 2, trackingCode: 'TXN44556677889900AABBCC', amount: 25_000_000, type: 'TRANSFER', status: 'BLOCKED', fromAccountId: 1, toAccountId: 2, userId: 2, createdAt: '2026-06-06T02:30:00' },
  { id: 1, trackingCode: 'TXNFFEEDDCCBBAA99887766', amount: 90_258_338, type: 'LOAN_DISBURSEMENT', status: 'COMPLETED', toAccountId: 1, userId: 2, createdAt: '2026-05-20T09:00:00' },
];

export const mockLoans: Loan[] = [
  { id: 1, amount: 1_000_000_000, interestRate: 14, durationMonths: 12, monthlyInstallment: 90_258_338, status: 'ACTIVE', purpose: 'بازسازی منزل', remainingAmount: 820_000_000, userId: 2, accountId: 1, approvedBy: 'manager' },
  { id: 2, amount: 200_000_000, interestRate: 18, durationMonths: 6, monthlyInstallment: 35_000_000, status: 'PENDING', purpose: 'خرید لوازم', userId: 2, accountId: 1 },
];

export const mockInstallments: LoanInstallment[] = [
  { id: 1, loanId: 1, installmentNumber: 1, amount: 90_258_338, principalPart: 78_591_671, interestPart: 11_666_667, dueDate: '2026-06-20', status: 'PAID', paidDate: '2026-06-18' },
  { id: 2, loanId: 1, installmentNumber: 2, amount: 90_258_338, principalPart: 79_508_575, interestPart: 10_749_763, dueDate: '2026-07-20', status: 'PENDING' },
  { id: 3, loanId: 1, installmentNumber: 3, amount: 90_258_338, principalPart: 80_436_842, interestPart: 9_821_496, dueDate: '2026-08-20', status: 'PENDING' },
];

export const mockKyc: KycVerification[] = [
  { id: 1, userId: 2, username: 'customer', status: 'DOCUMENT_UPLOADED', level: 'BASIC', dailyTransferLimit: 5_000_000, monthlyTransferLimit: 20_000_000 },
  { id: 2, userId: 4, username: 'sara', status: 'UNDER_REVIEW', level: 'STANDARD' },
];

export const mockNotifications: NotificationItem[] = [
  { id: 1, type: 'TRANSACTION_DONE', title: 'انتقال وجه موفق', message: 'مبلغ ۳٬۵۰۰٬۰۰۰ از حساب شما منتقل شد.', isRead: false, channel: 'IN_APP', createdAt: '2026-06-03T15:40:00' },
  { id: 2, type: 'FRAUD_ALERT', title: 'تراکنش مسدود شد', message: 'تراکنش مشکوک شناسایی و مسدود شد.', isRead: false, channel: 'IN_APP', createdAt: '2026-06-06T02:31:00' },
  { id: 3, type: 'LOAN_APPROVED', title: 'وام تأیید شد', message: 'درخواست وام شما تأیید و واریز شد.', isRead: true, channel: 'IN_APP', createdAt: '2026-05-20T09:00:00' },
];

export const mockFraud: FraudAlert[] = [
  { id: 1, riskScore: 85, riskLevel: 'BLOCK', triggeredRules: 'UNUSUAL_TIME,AMOUNT_ANOMALY,UNKNOWN_DEVICE', trackingCode: 'TXN44556677889900AABBCC', transactionId: 2, userId: 2 },
  { id: 2, riskScore: 35, riskLevel: 'REVIEW', triggeredRules: 'UNKNOWN_DEVICE', trackingCode: 'TXNAABBCCDDEEFF00112233', transactionId: 3, userId: 2 },
];

export const mockAml: AmlAlert[] = [
  { id: 1, type: 'LARGE_TRANSACTION', severity: 'MEDIUM', status: 'OPEN', description: 'تراکنش بزرگ بیش از ۵۰۰ میلیون', userId: 2, transactionId: 1 },
];

export const mockSnapshots: SpendingSnapshot[] = [
  { id: 1, snapshotMonth: '2026-03', totalIncome: 95_000_000, totalExpense: 61_000_000, savingsRate: 35.8, comparedToPrevMonth: -4.2, transactionCount: 22, topCategory: 'salary', userId: 2 },
  { id: 2, snapshotMonth: '2026-04', totalIncome: 102_000_000, totalExpense: 70_000_000, savingsRate: 31.4, comparedToPrevMonth: 14.7, transactionCount: 27, topCategory: 'shopping', userId: 2 },
  { id: 3, snapshotMonth: '2026-05', totalIncome: 120_000_000, totalExpense: 66_000_000, savingsRate: 45.0, comparedToPrevMonth: -5.7, transactionCount: 25, topCategory: 'salary', userId: 2 },
  { id: 4, snapshotMonth: '2026-06', totalIncome: 102_258_338, totalExpense: 29_350_000, savingsRate: 71.3, comparedToPrevMonth: -55.5, transactionCount: 9, topCategory: 'salary', userId: 2 },
];

export const mockAdminUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@springbank.com', firstName: 'System', lastName: 'Admin', enabled: true, roles: ['ADMIN'] },
  { id: 2, username: 'customer', email: 'customer@springbank.com', firstName: 'Ali', lastName: 'Ahmadi', enabled: true, roles: ['CUSTOMER'] },
  { id: 3, username: 'manager', email: 'manager@springbank.com', firstName: 'Reza', lastName: 'Karimi', enabled: true, roles: ['MANAGER'] },
  { id: 4, username: 'sara', email: 'sara@example.com', firstName: 'Sara', lastName: 'Moradi', enabled: true, roles: ['CUSTOMER'] },
];
