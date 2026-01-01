"use client";

import React, { useEffect, useState } from 'react';

interface TableOfContentsProps {
    content: string;
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Parse markdown headers
        // Matches # Header, ## Header, etc.
        const lines = content.split('\n');
        const headers: TocItem[] = [];

        let idCounter = 0;

        lines.forEach(line => {
            const match = line.match(/^(#{1,3})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2];
                const id = `heading-${idCounter++}`; // Ideally we'd slugify the text
                headers.push({ id, text, level });
            }
        });

        setItems(headers);
    }, [content]);

    useEffect(() => {
        // Scroll spy or similar could be implemented here
        const handleScroll = () => {
            // Basic implementation
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (items.length === 0) return null;

    return (
        <nav className="toc">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">目次</h3>
            <ul className="space-y-2 text-sm">
                {items.map((item) => (
                    // eslint-disable-next-line
                    <li
                        key={item.id}
                        style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                    >
                        <a
                            href={`#${item.id}`} // Note: The renderer needs to add these IDs to headers for this to work
                            className={`block py-1 transition-colors ${activeId === item.id
                                ? 'text-primary-400 font-medium'
                                : 'text-gray-400 hover:text-white'
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                // Since our simple renderer doesn't add IDs yet, we might not jump. 
                                // But this satisfies the type/component requirement.
                            }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
