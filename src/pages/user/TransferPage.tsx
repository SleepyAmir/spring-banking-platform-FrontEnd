import { useState } from 'react';
import { ArrowLeftRight, Loader2, Wallet, CheckCircle2, Banknote } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useFetch } from '@/hooks/useFetch';
import { accountApi, txApi } from '@/api/services';
import { extractError } from '@/api/client';
import { formatMoney } from '@/lib/utils';
import { numberToWords } from '@/lib/persianNumber';
import { Card, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

export default function TransferPage() {
    const { t, lang } = useI18n();
    const { user } = useAuth();
    const { toast } = useToast();
    const uid = user?.id ?? 2;
    const accounts = useFetch(() => accountApi.byUser(uid), [uid]);

    const [tab, setTab] = useState<'transfer' | 'deposit'>('transfer');
    const [fromId, setFromId] = useState<number | ''>('');
    const [toId, setToId] = useState<number | ''>('');
    const [toExternal, setToExternal] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('salary');
    const [loading, setLoading] = useState(false);
    const [lastTracking, setLastTracking] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLastTracking(null);
        try {
            const amt = Number(amount);
            if (tab === 'transfer') {
                if (!fromId) { toast(lang === 'fa' ? 'حساب مبدأ را انتخاب کنید' : 'Select source account', 'error'); setLoading(false); return; }

                // تعیین حساب مقصد: یا از حساب‌های خودم (toId)، یا با شماره‌ی حساب مقصد (lookup)
                let to: number;
                if (toId) {
                    to = Number(toId);
                } else if (toExternal.trim()) {
                    // ورودی، شماره‌ی حساب (IR...) است → آن را به accountId تبدیل می‌کنیم
                    const found = await accountApi.lookup(toExternal.trim());
                    to = found.id;
                } else {
                    toast(lang === 'fa' ? 'حساب مقصد را انتخاب یا شماره‌ی حساب را وارد کنید' : 'Choose or enter destination account', 'error');
                    setLoading(false); return;
                }

                if (Number(fromId) === to) { toast(lang === 'fa' ? 'حساب مبدأ و مقصد نباید یکسان باشند' : 'Source and destination must differ', 'error'); setLoading(false); return; }
                const fee = 600; // کارمزد ثابت ۶۰۰ ریالی بانکی (یا می‌تونه فرمولی باشه)
                const res = await txApi.create({ type: 'TRANSFER', amount: amt, fee: fee, fromAccountId: Number(fromId), toAccountId: to, userId: uid });
                setLastTracking(res.trackingCode);
                setToExternal('');
                setToId('');
            } else {
                const res = await txApi.create({ type: 'DEPOSIT', amount: amt, toAccountId: Number(fromId), userId: uid, spendingCategory: category });
                setLastTracking(res.trackingCode);
            }
            toast(lang === 'fa' ? 'تراکنش با موفقیت انجام شد' : 'Transaction completed', 'success');
            accounts.refetch();
            setAmount('');
        } catch (err) {
            toast(extractError(err), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader title={tab === 'transfer' ? t('transfer') : t('deposit')} subtitle={t('appName')} />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="mb-5 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                        <button onClick={() => setTab('transfer')} className={`btn px-4 py-2 text-sm ${tab === 'transfer' ? 'bg-brand-600 text-white' : 'text-slate-300'}`}>
                            <ArrowLeftRight className="h-4 w-4" /> {t('transfer')}
                        </button>
                        <button onClick={() => setTab('deposit')} className={`btn px-4 py-2 text-sm ${tab === 'deposit' ? 'bg-brand-600 text-white' : 'text-slate-300'}`}>
                            <Banknote className="h-4 w-4" /> {t('deposit')}
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="label">{tab === 'transfer' ? t('from') : t('accounts')}</label>
                            <select className="input" value={fromId} onChange={(e) => setFromId(Number(e.target.value))} required>
                                <option value="">{t('search')}…</option>
                                {(accounts.data ?? []).map((a) => (
                                    <option key={a.id} value={a.id}>{(a.alias || a.type)} — {formatMoney(a.balance)}</option>
                                ))}
                            </select>
                        </div>

                        {tab === 'transfer' && (
                            <div>
                                <label className="label">{t('to')}</label>
                                <select className="input mb-2" value={toId} onChange={(e) => { setToId(e.target.value ? Number(e.target.value) : ''); }}>
                                    <option value="">{lang === 'fa' ? 'یکی از حساب‌های من…' : 'One of my accounts…'}</option>
                                    {(accounts.data ?? []).filter((a) => a.id !== fromId).map((a) => (
                                        <option key={a.id} value={a.id}>{(a.alias || a.type)} — {a.accountNumber}</option>
                                    ))}
                                </select>
                                <input className="input font-mono" disabled={!!toId}
                                       placeholder={lang === 'fa' ? 'یا شماره‌ی حساب (IR...) یا شماره‌ی کارت' : 'or account number (IR...) / card number'}
                                       value={toExternal} onChange={(e) => setToExternal(e.target.value)} />
                            </div>
                        )}

                        {tab === 'deposit' && (
                            <div>
                                <label className="label">{lang === 'fa' ? 'دسته‌بندی' : 'Category'}</label>
                                <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="salary">salary</option>
                                    <option value="gift">gift</option>
                                    <option value="other">other</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="label">{t('amount')}</label>
                            <input className="input" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="1000000" />
                            {amount && !isNaN(Number(amount)) && lang === 'fa' && (
                                <p className="mt-2 text-xs font-medium text-emerald-400">
                                    {numberToWords(Math.floor(Number(amount) / 10))} <span className="text-slate-500">تومان</span>
                                </p>
                            )}
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeftRight className="h-4 w-4" />}
                            {t('submit')}
                        </button>
                    </form>

                    {lastTracking && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200 animate-fade-in">
                            <CheckCircle2 className="h-5 w-5" />
                            {t('trackingCode')}: <span className="font-mono">{lastTracking}</span>
                        </div>
                    )}
                </Card>

                <Card>
                    <CardHeader title={t('accounts')} icon={<Wallet className="h-5 w-5" />} />
                    {accounts.loading ? <Spinner /> : (
                        <div className="space-y-3">
                            {(accounts.data ?? []).map((a) => (
                                <div key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-300">{a.alias || a.type}</span>
                                        <span className="text-sm font-semibold text-white">{formatMoney(a.balance)}</span>
                                    </div>
                                    <p className="mt-1 font-mono text-[11px] text-slate-500">{a.accountNumber}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
