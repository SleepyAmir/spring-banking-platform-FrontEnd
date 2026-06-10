import { Link } from 'react-router-dom';
import {
  ShieldCheck, Zap, LineChart, Languages, ArrowLeft, ArrowRight, LogIn, UserPlus,
  Layers, GitBranch, Database, Radio, Lock, CreditCard, Landmark, Bell,
  Cpu, Boxes, Activity, FileSearch, Github,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Logo } from '@/components/ui/Logo';

/** لندینگ پیج عمومی — معرفی پروژه SpringBank Hybrid Architecture */
export default function LandingPage() {
  const { lang, toggleLang } = useI18n();
  const fa = lang === 'fa';
  const Arrow = fa ? ArrowLeft : ArrowRight;

  const features = [
    {
      icon: Layers,
      fa: ['معماری هیبریدی', 'ترکیب Modular Monolith برای هسته کسب‌وکار و Microservices برای دامنه‌های بحرانی — توسعه سریع + مقیاس‌پذیری مستقل.'],
      en: ['Hybrid Architecture', 'Modular Monolith for the business core plus Microservices for critical domains — fast development with independent scaling.'],
    },
    {
      icon: GitBranch,
      fa: ['الگوی CQRS', 'جداسازی کامل مدل خواندن و نوشتن تراکنش‌ها با دو سرویس مستقل و همگام‌سازی رویدادمحور.'],
      en: ['CQRS Pattern', 'Full read/write separation for transactions with two independent services and event-driven sync.'],
    },
    {
      icon: Radio,
      fa: ['رویدادمحور با RabbitMQ', 'ارتباط ناهمگام بین سرویس‌ها با Fan-out — تشخیص تقلب، تحلیل، حسابرسی و اعلان‌ها بدون وابستگی مستقیم.'],
      en: ['Event-Driven via RabbitMQ', 'Asynchronous fan-out communication — fraud detection, analytics, audit and notifications with zero coupling.'],
    },
    {
      icon: Lock,
      fa: ['امنیت چندلایه', 'JWT (Access + Refresh)، کنترل دسترسی نقش‌محور، CSP ،HSTS، محافظت XSS و Rate Limiting مبتنی بر Redis.'],
      en: ['Multi-layer Security', 'JWT (Access + Refresh), RBAC, CSP, HSTS, XSS protection and Redis-based rate limiting.'],
    },
    {
      icon: ShieldCheck,
      fa: ['تشخیص تقلب و AML', 'موتور قوانین با امتیاز ریسک، هشدارهای پول‌شویی و مسدودسازی هوشمند تراکنش‌های مشکوک.'],
      en: ['Fraud Detection & AML', 'Rule engine with risk scoring, anti-money-laundering alerts and smart blocking of suspicious transactions.'],
    },
    {
      icon: Cpu,
      fa: ['Java 21 + Virtual Threads', 'اسپرینگ‌بوت ۳ با Virtual Threadهای جاوا ۲۱ برای مدیریت میلیون‌ها اتصال همزمان.'],
      en: ['Java 21 + Virtual Threads', 'Spring Boot 3 with Java 21 virtual threads handling millions of concurrent connections.'],
    },
  ];

  const services = [
    { icon: Landmark, port: '8081', fa: 'مونولیت بانکی — کاربر، حساب، کارت، وام، اعلان', en: 'Banking Monolith — User, Account, Card, Loan, Notification' },
    { icon: Activity, port: '8090', fa: 'API Gateway — احراز هویت JWT، مسیریابی، Rate Limit', en: 'API Gateway — JWT auth, routing, rate limiting' },
    { icon: Database, port: '8088', fa: 'Transaction Write — مدل نوشتن CQRS و انتشار رویداد', en: 'Transaction Write — CQRS write model & event publishing' },
    { icon: FileSearch, port: '8087', fa: 'Transaction Read — مدل خواندن با کش Redis', en: 'Transaction Read — read model with Redis caching' },
    { icon: ShieldCheck, port: '8091', fa: 'Fraud Service — موتور قوانین و امتیاز ریسک', en: 'Fraud Service — rule engine & risk scoring' },
    { icon: LineChart, port: '8093', fa: 'Analytics — گزارش‌ها و تجمیع داده‌های مالی', en: 'Analytics — reports & financial aggregation' },
    { icon: Boxes, port: '8092', fa: 'Audit Service — ثبت کامل رد پای عملیات', en: 'Audit Service — complete operation trail' },
  ];

  const stack = [
    'Java 21', 'Spring Boot 3', 'Spring Cloud Gateway', 'Spring Security 6',
    'PostgreSQL 16 ×5', 'Redis 7', 'RabbitMQ 3', 'Docker Compose',
    'MapStruct', 'OpenAPI / Swagger', 'React 18', 'TypeScript', 'Tailwind CSS',
  ];

  const stats = [
    { v: '7+', fa: 'سرویس مستقل', en: 'Services' },
    { v: '5', fa: 'پایگاه‌داده PostgreSQL', en: 'PostgreSQL DBs' },
    { v: '2', fa: 'پنل کاربر و ادمین', en: 'User & Admin panels' },
    { v: '100%', fa: 'رویدادمحور و Dockerized', en: 'Event-driven & Dockerized' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ===== Navbar ===== */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo size={42} />
            <div>
              <p className="text-base font-bold leading-tight text-white">{fa ? 'اسپرینگ‌بانک' : 'SpringBank'}</p>
              <p className="text-[11px] text-brand-300">{fa ? 'معماری هیبریدی' : 'Hybrid Architecture'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="btn-ghost px-3 py-2">
              <Languages className="h-4 w-4" />
              <span className="text-xs">{fa ? 'EN' : 'فا'}</span>
            </button>
            <Link to="/login" className="btn-ghost px-4 py-2">
              <LogIn className="h-4 w-4" /> {fa ? 'ورود' : 'Login'}
            </Link>
            <Link to="/register" className="btn-primary hidden px-4 py-2 sm:inline-flex">
              <UserPlus className="h-4 w-4" /> {fa ? 'ثبت‌نام' : 'Sign up'}
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 start-1/2 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
          <div className="absolute bottom-0 -start-32 h-72 w-72 rounded-full bg-brand-400/15 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="animate-fade-in">
            <span className="badge bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
              <Zap className="h-3 w-3" />
              {fa ? 'Modular Monolith + Microservices + CQRS' : 'Modular Monolith + Microservices + CQRS'}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white lg:text-5xl">
              {fa ? (
                <>بانکداری مدرن با <span className="bg-gradient-to-l from-brand-400 to-brand-600 bg-clip-text text-transparent">معماری هیبریدی</span></>
              ) : (
                <>Modern banking on a <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">Hybrid Architecture</span></>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              {fa
                ? 'اسپرینگ‌بانک یک سیستم بانکداری کامل است که هسته‌ی کسب‌وکار را در یک مونولیت مدولار و دامنه‌های بحرانی (تراکنش، تقلب، تحلیل، حسابرسی) را در میکروسرویس‌های مستقل اجرا می‌کند — با CQRS، رویدادمحوری با RabbitMQ و امنیت سازمانی.'
                : 'SpringBank is a complete banking system running its business core as a modular monolith and critical domains (transactions, fraud, analytics, audit) as independent microservices — with CQRS, RabbitMQ event-driven messaging and enterprise-grade security.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/register" className="btn-primary px-6 py-3 text-base">
                {fa ? 'همین حالا شروع کنید' : 'Get started'} <Arrow className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-ghost px-6 py-3 text-base">
                {fa ? 'ورود به پنل' : 'Open dashboard'}
              </Link>
              <a
                href="https://github.com/SleepyAmir"
                target="_blank" rel="noreferrer"
                className="btn-ghost px-4 py-3"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className="card p-4 text-center">
                  <p className="text-2xl font-extrabold text-brand-400">{s.v}</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-400">{fa ? s.fa : s.en}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero logo */}
          <div className="relative hidden items-center justify-center lg:flex">
            <div className="absolute h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="relative grid h-[22rem] w-[22rem] place-items-center rounded-[2.5rem] border border-brand-500/25 bg-white/[0.97] shadow-glow">
              <img src="/logo.png" alt="SpringBank Dragon" className="h-64 w-64 object-contain drop-shadow-2xl" draggable={false} />
            </div>
            <div className="absolute -bottom-4 end-8 card flex items-center gap-2 px-4 py-3">
              <CreditCard className="h-4 w-4 text-brand-400" />
              <span className="text-xs text-slate-300">{fa ? 'انتقال وجه آنی و اتمیک' : 'Instant atomic transfers'}</span>
            </div>
            <div className="absolute -top-2 start-6 card flex items-center gap-2 px-4 py-3">
              <Bell className="h-4 w-4 text-brand-400" />
              <span className="text-xs text-slate-300">{fa ? 'اعلان لحظه‌ای با SSE' : 'Real-time SSE notifications'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">{fa ? 'چرا اسپرینگ‌بانک؟' : 'Why SpringBank?'}</h2>
          <p className="mt-2 text-slate-400">
            {fa ? 'مهندسی‌شده با الگوهای روز دنیای نرم‌افزار' : 'Engineered with modern software architecture patterns'}
          </p>
        </div>
        <div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="card group p-6 transition hover:border-brand-500/40 hover:shadow-glow">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/25 transition group-hover:bg-brand-500/25">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{fa ? f.fa[0] : f.en[0]}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{fa ? f.fa[1] : f.en[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Services / Architecture ===== */}
      <section className="border-y border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white">{fa ? 'سرویس‌های سیستم' : 'System Services'}</h2>
            <p className="mt-2 text-slate-400">
              {fa ? '۷ سرویس Spring Boot + پنج PostgreSQL + Redis + RabbitMQ — همه با یک دستور Docker Compose' : '7 Spring Boot services + 5 PostgreSQL + Redis + RabbitMQ — one Docker Compose command'}
            </p>
          </div>
          <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div key={i} className="card flex items-center gap-4 p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{fa ? s.fa : s.en}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-brand-300">:{s.port}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Tech stack ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">{fa ? 'پشته فناوری' : 'Tech Stack'}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {stack.map((t) => (
            <span key={t} className="rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-2 text-sm text-brand-200">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-20 lg:px-8">
        <div className="card relative overflow-hidden p-10 text-center">
          <div className="pointer-events-none absolute -top-20 start-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
          <Logo size={56} className="mx-auto mb-5 rounded-2xl" />
          <h2 className="text-2xl font-bold text-white lg:text-3xl">
            {fa ? 'آماده‌اید بانکداری مدرن را تجربه کنید؟' : 'Ready to experience modern banking?'}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            {fa
              ? 'با حساب دمو وارد شوید یا ثبت‌نام کنید — پنل کاربر و پنل مدیریت کامل با تشخیص تقلب، وام، کارت و تراکنش.'
              : 'Log in with a demo account or sign up — full user & admin panels with fraud detection, loans, cards and transactions.'}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary px-6 py-3">{fa ? 'ساخت حساب کاربری' : 'Create account'}</Link>
            <Link to="/login" className="btn-ghost px-6 py-3">{fa ? 'ورود' : 'Login'}</Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <Logo size={34} />
            <span className="text-sm font-semibold text-white">{fa ? 'اسپرینگ‌بانک' : 'SpringBank'}</span>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 SpringBank — Hybrid Architecture · {fa ? 'ساخته‌شده با ☕ و ❤️' : 'Made with ☕ & ❤️'}
          </p>
        </div>
      </footer>
    </div>
  );
}
