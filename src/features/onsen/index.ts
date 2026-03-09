import {
  loadAllOnsens,
  loadAllOnsenSpots,
  loadComparisonOnsens,
  loadFeaturedOnsens,
  loadOnsenBySlug,
  loadOnsenSpot,
  type LoadedOnsen,
} from '@/src/content/loaders/onsen';

export async function getOnsens(filters?: {
  area?: string;
  spring?: string;
  effect?: string;
  dayTrip?: string;
  travel?: string;
}) {
  const onsens = await loadAllOnsens();
  if (!filters) return onsens;

  return onsens.filter((onsen) => {
    if (filters.area && onsen.identity.area !== filters.area) return false;
    if (filters.spring && !onsen.spring.springTypes.some((spring) => spring.includes(filters.spring!))) return false;
    if (filters.effect && !onsen.spring.effects.some((effect) => effect.includes(filters.effect!))) return false;
    if (filters.dayTrip === 'yes' && !onsen.stay.dayTripAvailable) return false;
    if (filters.travel && onsen.metrics.bestTravelTime && onsen.metrics.bestTravelTime > Number(filters.travel)) return false;
    return true;
  });
}

export async function getOnsenOptions() {
  const onsens = await loadAllOnsens();
  const areas = Array.from(new Set(onsens.map((onsen) => onsen.identity.area))).sort();
  const springs = Array.from(new Set(onsens.flatMap((onsen) => onsen.spring.springTypes))).sort();
  const effects = Array.from(new Set(onsens.flatMap((onsen) => onsen.spring.effects))).sort();

  return { areas, springs, effects };
}

export async function getFeaturedOnsens() {
  return loadFeaturedOnsens();
}

export async function getComparisonOnsens() {
  return loadComparisonOnsens();
}

export async function getOnsen(slug: string) {
  return loadOnsenBySlug(slug);
}

export async function getOnsenSpot(parentSlug: string, spotSlug: string) {
  return loadOnsenSpot(parentSlug, spotSlug);
}

export async function getOnsenSpots() {
  return loadAllOnsenSpots();
}

export async function getRelatedOnsens(current: LoadedOnsen) {
  const onsens = await loadAllOnsens();
  return onsens
    .filter((onsen) => onsen.identity.slug !== current.identity.slug)
    .sort((a, b) => {
      const aScore = scoreRelatedness(current, a);
      const bScore = scoreRelatedness(current, b);
      return bScore - aScore;
    })
    .slice(0, 3);
}

function scoreRelatedness(current: LoadedOnsen, candidate: LoadedOnsen) {
  let score = 0;
  if (current.identity.area === candidate.identity.area) score += 4;
  if (current.identity.prefecture === candidate.identity.prefecture) score += 2;
  score += candidate.spring.springTypes.filter((spring) => current.spring.springTypes.includes(spring)).length * 2;
  score += candidate.spring.effects.filter((effect) => current.spring.effects.includes(effect)).length;
  return score;
}
