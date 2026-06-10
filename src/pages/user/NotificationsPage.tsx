import { Bell, CheckCheck, AlertTriangle, Landmark, ArrowLeftRight } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useFetch } from '@/hooks/useFetch';
import { notificationApi } from '@/api/services';
import { formatDate, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Spinner, EmptyState } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';
import type { NotificationItem } from '@/types';

const iconFor = (type: string) => {
  if (type.includes('FRAUD') || type.includes('BLOCK')) return AlertTriangle;
  if (type.includes('LOAN')) return Landmark;
  if (type.includes('TRANSACTION')) return ArrowLeftRight;
  return Bell;
};

export default function NotificationsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const uid = user?.id ?? 2;
  const notifs = useFetch(() => notificationApi.byUser(uid), [uid]);

  return (
    <div>
      <PageHeader title={t('notifications')} />
      <Card>
        {notifs.loading ? (
          <Spinner />
        ) : !(notifs.data ?? []).length ? (
          <EmptyState />
        ) : (
          <div className="space-y-2 stagger">
            {(notifs.data ?? []).map((n) => <Row key={n.id} n={n} />)}
          </div>
        )}
      </Card>
    </div>
  );
}

function Row({ n }: { n: NotificationItem }) {
  const Icon = iconFor(n.type);
  const danger = n.type.includes('FRAUD') || n.type.includes('BLOCK');
  return (
    <div className={cn('flex items-start gap-4 rounded-xl border p-4 transition', n.isRead ? 'border-white/5 bg-transparent' : 'border-brand-500/20 bg-brand-500/5')}>
      <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', danger ? 'bg-rose-500/15 text-rose-300' : 'bg-brand-500/15 text-brand-300')}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white">{n.title}</p>
          {!n.isRead && <span className="h-2 w-2 rounded-full bg-brand-400" />}
        </div>
        <p className="mt-0.5 text-sm text-slate-400">{n.message}</p>
        <p className="mt-1 text-[11px] text-slate-500">{formatDate(n.createdAt)}</p>
      </div>
      {n.isRead && <CheckCheck className="h-4 w-4 shrink-0 text-slate-600" />}
    </div>
  );
}
