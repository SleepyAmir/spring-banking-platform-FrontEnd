import { Wallet, TrendingUp, PiggyBank, ArrowLeftRight, CreditCard, Landmark, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useFetch } from '@/hooks/useFetch';
import { accountApi, analyticsApi, txApi } from '@/api/services';
import { formatMoney, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';
import type { Transaction } from '@/types';

export default function UserDashboard() {
    const { t, lang } = useI18n();
    const { user } = useAuth();
    const uid = user?.id ?? 2;

    const accounts = useFetch(() => accountApi.byUser(uid), [uid]);
    const snapshots = useFetch(() => analyticsApi.byUser(uid), [uid]);
    const txs = useFetch(() => txApi.byUser(uid), [uid]);

    const totalBalance = (accounts.data ?? []).reduce((s, a) => s + Number(a.balance || 0), 0);
    const lastSnap = (snapshots.data ?? []).at(-1);

    const chartData = (snapshots.data ?? []).map((s) => ({
        month: s.snapshotMonth,
        income: s.totalIncome,
        expense: s.totalExpense,
    }));

    return (
        <div>
            <PageHeader
                title={t('dashboard')}
                subtitle={t('overview')}
                action={
                    <Link to="/app/transfer" className="btn-primary">
                        <ArrowLeftRight className="h-4 w-4" /> {t('transfer')}
                    </Link>
                }
            />

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title={t('balance')} value={formatMoney(totalBalance)} icon={<Wallet className="h-5 w-5" />} accent="brand" />
                <StatCard title={t('totalIncome')} value={formatMoney(lastSnap?.totalIncome ?? 0)} icon={<TrendingUp className="h-5 w-5" />} accent="emerald" trend={lastSnap?.comparedToPrevMonth} />
                <StatCard title={t('totalExpense')} value={formatMoney(lastSnap?.totalExpense ?? 0)} icon={<CreditCard className="h-5 w-5" />} accent="amber" />
                <StatCard title={t('savingsRate')} value={`${(lastSnap?.savingsRate ?? 0).toFixed(1)}%`} icon={<PiggyBank className="h-5 w-5" />} accent="emerald" />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {/* Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader title={t('spendingChart')} subtitle={lang === 'fa' ? 'درآمد و هزینه‌ی ماهانه' : 'Monthly income vs expense'} icon={<TrendingUp className="h-5 w-5" />} />
                    {snapshots.loading ? (
                        <Spinner />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #ffffff20', borderRadius: 12, color: '#fff' }}
                                    formatter={(v: number) => formatMoney(v)}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#inc)" strokeWidth={2} name={t('totalIncome')} />
                                <Area type="monotone" dataKey="expense" stroke="#f59e0b" fill="url(#exp)" strokeWidth={2} name={t('totalExpense')} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Card>

                {/* Quick actions */}
                <Card>
                    <CardHeader title={t('quickActions')} icon={<Landmark className="h-5 w-5" />} />
                    <div className="grid grid-cols-2 gap-3">
                        <QuickLink to="/app/transfer" icon={<ArrowLeftRight className="h-5 w-5" />} label={t('transfer')} />
                        <QuickLink to="/app/accounts" icon={<Plus className="h-5 w-5" />} label={t('openAccount')} />
                        <QuickLink to="/app/cards" icon={<CreditCard className="h-5 w-5" />} label={t('cards')} />
                        <QuickLink to="/app/loans" icon={<Landmark className="h-5 w-5" />} label={t('loans')} />
                    </div>

                    <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs text-slate-400">{t('accounts')}</p>
                        {accounts.loading ? (
                            <Spinner />
                        ) : (
                            <div className="mt-2 space-y-2">
                                {(accounts.data ?? []).map((a) => (
                                    <div key={a.id} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-300">{a.alias || a.type}</span>
                                        <span className="font-semibold text-white">{formatMoney(a.balance)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Recent transactions */}
            <Card className="mt-6">
                <CardHeader title={t('recentTx')} icon={<ArrowLeftRight className="h-5 w-5" />}
                            action={<Link to="/app/transactions" className="text-sm text-brand-400 hover:text-brand-300">{t('transactions')} →</Link>} />
                <DataTable<Transaction>
                    loading={txs.loading}
                    rows={(txs.data ?? []).slice(0, 5)}
                    keyField={(r) => r.trackingCode}
                    columns={[
                        { header: t('trackingCode'), cell: (r) => <span className="font-mono text-xs text-slate-400">{r.trackingCode.slice(0, 14)}…</span> },
                        { header: t('type'), cell: (r) => <Badge variant="info">{r.type}</Badge> },
                        { header: t('amount'), cell: (r) => <span className="font-semibold">{formatMoney(r.amount)}</span> },
                        { header: t('status'), cell: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
                        { header: t('date'), cell: (r) => <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span> },
                    ]}
                />
            </Card>
        </div>
    );
}

function QuickLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
    return (
        <Link to={to} className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center transition hover:border-brand-500/40 hover:bg-brand-500/10">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/15 text-brand-300 transition group-hover:scale-110">{icon}</div>
            <span className="text-xs font-medium text-slate-200">{label}</span>
        </Link>
    );
}
