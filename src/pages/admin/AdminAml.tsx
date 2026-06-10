import { useI18n } from '@/context/I18nContext';
import { useFetch } from '@/hooks/useFetch';
import { fraudApi } from '@/api/services';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/PageHeader';
import type { AmlAlert } from '@/types';

export default function AdminAml() {
  const { t } = useI18n();
  // در دمو همه‌ی هشدارهای AML کاربر نمونه؛ در واقعیت بر اساس کاربر/گزارش‌ها
  const aml = useFetch(() => fraudApi.amlByUser(2), []);

  return (
    <div>
      <PageHeader title={t('amlAlerts')} subtitle="Anti-Money Laundering" />
      <Card>
        <DataTable<AmlAlert>
          loading={aml.loading}
          rows={aml.data ?? []}
          keyField={(r) => r.id}
          columns={[
            { header: 'ID', cell: (r) => `#${r.id}` },
            { header: t('type'), cell: (r) => <Badge variant="info">{r.type}</Badge> },
            { header: t('severity'), cell: (r) => <Badge variant={statusVariant(r.severity)}>{r.severity}</Badge> },
            { header: t('status'), cell: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
            { header: t('description'), cell: (r) => <span className="text-slate-300">{r.description}</span> },
            { header: 'User', cell: (r) => `#${r.userId}` },
          ]}
        />
      </Card>
    </div>
  );
}
