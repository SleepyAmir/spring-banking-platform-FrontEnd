import { useEffect, useState } from 'react';
import { FileCheck2, Check, X, Eye, Image as ImageIcon } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { useFetch } from '@/hooks/useFetch';
import { kycApi } from '@/api/services';
import { extractError } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';
import type { KycVerification } from '@/types';

export default function AdminKyc() {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const [filter, setFilter] = useState('');
  const kyc = useFetch(() => kycApi.list(filter || undefined), [filter]);

  const [view, setView] = useState<KycVerification | null>(null);
  const [reject, setReject] = useState<KycVerification | null>(null);
  const [reason, setReason] = useState('');

  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try { await fn(); toast(msg, 'success'); kyc.refetch(); }
    catch (err) { toast(extractError(err), 'error'); }
  };

  // باز کردن جزئیات: ابتدا وضعیت را UNDER_REVIEW می‌کند (اگر لازم بود) و مدارک را نمایش می‌دهد
  const openDetails = async (k: KycVerification) => {
    setView(k);
    if (k.status === 'DOCUMENT_UPLOADED') {
      try { await kycApi.startReview(k.id); kyc.refetch(); } catch { /* noop */ }
    }
  };

  return (
    <div>
      <PageHeader title={t('kycReview')} />
      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          {['', 'DOCUMENT_UPLOADED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn px-3 py-1.5 text-xs ${filter === s ? 'bg-brand-600 text-white' : 'bg-white/5 text-slate-300'}`}>
              {s || (lang === 'fa' ? 'همه' : 'All')}
            </button>
          ))}
        </div>

        <DataTable<KycVerification>
          loading={kyc.loading}
          rows={kyc.data ?? []}
          keyField={(r) => r.id}
          columns={[
            { header: 'ID', cell: (r) => `#${r.id}` },
            { header: t('username'), cell: (r) => <span className="text-white">{r.username || `User #${r.userId}`}</span> },
            { header: 'Level', cell: (r) => <Badge variant="info">{r.level}</Badge> },
            { header: t('status'), cell: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
            { header: t('actions'), cell: (r) => (
              <div className="flex flex-wrap gap-2">
                <button className="btn-ghost px-2.5 py-1.5 text-xs" onClick={() => openDetails(r)}>
                  <Eye className="h-3.5 w-3.5" /> {lang === 'fa' ? 'نمایش مدارک' : 'View docs'}
                </button>
                {(r.status === 'DOCUMENT_UPLOADED' || r.status === 'UNDER_REVIEW') && (
                  <>
                    <button className="btn-primary px-2.5 py-1.5 text-xs" onClick={() => act(() => kycApi.review(r.id, { status: 'APPROVED', approvedLevel: 'STANDARD' }), 'APPROVED')}>
                      <Check className="h-3.5 w-3.5" /> {t('approve')}
                    </button>
                    <button className="btn-danger px-2.5 py-1.5 text-xs" onClick={() => { setReject(r); setReason(''); }}>
                      <X className="h-3.5 w-3.5" /> {t('reject')}
                    </button>
                  </>
                )}
              </div>
            ) },
          ]}
        />
      </Card>

      {/* View documents modal */}
      <Modal open={!!view} onClose={() => setView(null)} title={`${lang === 'fa' ? 'مدارک' : 'Documents'} — ${view?.username || ''}`}
        footer={
          view && (view.status === 'DOCUMENT_UPLOADED' || view.status === 'UNDER_REVIEW') ? (
            <>
              <button className="btn-danger" onClick={() => { setReject(view); setReason(''); setView(null); }}>{t('reject')}</button>
              <button className="btn-primary" onClick={() => { act(() => kycApi.review(view.id, { status: 'APPROVED', approvedLevel: 'STANDARD' }), 'APPROVED'); setView(null); }}>{t('approve')}</button>
            </>
          ) : <button className="btn-ghost" onClick={() => setView(null)}>{t('cancel')}</button>
        }>
        {view && <DocsViewer kyc={view} />}
      </Modal>

      {/* Reject modal */}
      <Modal open={!!reject} onClose={() => setReject(null)} title={t('reject')}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setReject(null)}>{t('cancel')}</button>
            <button className="btn-danger" onClick={() => { if (reject) act(() => kycApi.review(reject.id, { status: 'REJECTED', rejectionReason: reason }), 'REJECTED'); setReject(null); }}>
              {t('reject')}
            </button>
          </>
        }>
        <label className="label">{lang === 'fa' ? 'دلیل رد' : 'Rejection reason'}</label>
        <textarea className="input min-h-[100px]" value={reason} onChange={(e) => setReason(e.target.value)} />
      </Modal>
    </div>
  );
}

function DocsViewer({ kyc }: { kyc: KycVerification }) {
  const { lang } = useI18n();
  const [docs, setDocs] = useState<{ national?: string | null; selfie?: string | null }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let revoke: string[] = [];
    (async () => {
      setLoading(true);
      const [national, selfie] = await Promise.all([
        kycApi.documentObjectUrl(kyc.id, 'national'),
        kycApi.documentObjectUrl(kyc.id, 'selfie'),
      ]);
      revoke = [national, selfie].filter(Boolean) as string[];
      setDocs({ national, selfie });
      setLoading(false);
    })();
    return () => { revoke.forEach((u) => u.startsWith('blob:') && URL.revokeObjectURL(u)); };
  }, [kyc.id]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-white/10 bg-white/5 p-2.5"><p className="text-[11px] text-slate-400">Level</p><p className="font-medium text-white">{kyc.level}</p></div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-2.5"><p className="text-[11px] text-slate-400">Status</p><Badge variant={statusVariant(kyc.status)}>{kyc.status}</Badge></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <DocImage label={lang === 'fa' ? 'کارت ملی' : 'National ID'} url={docs.national} />
        <DocImage label={lang === 'fa' ? 'سلفی' : 'Selfie'} url={docs.selfie} />
      </div>
    </div>
  );
}

function DocImage({ label, url }: { label: string; url?: string | null }) {
  return (
    <div>
      <p className="label">{label}</p>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="block">
          <img src={url} alt={label} className="h-44 w-full rounded-xl border border-white/10 object-cover transition hover:opacity-90" />
        </a>
      ) : (
        <div className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/5 text-slate-500">
          <ImageIcon className="h-7 w-7" />
          <span className="text-xs">بدون فایل</span>
        </div>
      )}
    </div>
  );
}
