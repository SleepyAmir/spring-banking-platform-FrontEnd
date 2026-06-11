import { cn } from '@/lib/utils';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const styles: Record<Variant, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
  info: 'bg-brand-500/15 text-brand-500 border border-brand-500/20',
  neutral: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
};

/** نگاشت وضعیت‌های رایج بک‌اند به رنگ. */
export function statusVariant(status?: string): Variant {
  const s = (status || '').toUpperCase();
  if (['COMPLETED', 'ACTIVE', 'APPROVED', 'PAID'].includes(s)) return 'success';
  if (['PENDING', 'UNDER_REVIEW', 'DOCUMENT_UPLOADED', 'REVIEW', 'CHALLENGE'].includes(s)) return 'warning';
  if (['BLOCKED', 'FAILED', 'REJECTED', 'OVERDUE', 'BLOCK', 'CLOSED', 'FROZEN', 'CRITICAL', 'HIGH'].includes(s)) return 'danger';
  return 'neutral';
}

export function Badge({ children, variant = 'neutral', className }: {
  children: React.ReactNode; variant?: Variant; className?: string;
}) {
  return <span className={cn('badge', styles[variant], className)}>{children}</span>;
}
