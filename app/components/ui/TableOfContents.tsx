'use client';

import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

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

  // Parse headings from Markdown content
  const headings: TocItem[] = content
    .split('\n')
    .filter(line => line.startsWith('## ') || line.startsWith('### '))
    .map(line => {
      const level = line.startsWith('## ') ? 2 : 3;
      const text = line.replace(/^#+\s+/, '');
      return {
        id: slugify(text),
        text,
        level
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
      { rootMargin: '-100px 0px -66%' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-2">
      <p className="font-bold text-white mb-4 tracking-widest text-xs uppercase opacity-50">
        On This Page
      </p>
      <ul className="space-y-3 text-sm border-l border-white/10">
        {headings.map((item) => (
          <li key={item.id} className="pl-4 relative">
            <a
              href={`#${item.id}`}
              className={cn(
                "block transition-colors duration-200 hover:text-primary-400",
                activeId === item.id 
                  ? "text-primary-400 font-medium" 
                  : "text-gray-400"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                setActiveId(item.id);
              }}
            >
              {activeId === item.id && (
                <span className="absolute left-0 top-0 w-[2px] h-full bg-primary-500 rounded-full" />
              )}
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
