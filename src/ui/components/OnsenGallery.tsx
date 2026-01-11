/**
 * UI Layer: Onsen Gallery Component
 * 
 * 画像スロット表示（hero/onsen/rooms/cuisine/gallery-01..04）
 */

import { OnsenImageSlots } from '../../../src/domain/onsen/types';
import { withBasePath } from '../../../app/lib/base-path';

interface OnsenGalleryProps {
  images: OnsenImageSlots;
  onsenName: string;
}

const SLOT_LABELS: Record<keyof OnsenImageSlots, string> = {
  hero: 'メイン画像',
  onsen: '温泉',
  rooms: '客室',
  cuisine: '料理',
  'gallery-01': 'ギャラリー1',
  'gallery-02': 'ギャラリー2',
  'gallery-03': 'ギャラリー3',
  'gallery-04': 'ギャラリー4',
};

export function OnsenGallery({ images, onsenName }: OnsenGalleryProps) {
  const slots = [
    { key: 'hero' as const, label: SLOT_LABELS.hero },
    { key: 'onsen' as const, label: SLOT_LABELS.onsen },
    { key: 'rooms' as const, label: SLOT_LABELS.rooms },
    { key: 'cuisine' as const, label: SLOT_LABELS.cuisine },
    { key: 'gallery-01' as const, label: SLOT_LABELS['gallery-01'] },
    { key: 'gallery-02' as const, label: SLOT_LABELS['gallery-02'] },
    { key: 'gallery-03' as const, label: SLOT_LABELS['gallery-03'] },
    { key: 'gallery-04' as const, label: SLOT_LABELS['gallery-04'] },
  ];

  const availableImages = slots.filter((slot) => images[slot.key]);

  if (availableImages.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableImages.map((slot) => {
        const imageUrl = images[slot.key];
        if (!imageUrl) return null;

        return (
          <div key={slot.key} className="relative group">
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img
                src={withBasePath(imageUrl)}
                alt={`${onsenName} - ${slot.label}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                <span className="text-white font-medium">{slot.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
