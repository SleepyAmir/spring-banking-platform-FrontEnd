import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}
interface ToastValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastValue | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

  const toast = (message: string, type: ToastType = 'info') => {
    const id = ++idCounter;
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => remove(id), 4000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((tst) => (
          <div
            key={tst.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-glow backdrop-blur-xl animate-fade-in max-w-md w-full',
              tst.type === 'success' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
              tst.type === 'error' && 'border-rose-500/30 bg-rose-500/10 text-rose-200',
              tst.type === 'info' && 'border-brand-500/30 bg-brand-500/10 text-brand-100',
            )}
          >
            {tst.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0" />}
            {tst.type === 'error' && <XCircle className="h-5 w-5 shrink-0" />}
            {tst.type === 'info' && <Info className="h-5 w-5 shrink-0" />}
            <span className="flex-1">{tst.message}</span>
            <button onClick={() => remove(tst.id)} className="opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
