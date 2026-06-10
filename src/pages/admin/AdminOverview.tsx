import { Users, FileCheck2, AlertTriangle, Landmark, ShieldAlert, Ban } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useI18n } from '@/context/I18nContext';
import { useFetch } from '@/hooks/useFetch';
import { adminApi, fraudApi, kycApi, loanApi } from '@/api/services';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

export default function AdminOverview() {
  const { t, lang } = useI18n();
  const users = useFetch(() => adminApi.users(), []);
  const kyc = useFetch(() => kycApi.list(), []);
  const loans = useFetch(() => loanApi.all(), []);
  const fraud = useFetch(() => fraudApi.all(), []);

  const pendingKyc = (kyc.data ?? []).filter((k) => k.status === 'DOCUMENT_UPLOADED' || k.status === 'UNDER_REVIEW').length;
  const pendingLoans = (loans.data ?? []).filter((l) => l.status === 'PENDING').length;
  const blocked = (fraud.data ?? []).filter((f) => f.riskLevel === 'BLOCK').length;

  const fraudData = ['ALLOW', 'REVIEW', 'CHALLENGE', 'BLOCK'].map((lvl) => ({
    name: lvl,
    value: (fraud.data ?? []).filter((f) => f.riskLevel === lvl).length,
  })).filter((d) => d.value > 0);
  const COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

  return (
    <div>
      <PageHeader title={t('adminPanel')} subtitle={t('overview')} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title={t('users')} value={String((users.data ?? []).length)} icon={<Users className="h-5 w-5" />} accent="brand" />
        <StatCard title={t('kycReview')} value={String(pendingKyc)} icon={<FileCheck2 className="h-5 w-5" />} accent="amber" />
        <StatCard title={t('loanManagement')} value={String(pendingLoans)} icon={<Landmark className="h-5 w-5" />} accent="emerald" />
        <StatCard title={t('blockedTx')} value={String(blocked)} icon={<Ban className="h-5 w-5" />} accent="rose" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title={t('fraudAlerts')} icon={<AlertTriangle className="h-5 w-5" />} />
          {fraud.loading ? <Spinner /> : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={fraudData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {fraudData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ffffff20', borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title={t('kycReview')} icon={<FileCheck2 className="h-5 w-5" />} subtitle={lang === 'fa' ? 'در انتظار بررسی' : 'Pending review'} />
          {kyc.loading ? <Spinner /> : (
            <div className="space-y-2">
              {(kyc.data ?? []).slice(0, 5).map((k) => (
                <div key={k.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/15 text-brand-300"><ShieldAlert className="h-4 w-4" /></div>
                    <div>
                      <p className="text-sm font-medium text-white">{k.username || `User #${k.userId}`}</p>
                      <p className="text-[11px] text-slate-400">Level {k.level}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariant(k.status)}>{k.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
