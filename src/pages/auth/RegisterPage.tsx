import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { authApi } from '@/api/services';
import { extractError } from '@/api/client';

export default function RegisterPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', email: '', firstName: '', lastName: '', phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register(form);
      toast(t('registerSuccess'), 'success');
      navigate('/login');
    } catch (err) {
      toast(extractError(err, 'ثبت‌نام ناموفق بود'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h2 className="text-2xl font-bold text-white">{t('register')}</h2>
      <p className="mt-1 text-sm text-slate-400">{t('tagline')}</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{t('firstName')}</label>
            <input className="input" value={form.firstName} onChange={set('firstName')} />
          </div>
          <div>
            <label className="label">{t('lastName')}</label>
            <input className="input" value={form.lastName} onChange={set('lastName')} />
          </div>
        </div>
        <div>
          <label className="label">{t('username')}</label>
          <input className="input" value={form.username} onChange={set('username')} required placeholder="ali123" />
        </div>
        <div>
          <label className="label">{t('email')}</label>
          <input className="input" type="email" value={form.email} onChange={set('email')} required placeholder="ali@example.com" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{t('phone')}</label>
            <input className="input" value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="0912xxxxxxx" />
          </div>
          <div>
            <label className="label">{t('password')}</label>
            <input className="input" type="password" value={form.password} onChange={set('password')} required placeholder="Passw0rd!" />
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          رمز عبور باید حداقل ۸ کاراکتر و شامل حرف بزرگ، حرف کوچک و عدد باشد.
        </p>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {t('register')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {t('haveAccount')}{' '}
        <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300">{t('login')}</Link>
      </p>
    </AuthShell>
  );
}
