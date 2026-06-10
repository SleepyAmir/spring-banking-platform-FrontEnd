import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut, Menu, X, Globe, Languages, ShieldCheck, User as UserIcon, Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { isMock } from '@/api/client';
import type { NavItem } from './nav';
import { Badge } from '@/components/ui/Badge';

export function AppLayout({ nav, variant, children }: {
  nav: NavItem[];
  variant: 'user' | 'admin';
  children: ReactNode;
}) {
  const { t, toggleLang, lang } = useI18n();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = variant === 'admin';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 z-40 w-72 transform border-e border-white/10 bg-slate-950/80 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0',
          lang === 'fa' ? 'right-0' : 'left-0',
          open ? 'translate-x-0' : lang === 'fa' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-full flex-col p-4">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : '/app'} className="mb-6 flex items-center gap-3 px-2 pt-2">
            <Logo size={40} />
            <div>
              <p className="text-base font-bold leading-tight text-white">{t('appName')}</p>
              <p className="text-[11px] text-slate-400">{isAdmin ? t('adminPanel') : t('userPanel')}</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/app' || item.to === '/admin'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-500/15 text-white shadow-soft ring-1 ring-brand-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <item.icon className="h-[18px] w-[18px]" />
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* User card */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500/20 text-brand-300">
                {isAdmin ? <ShieldCheck className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user?.firstName || user?.username}</p>
                <p className="truncate text-[11px] text-slate-400">{role}</p>
              </div>
              <button onClick={handleLogout} title={t('logout')} className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/15 hover:text-rose-300">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop (mobile) */}
      {open && <div className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-slate-950/60 px-4 py-3 backdrop-blur-xl lg:px-8">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
            <Sparkles className="h-4 w-4 text-brand-400" />
            <span>{t('welcomeBack')}{user ? `، ${user.firstName || user.username}` : ''}</span>
          </div>

          <div className="flex items-center gap-2">
            {isMock() && (
              <Badge variant="warning" className="hidden sm:inline-flex">
                <Globe className="h-3 w-3" /> {t('mockOn')}
              </Badge>
            )}
            <button onClick={toggleLang} className="btn-ghost px-3 py-2">
              <Languages className="h-4 w-4" />
              <span className="text-xs">{lang === 'fa' ? 'EN' : 'فا'}</span>
            </button>
            <button onClick={handleLogout} className="btn-ghost px-3 py-2 sm:hidden">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
