import {
  LayoutDashboard, Wallet, CreditCard, ArrowLeftRight, Landmark,
  Bell, ShieldCheck, Users, FileCheck2, AlertTriangle, ShieldAlert, Ban,
} from 'lucide-react';
import type { TranslationKey } from '@/i18n/translations';

export interface NavItem {
  to: string;
  labelKey: TranslationKey;
  icon: typeof LayoutDashboard;
}

export const userNav: NavItem[] = [
  { to: '/app', labelKey: 'dashboard', icon: LayoutDashboard },
  { to: '/app/accounts', labelKey: 'accounts', icon: Wallet },
  { to: '/app/cards', labelKey: 'cards', icon: CreditCard },
  { to: '/app/transfer', labelKey: 'transfer', icon: ArrowLeftRight },
  { to: '/app/transactions', labelKey: 'transactions', icon: ArrowLeftRight },
  { to: '/app/loans', labelKey: 'loans', icon: Landmark },
  { to: '/app/kyc', labelKey: 'kyc', icon: ShieldCheck },
  { to: '/app/notifications', labelKey: 'notifications', icon: Bell },
];

export const adminNav: NavItem[] = [
  { to: '/admin', labelKey: 'overview', icon: LayoutDashboard },
  { to: '/admin/users', labelKey: 'users', icon: Users },
  { to: '/admin/kyc', labelKey: 'kycReview', icon: FileCheck2 },
  { to: '/admin/loans', labelKey: 'loanManagement', icon: Landmark },
  { to: '/admin/fraud', labelKey: 'fraudAlerts', icon: AlertTriangle },
  { to: '/admin/aml', labelKey: 'amlAlerts', icon: ShieldAlert },
  { to: '/admin/blocked', labelKey: 'blockedTx', icon: Ban },
];
