/**
 * UI Layer: Area Filter Component
 * 
 * エリアフィルタ
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface AreaFilterProps {
  areas: string[];
  selectedArea?: string;
}

export function AreaFilter({ areas, selectedArea }: AreaFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAreaChange = (area: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (area) {
      params.set('area', area);
    } else {
      params.delete('area');
    }
    router.push(`/onsen?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => handleAreaChange(undefined)}
        className={`px-4 py-2 rounded-full transition-colors ${
          !selectedArea
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        すべて
      </button>
      {areas.map((area) => (
        <button
          key={area}
          onClick={() => handleAreaChange(area)}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedArea === area
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {area}
        </button>
      ))}
    </div>
  );
}
