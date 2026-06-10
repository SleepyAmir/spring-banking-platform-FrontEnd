import { useState } from 'react';
import { Wallet, Plus, CreditCard, Loader2, Copy } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useFetch } from '@/hooks/useFetch';
import { accountApi } from '@/api/services';
import { extractError } from '@/api/client';
import { formatMoney, maskCard } from '@/lib/utils';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';
import type { Card as CardType } from '@/types';

export default function AccountsPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const uid = user?.id ?? 2;
  const accounts = useFetch(() => accountApi.byUser(uid), [uid]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'CHECKING', branchCode: 'BR001', alias: '' });
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState<CardType | null>(null);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await accountApi.open({ userId: uid, ...form });
      setIssued(res.card);
      toast(lang === 'fa' ? 'حساب با موفقیت افتتاح شد' : 'Account opened', 'success');
      accounts.refetch();
    } catch (err) {
      toast(extractError(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t('accounts')}
        subtitle={t('issueCardNote')}
        action={<button className="btn-primary" onClick={() => { setIssued(null); setOpen(true); }}><Plus className="h-4 w-4" /> {t('openAccount')}</button>}
      />

      {accounts.loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 stagger">
          {(accounts.data ?? []).map((a) => (
            <div key={a.id} className="card relative overflow-hidden p-5">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-500/20 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/15 text-brand-300"><Wallet className="h-4 w-4" /></div>
                    <span className="text-sm font-medium text-slate-300">{a.alias || a.type}</span>
                  </div>
                  <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                </div>
                <p className="mt-4 text-2xl font-bold text-white">{formatMoney(a.balance)}</p>
                <p className="mt-1 font-mono text-xs text-slate-500">{a.accountNumber}</p>
                <div className="mt-3 flex gap-2 text-xs text-slate-400">
                  <Badge variant="neutral">{a.type}</Badge>
                  <Badge variant="info">{t('balance')}</Badge>
                </div>
              </div>
            </div>
          ))}
          {!(accounts.data ?? []).length && (
            <div className="col-span-full py-12 text-center text-slate-500">{t('noData')}</div>
          )}
        </div>
      )}

      {/* Open account modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('openAccount')}
        footer={!issued && (
          <>
            <button className="btn-ghost" onClick={() => setOpen(false)}>{t('cancel')}</button>
            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {t('submit')}
            </button>
          </>
        )}
      >
        {!issued ? (
          <>
            <div>
              <label className="label">{t('type')}</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="CHECKING">CHECKING</option>
                <option value="SAVINGS">SAVINGS</option>
              </select>
            </div>
            <div>
              <label className="label">{t('branchCode')}</label>
              <input className="input" value={form.branchCode} onChange={(e) => setForm({ ...form, branchCode: e.target.value })} />
            </div>
            <div>
              <label className="label">{lang === 'fa' ? 'نام مستعار' : 'Alias'}</label>
              <input className="input" value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} placeholder={lang === 'fa' ? 'حساب اصلی' : 'Main account'} />
            </div>
          </>
        ) : (
          <IssuedCard card={issued} onCopy={(v) => { navigator.clipboard?.writeText(v); toast('کپی شد', 'success'); }} />
        )}
      </Modal>
    </div>
  );
}

function IssuedCard({ card, onCopy }: { card: CardType; onCopy: (v: string) => void }) {
  const { t, lang } = useI18n();
  return (
    <div>
      <p className="mb-3 text-sm text-emerald-300">
        ✅ {lang === 'fa' ? 'کارت مجازی صادر شد. اطلاعات زیر فقط یک‌بار نمایش داده می‌شود:' : 'Virtual card issued. Shown only once:'}
      </p>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 shadow-glow">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="flex items-center justify-between text-white/90">
          <CreditCard className="h-7 w-7" />
          <span className="text-sm font-medium">{t('appName')}</span>
        </div>
        <p className="mt-6 font-mono text-xl tracking-widest text-white">{card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-white/90">
          <div>
            <p className="text-[10px] uppercase opacity-70">CVV2</p>
            <p className="font-mono">{card.cvv2}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-70">PIN</p>
            <p className="font-mono">{card.pin}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-70">{t('expiry')}</p>
            <p className="font-mono">{card.expiryDate?.slice(0, 7)}</p>
          </div>
        </div>
      </div>
      <button onClick={() => onCopy(card.cardNumber)} className="btn-ghost mt-3 w-full">
        <Copy className="h-4 w-4" /> {maskCard(card.cardNumber)}
      </button>
    </div>
  );
}
