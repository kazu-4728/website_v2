import detailedGuidesJson from '../../data/onsen-detailed-guides.json';

export interface OnsenDetailedGuide {
  summary: string;
  planning: string;
  onArrival: string;
  enjoyment: string;
  caution: string;
  seasonalGuide: string;
}

interface DetailedGuidePayload {
  schemaVersion: number;
  generatedAt: string;
  source: string;
  guides: Record<string, OnsenDetailedGuide>;
}

const guideData = detailedGuidesJson as DetailedGuidePayload;

export function getOnsenDetailedGuide(slug: string): OnsenDetailedGuide | undefined {
  return guideData.guides[slug];
}
