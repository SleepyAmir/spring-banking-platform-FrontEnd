import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogIn, FlaskConical } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { AuthShell } from './AuthShell';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { extractError, setMock, isMock } from '@/api/client';

export default function LoginPage() {
  const { t, lang } = useI18n();
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mock, setMockState] = useState(isMock());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const role = await login(username, password);
      toast(t('loginSuccess'), 'success');
      navigate(role === 'CUSTOMER' ? '/app' : '/admin');
    } catch (err) {
      toast(extractError(err, 'ورود ناموفق بود'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMock = () => {
    const next = !mock;
    setMock(next);
    setMockState(next);
    toast(next ? t('mockOn') : t('mockOff'), 'info');
  };

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <AuthShell>
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <Logo size={44} />
        <span className="text-lg font-bold">{t('appName')}</span>
      </div>

      <h2 className="text-2xl font-bold text-white">{t('login')}</h2>
      <p className="mt-1 text-sm text-slate-400">{t('welcomeBack')} 👋</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="label">{t('username')}</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="customer" autoFocus required />
        </div>
        <div>
          <label className="label">{t('password')}</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {t('login')}
        </button>
      </form>

      {/* Demo mode */}
      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <FlaskConical className="h-4 w-4 text-amber-400" />
            {t('demoMode')}
          </div>
          <button onClick={toggleMock} className={`relative h-6 w-11 rounded-full transition ${mock ? 'bg-brand-600' : 'bg-slate-600'}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${mock ? 'start-0.5 translate-x-0' : 'start-0.5'}`} style={{ insetInlineStart: mock ? '22px' : '2px' }} />
          </button>
        </div>
        {mock && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <button onClick={() => quickFill('customer', 'customer123')} className="btn-ghost py-1.5">customer</button>
            <button onClick={() => quickFill('manager', 'manager123')} className="btn-ghost py-1.5">manager</button>
            <button onClick={() => quickFill('admin', 'admin123')} className="btn-ghost py-1.5">admin</button>
          </div>
        )}
        <p className="mt-2 text-[11px] text-slate-500">
          {lang === 'fa'
            ? 'حالت دمو با داده‌ی نمونه کار می‌کند (نیازی به اجرای بک‌اند نیست).'
            : 'Demo mode works with sample data (no backend needed).'}
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        {t('noAccount')}{' '}
        <Link to="/register" className="font-medium text-brand-400 hover:text-brand-300">{t('register')}</Link>
      </p>
    </AuthShell>
  );
}
