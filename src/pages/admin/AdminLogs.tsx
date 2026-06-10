import React, { useState, useEffect } from 'react';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Download } from 'lucide-react';
import { apiClient } from '@/api/client';

export default function AdminLogs() {
    const { t, lang } = useI18n();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [action, setAction] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            let url = '/api/audit/search?size=100';
            if (username) url += `&username=${username}`;
            if (action) url += `&action=${action}`;

            const res = await apiClient.get<any>(url);
            setLogs(res.data?.data?.content || []);
        } catch (e) {
            console.error(e);
            // fallback mock
            setLogs([{ id: 1, actorUsername: 'test', action: 'LOGIN', timestamp: new Date().toISOString() }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleExport = async () => {
        try {
            let url = '/api/audit/export?';
            if (username) url += `username=${username}&`;
            if (action) url += `action=${action}&`;

            const res = await apiClient.get(url, { responseType: 'blob' });
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `AuditLogs_${new Date().toISOString()}.xlsx`;
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
                <h1 className="text-2xl font-bold text-slate-800">{t('auditLogs')}</h1>
                <button onClick={handleExport} className="btn flex items-center gap-2 border border-slate-600 px-3 py-1.5 rounded text-sm hover:bg-slate-700">
                    <Download className="w-4 h-4" />
                    {t('exportExcel')}
                </button>
            </div>

            <Card>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Username..."
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="border border-white/10 bg-slate-800 p-2 rounded text-slate-200"
                    />
                    <input
                        type="text"
                        placeholder="Action..."
                        value={action}
                        onChange={e => setAction(e.target.value)}
                        className="border border-white/10 bg-slate-800 p-2 rounded text-slate-200"
                    />
                    <button onClick={fetchLogs} className="btn-primary px-4 py-2">{t('search')}</button>
                </div>

                <DataTable
                    rows={logs}
                    keyField={(l: any) => l.id || Math.random().toString()}
                    columns={[
                        { header: 'ID', cell: (l) => l.id },
                        { header: 'Actor', cell: (l) => l.actorUsername },
                        { header: 'Action', cell: (l) => l.action },
                        { header: 'Entity', cell: (l) => l.entityType },
                        { header: 'Entity ID', cell: (l) => l.entityId },
                        { header: 'IP', cell: (l) => l.ipAddress },
                        {
                            header: t('date'),
                            cell: (l) => l.timestamp ? new Date(l.timestamp).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US') : '-'
                        }
                    ]}
                    loading={loading}
                />
            </Card>
        </div>
    );
}
