import { cn } from '../../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
  secondary: 'bg-white/10 text-white border-white/20',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
