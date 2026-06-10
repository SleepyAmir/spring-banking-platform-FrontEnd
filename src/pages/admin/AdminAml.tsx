import { useState } from 'react';
import { useI18n } from '@/context/I18nContext';
import { useFetch } from '@/hooks/useFetch';
import { fraudApi } from '@/api/services';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/ui/Modal';
import type { AmlAlert } from '@/types';

export default function AdminAml() {
  const { t, lang } = useI18n();
  const aml = useFetch(() => fraudApi.amlByUser(2), []);
  const [view, setView] = useState<AmlAlert | null>(null);

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
            { header: 'جزئیات', cell: (r) => (
                <button onClick={() => setView(r)} className="btn-ghost px-3 py-1 text-xs">مشاهده</button>
            ) },
          ]}
        />
      </Card>

      <Modal open={!!view} onClose={() => setView(null)} title={lang === 'fa' ? 'جزئیات هشدار پولشویی' : 'AML Alert Details'}>
        {view && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-slate-400">شناسه کاربر: <strong className="text-white">#{view.userId}</strong></span>
              <div className="flex gap-2">
                <Badge variant={statusVariant(view.severity)}>{view.severity}</Badge>
                <Badge variant={statusVariant(view.status)}>{view.status}</Badge>
              </div>
            </div>
            
            <div>
              <span className="block text-xs text-slate-500 mb-1">نوع الگو</span>
              <Badge variant="info">{view.type}</Badge>
            </div>

            <div>
              <span className="block text-xs text-slate-500 mb-1">توضیحات و رفتار مشکوک</span>
              <p className="text-sm text-slate-300 bg-slate-800/50 p-4 rounded-lg border border-white/5 leading-relaxed">
                {view.description || 'توضیحاتی ثبت نشده است.'}
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
