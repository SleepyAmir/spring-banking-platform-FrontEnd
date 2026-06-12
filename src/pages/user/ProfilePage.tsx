import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { User, Mail, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const { t, lang } = useI18n();
  const { user, role } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title={t('profile')} subtitle={lang === 'fa' ? 'اطلاعات کاربری شما' : 'Your personal information'} />
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center text-4xl font-bold mb-4 uppercase ring-4 ring-brand-500/10">
            {user.firstName?.[0] || user.username[0]}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{user.firstName} {user.lastName}</h2>
          <p className="text-slate-400 text-sm mb-4">@{user.username}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {role && <Badge variant="info">{role}</Badge>}
            <Badge variant={user.enabled !== false ? 'success' : 'danger'}>
              {user.enabled !== false ? 'ACTIVE' : 'DISABLED'}
            </Badge>
          </div>
        </Card>

        <Card className="md:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            {lang === 'fa' ? 'جزئیات حساب' : 'Account Details'}
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> ایمیل
                </label>
                <div className="font-medium text-slate-200 bg-slate-800/50 p-2.5 rounded-lg border border-white/5">
                  {user.email || '—'}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> شماره موبایل
                </label>
                <div className="font-medium text-slate-200 bg-slate-800/50 p-2.5 rounded-lg border border-white/5">
                  {user.phoneNumber || '—'}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> نام کاربری
                </label>
                <div className="font-medium text-slate-200 bg-slate-800/50 p-2.5 rounded-lg border border-white/5">
                  {user.username}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> شماره مشتری (User ID)
                </label>
                <div className="font-medium text-slate-200 bg-slate-800/50 p-2.5 rounded-lg border border-white/5 font-mono">
                  #{user.id}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> آدرس ثبت شده
              </label>
              <div className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-white/5">
                {lang === 'fa' ? 'تهران، خیابان ولیعصر، برج نوآوری (نمونه)' : 'Tehran, Valiasr St, Innovation Tower (Demo)'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
