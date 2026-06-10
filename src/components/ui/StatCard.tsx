import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ title, value, icon, trend, accent = 'brand' }: {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: number;
  accent?: 'brand' | 'emerald' | 'amber' | 'rose';
}) {
  const accents = {
    brand: 'from-brand-500/20 to-brand-700/5 text-brand-300',
    emerald: 'from-emerald-500/20 to-emerald-700/5 text-emerald-300',
    amber: 'from-amber-500/20 to-amber-700/5 text-amber-300',
    rose: 'from-rose-500/20 to-rose-700/5 text-rose-300',
  };
  return (
    <div className="card relative overflow-hidden p-5">
      <div className={cn('absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl opacity-60', accents[accent])} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</p>
          {trend !== undefined && (
            <div className={cn('mt-1.5 flex items-center gap-1 text-xs', trend >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
              {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>
        <div className={cn('grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br', accents[accent])}>{icon}</div>
      </div>
    </div>
  );
}
