import React from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    // Simple renderer that splits by double newlines to create paragraphs
    // This is a temporary solution to resolve build errors without react-markdown
    const paragraphs = content.split(/\n\n+/);

    return (
        <div className={`prose prose-invert max-w-none ${className}`}>
            {paragraphs.map((paragraph, index) => {
                // Very basic header detection
                if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold mb-4">{paragraph.replace('# ', '')}</h1>;
                }
                if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mb-3 mt-6">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold mb-2 mt-4">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').map(line => line.replace('- ', ''));
                    return (
                        <ul key={index} className="list-disc pl-5 mb-4">
                            {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    );
                }

                return <p key={index} className="mb-4 leading-relaxed text-gray-300">{paragraph}</p>;
            })}
        </div>
    );
}
