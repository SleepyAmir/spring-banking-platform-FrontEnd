import { useState } from 'react';
import { useI18n } from '@/context/I18nContext';
import { useFetch } from '@/hooks/useFetch';
import { fraudApi } from '@/api/services';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/ui/Modal';
import type { FraudAlert } from '@/types';

export default function AdminFraud() {
  const { t, lang } = useI18n();
  const fraud = useFetch(() => fraudApi.all(), []);
  const [view, setView] = useState<FraudAlert | null>(null);

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
            { header: 'جزئیات', cell: (r) => (
                <button onClick={() => setView(r)} className="btn-ghost px-3 py-1 text-xs">مشاهده</button>
            ) },
          ]}
        />
      </Card>

      <Modal open={!!view} onClose={() => setView(null)} title={lang === 'fa' ? 'جزئیات هشدار تقلب' : 'Fraud Alert Details'}>
        {view && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-slate-400">شناسه کاربر: <strong className="text-white">#{view.userId}</strong></span>
              <Badge variant={statusVariant(view.riskLevel)}>{view.riskLevel}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-slate-500">کد پیگیری تراکنش</span>
                <span className="text-sm font-mono text-slate-200">{view.trackingCode || 'ندارد'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500">امتیاز ریسک</span>
                <span className="text-sm text-slate-200">{view.riskScore} از 100</span>
              </div>
            </div>

            <div>
              <span className="block text-xs text-slate-500 mb-1">قوانین نقض شده</span>
              <div className="flex flex-wrap gap-2">
                {(view.triggeredRules || 'موردی یافت نشد').split(',').filter(Boolean).map(rule => (
                  <Badge key={rule} variant="warning">{rule}</Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs text-slate-500 mb-1">توضیحات سیستم</span>
              <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-white/5">
                {view.reason || 'توضیحاتی ثبت نشده است.'}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setView(null)} className="btn-ghost">{t('cancel')}</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
