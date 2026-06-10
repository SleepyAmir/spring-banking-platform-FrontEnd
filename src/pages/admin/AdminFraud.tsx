import { useI18n } from '@/context/I18nContext';
import { useFetch } from '@/hooks/useFetch';
import { fraudApi } from '@/api/services';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/PageHeader';
import type { FraudAlert } from '@/types';

export default function AdminFraud() {
  const { t } = useI18n();
  const fraud = useFetch(() => fraudApi.all(), []);

  return (
    <div>
      <PageHeader title={t('fraudAlerts')} />
      <Card>
        <DataTable<FraudAlert>
          loading={fraud.loading}
          rows={fraud.data ?? []}
          keyField={(r) => r.id}
          columns={[
            { header: 'ID', cell: (r) => `#${r.id}` },
            { header: t('trackingCode'), cell: (r) => <span className="font-mono text-xs text-slate-400">{r.trackingCode || '—'}</span> },
            { header: t('riskScore'), cell: (r) => <span className="font-semibold">{r.riskScore}</span> },
            { header: t('riskLevel'), cell: (r) => <Badge variant={statusVariant(r.riskLevel)}>{r.riskLevel}</Badge> },
            { header: t('rules'), cell: (r) => (
              <div className="flex flex-wrap gap-1">
                {(r.triggeredRules || '').split(',').filter(Boolean).map((rule) => (
                  <Badge key={rule} variant="warning">{rule}</Badge>
                ))}
              </div>
            ) },
            { header: 'User', cell: (r) => `#${r.userId}` },
          ]}
        />
      </Card>
    </div>
  );
}
