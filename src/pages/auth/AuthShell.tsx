import type { ReactNode } from 'react';
import { Languages, ShieldCheck, Zap, LineChart } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Logo } from '@/components/ui/Logo';

/** قاب مشترک صفحات ورود/ثبت‌نام: نیمه‌ی تبلیغاتی + نیمه‌ی فرم. */
export function AuthShell({ children }: { children: ReactNode }) {
  const { t, toggleLang, lang } = useI18n();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand side */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/30 via-slate-950 to-slate-950" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-brand-700/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <Logo size={48} className="rounded-2xl" />
          <span className="text-xl font-bold text-white">{t('appName')}</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight text-white">
            {t('tagline')}
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            {lang === 'fa'
              ? 'پلتفرم بانکی مدرن با معماری میکروسرویس، CQRS و تشخیص تقلب هوشمند.'
              : 'A modern banking platform with microservices, CQRS and smart fraud detection.'}
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: ShieldCheck, fa: 'امنیت چندلایه و احراز هویت KYC', en: 'Multi-layer security & KYC' },
              { icon: Zap, fa: 'انتقال وجه آنی و اتمیک', en: 'Instant atomic transfers' },
              { icon: LineChart, fa: 'تحلیل مالی و تشخیص تقلب', en: 'Financial analytics & fraud detection' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-200">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4 text-brand-300" />
                </div>
                {lang === 'fa' ? f.fa : f.en}
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-slate-500">© 2026 SpringBank — Hybrid Architecture</div>
      </div>

      {/* Form side */}
      <div className="relative flex items-center justify-center p-6">
        <button onClick={toggleLang} className="btn-ghost absolute end-6 top-6 px-3 py-2">
          <Languages className="h-4 w-4" /> {lang === 'fa' ? 'EN' : 'فا'}
        </button>
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </div>
    </div>
  );
}
