import Link from 'next/link';
import type { SiteImage } from '../../lib/onsen-site';

interface ImageCreditProps {
  image: SiteImage;
  tone?: 'dark' | 'light';
}

export function ImageCredit({ image, tone = 'dark' }: ImageCreditProps) {
  const isDark = tone === 'dark';

  return (
    <div
      className={`inline-flex max-w-full items-center gap-1 rounded-full px-3 py-1 text-[11px] leading-none backdrop-blur-md ${
        isDark
          ? 'bg-black/55 text-white/85'
          : 'bg-white/75 text-stone-700 ring-1 ring-stone-200'
      }`}
    >
      <span className="truncate">{image.credit}</span>
      <span aria-hidden="true">·</span>
      <Link
        href={image.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 underline underline-offset-2 hover:opacity-80"
      >
        {image.license}
      </Link>
    </div>
  );
}
