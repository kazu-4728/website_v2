import imageManifestJson from '../../data/onsen-image-manifest.json';
import type { Onsen, SiteImage } from './onsen-site';

export type ImageAssetStatus = 'approved' | 'needs-source' | 'permission-requested' | 'rejected' | 'retired';
export type ImageAssetRole = 'hero' | 'gallery';

interface ImageAsset {
  id: string;
  onsenSlug: string;
  role: ImageAssetRole;
  status: ImageAssetStatus;
  subject: string;
  sourceUrl: string;
  license: string;
  credit?: string;
  localPath?: string;
  reviewedAt: string;
  note: string;
}

interface ImageManifest {
  schemaVersion: number;
  lastReviewed: string;
  assets: ImageAsset[];
}

const imageManifest = imageManifestJson as ImageManifest;

function toSiteImage(asset: ImageAsset): SiteImage {
  if (!asset.localPath || !asset.credit) {
    throw new Error(`Approved image asset ${asset.id} requires localPath and credit.`);
  }

  return {
    src: asset.localPath,
    alt: asset.subject,
    credit: asset.credit,
    license: asset.license,
    sourceUrl: asset.sourceUrl,
  };
}

export function getApprovedImageAssets(onsenSlug: string): ImageAsset[] {
  return imageManifest.assets.filter((asset) => asset.onsenSlug === onsenSlug && asset.status === 'approved');
}

export function getOnsenMedia(onsen: Onsen): {
  hero?: SiteImage;
  gallery: SiteImage[];
  status: 'verified-local' | 'legacy-review-needed' | 'source-pending';
  reviewedAt?: string;
} {
  const approved = getApprovedImageAssets(onsen.slug);
  const approvedHero = approved.find((asset) => asset.role === 'hero');

  if (approvedHero) {
    const hero = toSiteImage(approvedHero);
    const gallery = [hero, ...approved.filter((asset) => asset.id !== approvedHero.id).map(toSiteImage)];
    return {
      hero,
      gallery,
      status: 'verified-local',
      reviewedAt: approvedHero.reviewedAt,
    };
  }

  if (onsen.imageVerified !== false) {
    return {
      hero: onsen.image,
      gallery: onsen.gallery,
      status: 'legacy-review-needed',
    };
  }

  return {
    gallery: [],
    status: 'source-pending',
    reviewedAt: imageManifest.assets.find((asset) => asset.onsenSlug === onsen.slug && asset.role === 'hero')?.reviewedAt,
  };
}
