import { useState } from 'react';
import { Landmark, Loader2, Plus, Receipt } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useFetch } from '@/hooks/useFetch';
import { accountApi, loanApi } from '@/api/services';
import { extractError } from '@/api/client';
import { formatMoney, formatDate } from '@/lib/utils';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/ui/DataTable';
import { Spinner, EmptyState } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';
import type { Loan, LoanInstallment } from '@/types';

export default function LoansPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const uid = user?.id ?? 2;

  const loans = useFetch(() => loanApi.byUser(uid), [uid]);
  const accounts = useFetch(() => accountApi.byUser(uid), [uid]);

  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({ amount: '', durationMonths: '12', purpose: '', accountId: '' });
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<Loan | null>(null);
  const installments = useFetch(() => (selected ? loanApi.installments(selected.id) : Promise.resolve([])), [selected?.id]);

  const apply = async () => {
    setLoading(true);
    try {
      await loanApi.apply({
        userId: uid, accountId: Number(form.accountId || accounts.data?.[0]?.id),
        amount: Number(form.amount), durationMonths: Number(form.durationMonths), purpose: form.purpose,
      });
      toast(lang === 'fa' ? 'درخواست وام ثبت شد' : 'Loan requested', 'success');
      setApplyOpen(false);
      loans.refetch();
    } catch (err) {
      toast(extractError(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const pay = async (inst: LoanInstallment) => {
    try {
      await loanApi.payInstallment(inst.id);
      toast(lang === 'fa' ? 'قسط پرداخت شد' : 'Installment paid', 'success');
      installments.refetch();
      loans.refetch();
    } catch (err) {
      toast(extractError(err), 'error');
    }
  };

  return (
    <div>
      <PageHeader
        title={t('loans')}
        action={<button className="btn-primary" onClick={() => setApplyOpen(true)}><Plus className="h-4 w-4" /> {t('apply')}</button>}
      />

      {loans.loading ? (
        <Spinner />
      ) : !(loans.data ?? []).length ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 stagger">
          {(loans.data ?? []).map((l) => (
            <Card key={l.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300"><Landmark className="h-5 w-5" /></div>
                  <div>
                    <p className="font-semibold text-white">{formatMoney(l.amount)}</p>
                    <p className="text-xs text-slate-400">{l.purpose || '—'}</p>
                  </div>
                </div>
                <Badge variant={statusVariant(l.status)}>{l.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info label={t('interestRate')} value={`${l.interestRate}%`} />
                <Info label={t('durationMonths')} value={String(l.durationMonths)} />
                <Info label={t('monthlyInstallment')} value={formatMoney(l.monthlyInstallment)} />
                <Info label={t('remaining')} value={formatMoney(l.remainingAmount ?? l.amount)} />
              </div>
              {(l.status === 'ACTIVE' || l.status === 'COMPLETED') && (
                <button className="btn-ghost mt-4 w-full" onClick={() => setSelected(l)}>
                  <Receipt className="h-4 w-4" /> {t('installments')}
                </button>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Apply modal */}
      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={t('apply')}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setApplyOpen(false)}>{t('cancel')}</button>
            <button className="btn-primary" onClick={apply} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {t('submit')}
            </button>
          </>
        }
      >
        <div>
          <label className="label">{t('accounts')}</label>
          <select className="input" value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })}>
            {(accounts.data ?? []).map((a) => <option key={a.id} value={a.id}>{a.alias || a.type}</option>)}
          </select>
        </div>
        <div>
          <label className="label">{t('amount')}</label>
          <input className="input" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="100000000" />
        </div>
        <div>
          <label className="label">{t('durationMonths')}</label>
          <input className="input" type="number" value={form.durationMonths} onChange={(e) => setForm({ ...form, durationMonths: e.target.value })} />
        </div>
        <div>
          <label className="label">{t('purpose')}</label>
          <input className="input" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
        </div>
      </Modal>

      {/* Installments modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`${t('installments')} — ${selected ? formatMoney(selected.amount) : ''}`}>
        <DataTable<LoanInstallment>
          loading={installments.loading}
          rows={installments.data ?? []}
          keyField={(r) => r.id}
          columns={[
            { header: '#', cell: (r) => r.installmentNumber },
            { header: t('amount'), cell: (r) => formatMoney(r.amount) },
            { header: t('date'), cell: (r) => <span className="text-xs text-slate-400">{formatDate(r.dueDate)}</span> },
            { header: t('status'), cell: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
            { header: t('actions'), cell: (r) => r.status === 'PENDING'
              ? <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => pay(r)}>{t('pay')}</button>
              : <span className="text-xs text-slate-500">—</span> },
          ]}
        />
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-0.5 font-medium text-white">{value}</p>
    </div>
  );
}
