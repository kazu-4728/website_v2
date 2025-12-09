'use client';

interface GoogleMapProps {
  /**
   * 緯度 (Latitude)
   */
  lat: number;
  /**
   * 経度 (Longitude)
   */
  lng: number;
  /**
   * マップの高さ (Map height in pixels)
   * @default 400
   */
  height?: number;
  /**
   * ズームレベル (Zoom level, 1-20)
   * @default 15
   */
  zoom?: number;
  /**
   * マーカーのラベル (Marker label)
   */
  label?: string;
  /**
   * マップのタイトル (Map title for accessibility)
   */
  title?: string;
}

/**
 * Google Map 埋め込みコンポーネント
 * 
 * Google Maps Embed API を使用して地図を埋め込みます。
 * 静的エクスポート環境でも動作するように、iframe を使用しています。
 * 
 * @example
 * ```tsx
 * <GoogleMap 
 *   lat={35.2333} 
 *   lng={139.1033} 
 *   label="箱根温泉" 
 *   title="箱根温泉の位置"
 * />
 * ```
 */
export function GoogleMap({
  lat,
  lng,
  height = 400,
  zoom = 15,
  label,
  title = '地図',
}: GoogleMapProps) {
  // Google Maps Embed API URL を生成
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${lat},${lng}&zoom=${zoom}`;

  // API キーがない場合は、Google Maps の検索URLにフォールバック
  const fallbackUrl = `https://www.google.com/maps?q=${lat},${lng}&hl=ja&z=${zoom}`;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-dark-800">
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <iframe
          width="100%"
          height={height}
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          title={title}
          aria-label={title}
        />
      ) : (
        <div className="relative" style={{ height: `${height}px` }}>
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
            <div className="text-center p-8">
              <p className="text-gray-400 mb-4">地図を表示するには Google Maps API キーが必要です</p>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Google マップで開く
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 座標から Google Maps の検索URLを生成
 * API キーがない場合のフォールバック用
 */
export function getGoogleMapsSearchUrl(lat: number, lng: number, label?: string): string {
  const query = label ? `${label},${lat},${lng}` : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
