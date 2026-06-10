import { useState } from 'react';
import { ShieldCheck, Upload, Loader2, FileImage } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useFetch } from '@/hooks/useFetch';
import { kycApi } from '@/api/services';
import { extractError } from '@/api/client';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

const steps = ['PENDING', 'DOCUMENT_UPLOADED', 'UNDER_REVIEW', 'APPROVED'];

export default function KycPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const uid = user?.id ?? 2;
  const kyc = useFetch(() => kycApi.byUser(uid), [uid]);

  const [nationalId, setNationalId] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!nationalId || !selfie) { toast(lang === 'fa' ? 'هر دو فایل الزامی است' : 'Both files required', 'error'); return; }
    setLoading(true);
    try {
      await kycApi.uploadDocuments(uid, { nationalId, selfie }, 'STANDARD');
      toast(lang === 'fa' ? 'مدارک بارگذاری شد' : 'Documents uploaded', 'success');
      kyc.refetch();
    } catch (err) {
      toast(extractError(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = kyc.data ? steps.indexOf(kyc.data.status === 'REJECTED' ? 'DOCUMENT_UPLOADED' : kyc.data.status) : 0;

  return (
    <div>
      <PageHeader title={t('kyc')} subtitle={lang === 'fa' ? 'احراز هویت برای افزایش سقف تراکنش' : 'Verify identity to raise limits'} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={t('uploadDocs')} icon={<ShieldCheck className="h-5 w-5" />} />
          {kyc.loading ? <Spinner /> : (
            <>
              {/* Stepper */}
              <div className="mb-6 flex items-center">
                {steps.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center">
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${i <= currentStep ? 'bg-brand-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-brand-600' : 'bg-slate-700'}`} />}
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FileBox label={t('nationalId')} file={nationalId} onChange={setNationalId} />
                <FileBox label={t('selfie')} file={selfie} onChange={setSelfie} />
              </div>

              <button onClick={upload} disabled={loading} className="btn-primary mt-5 w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {t('uploadDocs')}
              </button>
            </>
          )}
        </Card>

        <Card>
          <CardHeader title={t('kycStatus')} icon={<ShieldCheck className="h-5 w-5" />} />
          {kyc.loading ? <Spinner /> : kyc.data ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{t('status')}</span>
                <Badge variant={statusVariant(kyc.data.status)}>{kyc.data.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Level</span>
                <Badge variant="info">{kyc.data.level}</Badge>
              </div>
              {kyc.data.dailyTransferLimit && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <p className="text-slate-400">{lang === 'fa' ? 'سقف روزانه' : 'Daily limit'}</p>
                  <p className="font-semibold text-white">{kyc.data.dailyTransferLimit.toLocaleString()} تومان</p>
                </div>
              )}
              {kyc.data.rejectionReason && (
                <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">{kyc.data.rejectionReason}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">{lang === 'fa' ? 'هنوز احراز هویت نکرده‌اید.' : 'Not verified yet.'}</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function FileBox({ label, file, onChange }: { label: string; file: File | null; onChange: (f: File | null) => void }) {
  return (
    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center transition hover:border-brand-500/50 hover:bg-brand-500/5">
      <FileImage className="h-8 w-8 text-brand-300" />
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <span className="text-[11px] text-slate-500">{file ? file.name : 'JPG / PNG / PDF'}</span>
      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </label>
  );
}
