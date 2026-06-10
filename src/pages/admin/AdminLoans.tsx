import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { useFetch } from '@/hooks/useFetch';
import { loanApi } from '@/api/services';
import { extractError } from '@/api/client';
import { formatMoney } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/PageHeader';
import type { Loan } from '@/types';

export default function AdminLoans() {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const loans = useFetch(() => loanApi.all(), []);
  const [reject, setReject] = useState<Loan | null>(null);
  const [reason, setReason] = useState('');

  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try { await fn(); toast(msg, 'success'); loans.refetch(); }
    catch (err) { toast(extractError(err), 'error'); }
  };

  return (
    <div>
      <PageHeader title={t('loanManagement')} />
      <Card>
        <DataTable<Loan>
          loading={loans.loading}
          rows={loans.data ?? []}
          keyField={(r) => r.id}
          columns={[
            { header: 'ID', cell: (r) => `#${r.id}` },
            { header: t('amount'), cell: (r) => <span className="font-semibold">{formatMoney(r.amount)}</span> },
            { header: t('interestRate'), cell: (r) => `${r.interestRate}%` },
            { header: t('durationMonths'), cell: (r) => r.durationMonths },
            { header: t('purpose'), cell: (r) => <span className="text-slate-400">{r.purpose || '—'}</span> },
            { header: t('status'), cell: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
            { header: t('actions'), cell: (r) => r.status === 'PENDING' ? (
              <div className="flex gap-2">
                <button className="btn-primary px-2.5 py-1.5 text-xs" onClick={() => act(() => loanApi.approve(r.id), 'APPROVED')}>
                  <Check className="h-3.5 w-3.5" /> {t('approve')}
                </button>
                <button className="btn-danger px-2.5 py-1.5 text-xs" onClick={() => { setReject(r); setReason(''); }}>
                  <X className="h-3.5 w-3.5" /> {t('reject')}
                </button>
              </div>
            ) : <span className="text-xs text-slate-500">—</span> },
          ]}
        />
      </Card>

      <Modal open={!!reject} onClose={() => setReject(null)} title={t('reject')}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setReject(null)}>{t('cancel')}</button>
            <button className="btn-danger" onClick={() => { if (reject) act(() => loanApi.reject(reject.id, reason || 'rejected'), 'REJECTED'); setReject(null); }}>{t('reject')}</button>
          </>
        }>
        <label className="label">{lang === 'fa' ? 'دلیل رد' : 'Reason'}</label>
        <textarea className="input min-h-[90px]" value={reason} onChange={(e) => setReason(e.target.value)} />
      </Modal>
    </div>
  );
}
