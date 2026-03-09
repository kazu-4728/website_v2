import type { ImageAsset } from '@/src/content/schema/site';
import { withBasePath } from '@/src/lib/base-path';

export function getImageSrc(asset: ImageAsset): string {
  if (asset.localPath) {
    return withBasePath(asset.localPath);
  }

  return asset.remoteUrl ?? '';
}
