/**
 * Next.js Configuration for GitHub Pages
 * 
 * basePathは環境変数 NEXT_PUBLIC_BASE_PATH から読み取る
 * - dev: NEXT_PUBLIC_BASE_PATH='' (ローカル開発は / で動作)
 * - prod: NEXT_PUBLIC_BASE_PATH='/website_v2' (GitHub Pages用)
 * 
 * フォールバック:
 * - NEXT_PUBLIC_BASE_PATH が未設定の場合
 *   - 本番環境（GITHUB_ACTIONS=true または NODE_ENV=production）: GITHUB_REPOSITORY から repo名を推定して /{repo} にする
 *   - 開発環境: ''（ルート）固定
 * 
 * .env.local または .env.production で設定すること
 */

// 本番環境かどうかを判定
const isProd = process.env.GITHUB_ACTIONS === 'true' || process.env.NODE_ENV === 'production';

// リポジトリ名を取得（GITHUB_REPOSITORY から抽出、例: "owner/repo" -> "repo"）
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'website_v2';

// basePath の決定: env優先 → 本番時はrepo名から推定 → 開発時は空文字
const basePathEnv = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = basePathEnv ?? (isProd ? `/${repoName}` : '');

export default {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true, // GitHub Pagesの静的エクスポートでは画像最適化は使用できない
  },
};
