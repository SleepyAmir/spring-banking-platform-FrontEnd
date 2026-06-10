import { useMemo, useState } from 'react';
import { ArrowLeftRight, Search } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useFetch } from '@/hooks/useFetch';
import { txApi } from '@/api/services';
import { formatMoney, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/PageHeader';
import type { Transaction } from '@/types';

export default function TransactionsPage() {
    const { t } = useI18n();
    const { user } = useAuth();
    const uid = user?.id ?? 2;
    const txs = useFetch(() => txApi.byUser(uid), [uid]);
    const [q, setQ] = useState('');
    const [type, setType] = useState('ALL');

    const rows = useMemo(() => {
        let list = txs.data ?? [];
        if (type !== 'ALL') list = list.filter((r) => r.type === type);
        if (q) list = list.filter((r) => r.trackingCode.toLowerCase().includes(q.toLowerCase()));
        return list;
    }, [txs.data, q, type]);

    const types = ['ALL', 'DEPOSIT', 'TRANSFER', 'WITHDRAWAL', 'CARD_PAYMENT', 'LOAN_DISBURSEMENT', 'LOAN_PAYMENT'];

    return (
        <div>
            <PageHeader title={t('transactions')} />
            <Card>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" style={{ insetInlineStart: '12px' }} />
                        <input className="input ps-9" placeholder={t('search')} value={q} onChange={(e) => setQ(e.target.value)} />
                    </div>
                    <select className="input w-auto" value={type} onChange={(e) => setType(e.target.value)}>
                        {types.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
                    </select>
                </div>

                <DataTable<Transaction>
                    loading={txs.loading}
                    rows={rows}
                    keyField={(r) => r.trackingCode}
                    columns={[
                        { header: t('trackingCode'), cell: (r) => <span className="font-mono text-xs text-slate-400">{r.trackingCode}</span> },
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
