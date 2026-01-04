/**
 * Next.js Configuration for GitHub Pages
 * 
 * dev: basePath='' (ローカル開発は / で動作)
 * prod: basePath='/website_v2' (GitHub Pages用)
 */

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/website_v2' : '';

export default {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true, // GitHub Pagesの静的エクスポートでは画像最適化は使用できない
  },
};
