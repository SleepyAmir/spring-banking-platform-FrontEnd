import { useMemo, useState } from 'react';
import { Users, Search, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useFetch } from '@/hooks/useFetch';
import { adminApi } from '@/api/services';
import { extractError } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import type { User } from '@/types';

export default function AdminUsers() {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const users = useFetch(() => adminApi.users(), []);
  const [q, setQ] = useState('');
  const [view, setView] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const act = async (fn: () => Promise<unknown>, msg: string) => {
    setActionLoading(true);
    let success = false;
    try { 
        await fn(); 
        toast(msg, 'success'); 
        users.refetch(); 
        success = true;
    } catch (err) { 
        toast(extractError(err), 'error'); 
    } finally {
        setActionLoading(false);
    }
    return success;
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    const successMsg = lang === 'fa' ? 'وضعیت کاربر با موفقیت تغییر کرد' : 'User status updated successfully';
    const success = await act(() => adminApi.toggleStatus(id, !currentStatus), successMsg);
    if (success && view && view.id === id) {
      setView({ ...view, enabled: !currentStatus });
    }
  };

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
            { header: 'عملیات', cell: (r) => (
                <button onClick={() => setView(r)} className="btn-ghost px-3 py-1 text-xs">مشاهده</button>
            ) },
          ]}
        />
      </Card>

      <Modal open={!!view} onClose={() => setView(null)} title={lang === 'fa' ? 'اطلاعات کاربر' : 'User Details'}>
        {view && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold uppercase">
                {view.firstName?.[0] || view.username[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{view.firstName} {view.lastName}</h3>
                <p className="text-sm text-slate-400">@{view.username}</p>
              </div>
              <div className="ms-auto">
                <Badge variant={view.enabled ? 'success' : 'danger'}>{view.enabled ? 'ACTIVE' : 'DISABLED'}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5">
              <div>
                <span className="block text-xs text-slate-500">ID</span>
                <span className="text-sm text-slate-200">#{view.id}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500">ایمیل</span>
                <span className="text-sm text-slate-200">{view.email || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500">شماره تماس</span>
                <span className="text-sm text-slate-200">{view.phoneNumber || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500">نقش‌ها</span>
                <div className="flex gap-1 mt-1">
                  {(view.roles ?? []).map(r => <Badge key={r} variant="info">{r}</Badge>)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button onClick={() => setView(null)} className="btn-ghost">{t('cancel')}</button>
              {view.enabled ? (
                <button 
                  onClick={() => toggleStatus(view.id, view.enabled!)} 
                  disabled={actionLoading}
                  className="btn-danger flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  مسدود کردن حساب
                </button>
              ) : (
                <button 
                  onClick={() => toggleStatus(view.id, view.enabled!)} 
                  disabled={actionLoading}
                  className="btn-primary flex items-center gap-2 !bg-emerald-600 hover:!bg-emerald-500"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  فعال‌سازی مجدد
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
