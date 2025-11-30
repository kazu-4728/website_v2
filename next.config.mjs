const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/web-site';

export default {
  output: 'export',
  trailingSlash: true,
  basePath: base,
  assetPrefix: base,
  images: { 
    unoptimized: true, // GitHub Pagesの静的エクスポートでは画像最適化は使用できない
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/commons/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};
