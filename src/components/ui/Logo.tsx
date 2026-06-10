import { cn } from '@/lib/utils';

/** لوگوی اختصاصی اژدهای سبز 🐉 — فایل در public/logo.png */
export function Logo({ size = 40, className, boxed = true }: {
  size?: number;
  className?: string;
  boxed?: boolean;
}) {
  return (
    <div
      className={cn(
        boxed && 'grid place-items-center rounded-xl bg-white/95 shadow-glow ring-1 ring-brand-500/30',
        className,
      )}
      style={boxed ? { height: size, width: size } : undefined}
    >
      <img
        src="/logo.png"
        alt="SpringBank Dragon Logo"
        style={{ height: boxed ? size * 0.78 : size, width: 'auto' }}
        className="select-none"
        draggable={false}
      />
    </div>
  );
}
