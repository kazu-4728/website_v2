/**
 * UI Layer: Area Filter Component
 * 
 * エリアフィルタ
 */

'use client';

import { useState } from 'react';

interface AreaFilterProps {
  areas: string[];
  selectedArea?: string;
  onAreaChange: (area: string | undefined) => void;
}

export function AreaFilter({ areas, selectedArea, onAreaChange }: AreaFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onAreaChange(undefined)}
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
          onClick={() => onAreaChange(area)}
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
