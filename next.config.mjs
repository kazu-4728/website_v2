const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/web-site';

export default {
  output: 'export',
  trailingSlash: true,
  basePath: base,
  assetPrefix: base,
  images: { 
    unoptimized: false,
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
