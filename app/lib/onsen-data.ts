/**
 * @deprecated This file is deprecated. Use src/features/onsen/repository.ts instead.
 * 
 * Onsen Data Access Layer (Legacy)
 * 
 * This file is kept for backward compatibility but should not be used in new code.
 * Migrate to src/features/onsen/repository.ts for new implementations.
 */

import { OnsenSpot } from './onsen-types';

// Re-export from new structure for backward compatibility
export { getAllOnsens as getAllOnsenSpots } from '../../src/features/onsen/queries';
export { getOnsenBySlug as getOnsenSpot } from '../../src/features/onsen/repository';

/**
 * @deprecated Use getAllOnsens() from src/features/onsen/queries instead
 */
export function getAllOnsenIds(): string[] {
  // This function is kept for backward compatibility but should not be used
  console.warn('getAllOnsenIds() is deprecated. Use getAllOnsens() from src/features/onsen/queries instead.');
  return [];
}

/**
 * @deprecated Use getAllOnsens() from src/features/onsen/queries instead
 */
export function getAllOnsenSlugs(): string[] {
  // This function is kept for backward compatibility but should not be used
  console.warn('getAllOnsenSlugs() is deprecated. Use getAllOnsens() from src/features/onsen/queries instead.');
  return [];
}

/**
 * @deprecated Use getOnsenSpots() from src/features/onsen/queries instead
 */
export function getOnsenSpots(ids: string[]): OnsenSpot[] {
  // This function is kept for backward compatibility but should not be used
  console.warn('getOnsenSpots() is deprecated. Use queries from src/features/onsen/queries instead.');
  return [];
}

/**
 * @deprecated Use getPopularOnsens() from src/features/onsen/queries instead
 */
export function getRecommendedOnsenSpots(limit: number = 5): OnsenSpot[] {
  // This function is kept for backward compatibility but should not be used
  console.warn('getRecommendedOnsenSpots() is deprecated. Use getPopularOnsens() from src/features/onsen/queries instead.');
  return [];
}
