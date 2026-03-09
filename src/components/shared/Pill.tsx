import { cn } from '@/src/lib/utils';

interface PillProps {
  children: React.ReactNode;
  className?: string;
}

export function Pill({ children, className }: PillProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium tracking-wide text-[var(--color-fog)]', className)}>
      {children}
    </span>
  );
}
