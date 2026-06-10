import { useMemo, useState } from 'react';
import { Users, Search } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useFetch } from '@/hooks/useFetch';
import { adminApi } from '@/api/services';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/PageHeader';
import type { User } from '@/types';

export default function AdminUsers() {
  const { t } = useI18n();
  const users = useFetch(() => adminApi.users(), []);
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const list = users.data ?? [];
    if (!q) return list;
    return list.filter((u) => `${u.username} ${u.email} ${u.firstName} ${u.lastName}`.toLowerCase().includes(q.toLowerCase()));
  }, [users.data, q]);

  return (
    <div>
      <PageHeader title={t('users')} />
      <Card>
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" style={{ insetInlineStart: '12px' }} />
          <input className="input ps-9" placeholder={t('search')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <DataTable<User>
          loading={users.loading}
          rows={rows}
          keyField={(r) => r.id}
          columns={[
            { header: 'ID', cell: (r) => <span className="text-slate-400">#{r.id}</span> },
            { header: t('username'), cell: (r) => <span className="font-medium text-white">{r.username}</span> },
            { header: 'نام', cell: (r) => `${r.firstName ?? ''} ${r.lastName ?? ''}` },
            { header: t('email'), cell: (r) => <span className="text-slate-400">{r.email}</span> },
            { header: 'نقش', cell: (r) => (r.roles ?? []).map((role) => <Badge key={role} variant="info" className="me-1">{role}</Badge>) },
            { header: t('status'), cell: (r) => <Badge variant={r.enabled ? 'success' : 'danger'}>{r.enabled ? 'ACTIVE' : 'DISABLED'}</Badge> },
          ]}
        />
      </Card>
    </div>
  );
}
