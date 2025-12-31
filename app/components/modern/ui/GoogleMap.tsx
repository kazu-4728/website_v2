import React from 'react';

interface GoogleMapProps {
    lat: number;
    lng: number;
    label?: string;
    title?: string;
    height?: number;
    className?: string;
}

export function GoogleMap({
    lat,
    lng,
    label,
    title = 'Map',
    height = 400,
    className = ''
}: GoogleMapProps) {
    // Using Google Maps Embed API or similar simple iframe approach for now
    // Note: This is a basic implementation. For production, a proper API key and Maps JS API might be better.
    // Using openstreetmap for a free alternative if no API key is available, or just a placeholder if prefer.
    // Given the previous code likely used Google Maps, I'll simulate a map container.

    // Since we don't have the API key in this context, I'll use a placeholder or OpenStreetMap export embed for robustness/free usage
    // to ensure it renders something.

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;

    return (
        <div className={`rounded-xl overflow-hidden bg-dark-800 ${className}`} style={{ height }}>
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={mapUrl}
                title={title}
                className="w-full h-full"
            />
            <div className="bg-dark-900/80 p-2 text-xs text-center">
                <a
                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300"
                >
                    {label ? `${label}を大きな地図で見る` : '大きな地図で見る'}
                </a>
            </div>
        </div>
    );
}
