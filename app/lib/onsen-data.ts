/**
 * Onsen Data Access Layer
 * 
 * Provides type-safe access to the onsen catalog data.
 */

import onsenCatalog from '../../data/onsen-catalog.json';
import { OnsenSpot } from './onsen-types';

// Cast the JSON to a Record of partial OnsenSpot objects
// We use Partial because not all fields might be filled for all entries yet
const CATALOG = onsenCatalog as unknown as Record<string, Partial<OnsenSpot> & { id: string; slug: string }>;

/**
 * Get all onsen IDs
 */
export function getAllOnsenIds(): string[] {
    return Object.keys(CATALOG);
}

/**
 * Get all onsen slugs
 */
export function getAllOnsenSlugs(): string[] {
    return Object.values(CATALOG).map(spot => spot.slug);
}

/**
 * Get a specific onsen spot by ID or Slug
 */
export function getOnsenSpot(idOrSlug: string): OnsenSpot | null {
    // Try direct lookup by ID
    if (CATALOG[idOrSlug]) {
        return CATALOG[idOrSlug] as OnsenSpot;
    }

    // Try lookup by slug
    const spot = Object.values(CATALOG).find(s => s.slug === idOrSlug);
    return (spot as OnsenSpot) || null;
}

/**
 * Get multiple onsen spots by IDs
 */
export function getOnsenSpots(ids: string[]): OnsenSpot[] {
    return ids
        .map(id => getOnsenSpot(id))
        .filter((spot): spot is OnsenSpot => spot !== null);
}

/**
 * Get all onsen spots
 */
export function getAllOnsenSpots(): OnsenSpot[] {
    return Object.values(CATALOG) as OnsenSpot[];
}

/**
 * Get recommended onsen spots (prioritizing those with detailed data)
 */
export function getRecommendedOnsenSpots(limit: number = 5): OnsenSpot[] {
    const all = getAllOnsenSpots();

    // Prioritize spots that have 'onsen' detailed data filled (e.g. springTypes)
    const detailed = all.filter(s => s.onsen && s.onsen.springTypes && s.onsen.springTypes.length > 0);
    const others = all.filter(s => !s.onsen || !s.onsen.springTypes); // simple toggle logic

    // Sort detailed ones by some priority if available, otherwise simplified sort
    // For now, stable sort

    const recommended = [...detailed, ...others];
    return recommended.slice(0, limit);
}
