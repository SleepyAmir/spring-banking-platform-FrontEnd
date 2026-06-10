import React, { useState, useEffect } from 'react';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Download } from 'lucide-react';
import { apiClient } from '@/api/client';

export default function AdminTransactions() {
    const { t, lang } = useI18n();
    const [txs, setTxs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [accountId, setAccountId] = useState('');
    const [status, setStatus] = useState('');

    const fetchTxs = async () => {
        setLoading(true);
        try {
            let url = '/api/transactions/search?size=100';
            if (accountId) url += `&accountId=${accountId}`;
            if (status) url += `&status=${status}`;

            const res = await apiClient.get<any>(url);
            setTxs(res.data?.data?.content || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTxs();
    }, []);

    const handleExport = async () => {
        try {
            let url = '/api/transactions/export?';
            if (accountId) url += `accountId=${accountId}&`;
            if (status) url += `status=${status}&`;

            const res = await apiClient.get(url, { responseType: 'blob' });
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `Transactions_${new Date().toISOString()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            console.error('Export failed', e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">{t('adminTransactions')}</h1>
                <button onClick={handleExport} className="btn flex items-center gap-2 border border-slate-600 px-3 py-1.5 rounded text-sm hover:bg-slate-700">
                    <Download className="w-4 h-4" />
                    {t('exportExcel')}
                </button>
            </div>

            <Card>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Account ID..."
                        value={accountId}
                        onChange={e => setAccountId(e.target.value)}
                        className="border border-white/10 bg-slate-800 p-2 rounded text-slate-200"
                    />
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="border border-white/10 bg-slate-800 p-2 rounded text-slate-200"
                    >
                        <option value="">All Statuses</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="BLOCKED">BLOCKED</option>
                        <option value="FAILED">FAILED</option>
                    </select>
                    <button onClick={fetchTxs} className="btn-primary px-4 py-2">{t('search')}</button>
                </div>

                <DataTable
                    rows={txs}
                    keyField={(tx: any) => tx.id || Math.random().toString()}
                    columns={[
                        { header: 'ID', cell: (tx) => tx.id },
                        { header: t('type'), cell: (tx) => tx.type },
                        { header: t('amount'), cell: (tx) => tx.amount },
                        { header: t('from'), cell: (tx) => tx.fromAccountId },
                        { header: t('to'), cell: (tx) => tx.toAccountId },
                        { header: t('status'), cell: (tx) => tx.status },
                        {
                            header: t('date'),
                            cell: (tObj) => tObj.createdAt ? new Date(tObj.createdAt).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US') : '-'
                        }
                    ]}
                    loading={loading}
                />
            </Card>
        </div>
    );
}
