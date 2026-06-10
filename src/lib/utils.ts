import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** ادغام کلاس‌های Tailwind به‌صورت امن. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** فرمت پول با جداکننده‌ی هزارگان و واحد. */
export function formatMoney(value: number | string | null | undefined, currency = 'تومان'): string {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return `0 ${currency}`;
  return `${n.toLocaleString('en-US')} ${currency}`;
}

/** فرمت تاریخ خوانا. */
export function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

/** ماسک کردن شماره کارت: نمایش ۴ رقم آخر. */
export function maskCard(cardNumber?: string | null): string {
  if (!cardNumber) return '—';
  const last4 = cardNumber.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

/** تأخیر برای شبیه‌سازی شبکه (حالت Mock). */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
