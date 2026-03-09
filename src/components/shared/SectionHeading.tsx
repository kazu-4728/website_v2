import { cn } from '@/src/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = 'left', className }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={cn('flex flex-col gap-4', alignment, className)}>
      {eyebrow ? <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">{eyebrow}</span> : null}
      <div className="space-y-3">
        <h2 className="max-w-4xl text-balance text-4xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
        {description ? <p className="max-w-3xl text-base leading-7 text-[var(--color-muted)] md:text-lg">{description}</p> : null}
      </div>
    </div>
  );
}
