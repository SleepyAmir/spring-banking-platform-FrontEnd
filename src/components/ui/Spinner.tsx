import { Loader2 } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export function Spinner({ label }: { label?: string }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
      <Loader2 className="h-5 w-5 animate-spin text-brand-400" />
      <span className="text-sm">{label || t('loading')}</span>
    </div>
  );
}

export function EmptyState({ label }: { label?: string }) {
  const { t } = useI18n();
  return (
    <div className="py-12 text-center text-sm text-slate-500">{label || t('noData')}</div>
  );
}
