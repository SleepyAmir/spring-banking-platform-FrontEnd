import { Ban } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useFetch } from '@/hooks/useFetch';
import { fraudApi } from '@/api/services';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/PageHeader';
import type { FraudAlert } from '@/types';

export default function AdminBlocked() {
  const { t } = useI18n();
  const blocked = useFetch(() => fraudApi.blocked(), []);

  return (
    <div>
      <PageHeader title={t('blockedTx')} />
      <Card>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-200">
          <Ban className="h-5 w-5" />
          {t('blockedTx')}
        </div>
        <DataTable<FraudAlert>
          loading={blocked.loading}
          rows={blocked.data ?? []}
          keyField={(r) => r.id}
          columns={[
            { header: t('trackingCode'), cell: (r) => <span className="font-mono text-xs text-slate-400">{r.trackingCode || '—'}</span> },
            { header: t('riskScore'), cell: (r) => <span className="font-semibold text-rose-300">{r.riskScore}</span> },
            { header: t('riskLevel'), cell: (r) => <Badge variant={statusVariant(r.riskLevel)}>{r.riskLevel}</Badge> },
            { header: t('rules'), cell: (r) => (
              <div className="flex flex-wrap gap-1">
                {(r.triggeredRules || '').split(',').filter(Boolean).map((rule) => <Badge key={rule} variant="danger">{rule}</Badge>)}
              </div>
            ) },
            { header: 'User', cell: (r) => `#${r.userId}` },
          ]}
        />
      </Card>
    </div>
  );
}
