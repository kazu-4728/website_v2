const isProduction = process.env.NODE_ENV === 'production';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? (isProduction ? '/website_v2' : '');

export default {
  output: 'export',
  trailingSlash: true,
  basePath: base,
  assetPrefix: base,
  images: {
    unoptimized: true,
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
