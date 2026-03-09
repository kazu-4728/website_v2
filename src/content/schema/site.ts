import { z } from 'zod';

export const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const siteSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  metadata: z.object({
    title: z.string(),
    description: z.string(),
  }),
  navigation: z.array(navItemSchema),
  footer: z.object({
    headline: z.string(),
    description: z.string(),
    note: z.string(),
  }),
  contactPage: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    email: z.string().email(),
    office: z.string(),
    highlights: z.array(z.string()),
  }),
});

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    primaryCta: z.object({
      label: z.string(),
      href: z.string(),
    }),
    secondaryCta: z.object({
      label: z.string(),
      href: z.string(),
    }),
    slides: z.array(
      z.object({
        slug: z.string(),
        kicker: z.string(),
        heading: z.string(),
        description: z.string(),
      })
    ),
  }),
  quickFilters: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
    })
  ),
  areaHighlights: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      slug: z.string(),
    })
  ),
  comparison: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  journal: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  contactCta: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    action: z.object({
      label: z.string(),
      href: z.string(),
    }),
  }),
});

export const onsenIndexSchema = z.object({
  publishedSlugs: z.array(z.string()).min(1),
  featuredSlugs: z.array(z.string()),
  comparisonSlugs: z.array(z.string()),
  highlights: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

export const imageAssetSchema = z
  .object({
    id: z.string(),
    type: z.literal('photo'),
    alt: z.string(),
    localPath: z.string().optional(),
    remoteUrl: z.string().url().optional(),
    source: z.string(),
    credit: z.string(),
    license: z.string(),
    sourceUrl: z.string().url(),
    capturedSubject: z.string(),
    verifiedRealWorld: z.literal(true),
    focus: z.enum(['bath', 'onsen-area', 'area']),
  })
  .refine((value) => Boolean(value.localPath || value.remoteUrl), {
    message: 'Image asset requires localPath or remoteUrl.',
  });

export const imageManifestSchema = z.object({
  assets: z.array(imageAssetSchema),
  onsens: z.record(
    z.string(),
    z.object({
      hero: z.string(),
      gallery: z.array(z.string()).min(1),
      stay: z.string().optional(),
      food: z.string().optional(),
      townscape: z.string().optional(),
    })
  ),
});

const travelLegSchema = z.object({
  time: z.number(),
  route: z.array(z.string()).optional(),
  description: z.string(),
  distance: z.number().optional(),
  icName: z.string().optional(),
  terminal: z.string().optional(),
});

const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

const nearbySpotSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  mapUrl: z.string().url().optional(),
  officialUrl: z.string().url().optional(),
});

const onsenSpotSchema = z.object({
  slug: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string(),
  mapUrl: z.string().url(),
  officialUrl: z.string().url().optional(),
  bookingHint: z.string().optional(),
  placeQuery: z.string().optional(),
  placeId: z.string().optional(),
  googleMapsUri: z.string().url().optional(),
  websiteUri: z.string().url().optional(),
  placePhotoName: z.string().optional(),
  photoUrl: z.string().url().optional(),
  photoStatus: z.enum(['verified', 'area-only', 'missing', 'pending']).default('missing'),
  imageSourceType: z.enum(['google-place', 'official', 'wikimedia', 'r2', 'pending']).default('pending'),
});

export const onsenDetailSchema = z.object({
  identity: z.object({
    slug: z.string(),
    name: z.string(),
    nameEn: z.string(),
    prefecture: z.string(),
    area: z.string(),
  }),
  summary: z.object({
    catchcopy: z.string(),
    lead: z.string(),
    shortDescription: z.string(),
  }),
  highlights: z.array(z.string()).min(3),
  spring: z.object({
    springTypes: z.array(z.string()).min(1),
    ph: z.number().optional(),
    temperature: z.number().optional(),
    flowRate: z.string().optional(),
    effects: z.array(z.string()).min(1),
    characteristics: z.array(z.string()).min(1),
    waterQuality: z.string().optional(),
  }),
  access: z.object({
    nearestStation: z
      .object({
        name: z.string(),
        line: z.string(),
        walkingTime: z.number().optional(),
        busTime: z.number().optional(),
        busName: z.string().optional(),
      })
      .optional(),
    fromTokyo: z.object({
      byTrain: travelLegSchema.optional(),
      byCar: travelLegSchema.optional(),
      byBus: travelLegSchema.optional(),
    }),
    parking: z
      .object({
        available: z.boolean(),
        notes: z.string().optional(),
      })
      .optional(),
    areaMapUrl: z.string().url().optional(),
    officialLinks: z.array(linkSchema).optional(),
  }),
  stay: z.object({
    dayTripAvailable: z.boolean(),
    dayTripFacilities: z.array(z.string()).optional(),
    features: z.array(z.string()),
    style: z.string(),
    bestFor: z.array(z.string()),
  }),
  story: z.object({
    intro: z.string(),
    sections: z.array(
      z.object({
        title: z.string(),
        body: z.array(z.string()).min(1),
      })
    ),
    seasonalNotes: z.array(
      z.object({
        season: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
    modelCourse: z.array(z.string()),
  }),
  onsenSpots: z.array(onsenSpotSchema).default([]),
  nearby: z.array(nearbySpotSchema),
  seoTags: z.array(z.string()),
});

export const journalArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  category: z.string(),
  readTime: z.string(),
  publishedAt: z.string(),
  coverSlug: z.string(),
  relatedSlugs: z.array(z.string()),
  sections: z.array(
    z.object({
      title: z.string(),
      body: z.array(z.string()).min(1),
    })
  ),
});

export type SiteConfig = z.infer<typeof siteSchema>;
export type HomeConfig = z.infer<typeof homeSchema>;
export type OnsenIndexConfig = z.infer<typeof onsenIndexSchema>;
export type ImageAsset = z.infer<typeof imageAssetSchema>;
export type ImageManifest = z.infer<typeof imageManifestSchema>;
export type OnsenDetail = z.infer<typeof onsenDetailSchema>;
export type JournalArticle = z.infer<typeof journalArticleSchema>;

