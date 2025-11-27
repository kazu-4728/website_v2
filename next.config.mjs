const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/website_v2';

export default {
  output: 'export',
  trailingSlash: true,
  basePath: base,
  assetPrefix: base,
  images: { unoptimized: true },
};
