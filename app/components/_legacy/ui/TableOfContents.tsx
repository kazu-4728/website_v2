'use client';

import { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';

interface Props {
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function TableOfContents({ content }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  const headings: TocItem[] = content
    .split('\n')
    .filter((line) => line.startsWith('## ') || line.startsWith('### '))
    .map((line) => {
      const level = line.startsWith('## ') ? 2 : 3;
      const text = line.replace(/^#+\s+/, '');
      return {
        id: slugify(text),
        text,
        level,
      };
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-120px 0px -60%' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-3">
      <p className="section-kicker text-[0.68rem]">On This Page</p>
      <ul className="space-y-3 border-l border-[#dcc9b1] pl-4 text-sm">
        {headings.map((item) => (
          <li key={item.id} className="relative">
            <a
              href={`#${item.id}`}
              className={cn(
                'block leading-6 transition-colors duration-200 hover:text-[#8e6231]',
                activeId === item.id ? 'font-medium text-[#8e6231]' : 'text-[#756354]'
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                setActiveId(item.id);
              }}
            >
              {activeId === item.id && (
                <span className="absolute -left-4 top-0 h-full w-[2px] rounded-full bg-[#bf8748]" />
              )}
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
