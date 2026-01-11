/**
 * Next.js Configuration for GitHub Pages
 * 
 * basePathは環境変数 NEXT_PUBLIC_BASE_PATH から読み取る
 * - dev: NEXT_PUBLIC_BASE_PATH='' (ローカル開発は / で動作)
 * - prod: NEXT_PUBLIC_BASE_PATH='/website_v2' (GitHub Pages用)
 * 
 * .env.local または .env.production で設定すること
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true, // GitHub Pagesの静的エクスポートでは画像最適化は使用できない
  },
};
