import React from 'react';

interface ImageMetadata {
    credit?: string;
    sourceUrl?: string;
    license?: string;
    [key: string]: any;
}

interface ImageCreditProps {
    metadata?: ImageMetadata | null;
    position?: 'bottom-right' | 'bottom-left';
    className?: string;
}

export function ImageCredit({ metadata, position = 'bottom-right', className = '' }: ImageCreditProps) {
    if (!metadata || !metadata.credit) return null;

    // Default bottom-right
    let positionClasses = 'bottom-2 right-2';
    if (position === 'bottom-left') {
        positionClasses = 'bottom-2 left-2';
    }

    return (
        <div className={`absolute ${positionClasses} z-10 ${className}`}>
            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80">
                {metadata.sourceUrl ? (
                    <a
                        href={metadata.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors flex items-center gap-1"
                    >
                        <span>📷 {metadata.credit}</span>
                        {metadata.license && <span className="opacity-75">({metadata.license})</span>}
                    </a>
                ) : (
                    <span className="flex items-center gap-1">
                        <span>📷 {metadata.credit}</span>
                        {metadata.license && <span className="opacity-75">({metadata.license})</span>}
                    </span>
                )}
            </div>
        </div>
    );
}
