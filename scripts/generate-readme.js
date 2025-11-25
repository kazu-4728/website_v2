#!/usr/bin/env node
/**
 * README自動生成スクリプト
 * サイト設定とコンテンツデータからREADMEを生成
 * バージョン: 2.1 (Sitemap & Sitemap Tree対応)
 */

const fs = require('fs');
const path = require('path');

// 設定とデータを読み込み
function loadConfig() {
  try {
    // package.jsonから情報取得
    const packageJsonPath = path.join(__dirname, '../package.json');
    let packageJson = {};
    if (fs.existsSync(packageJsonPath)) {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    }
    
    // JSONテーマファイルを読み込み
    const themeName = process.env.NEXT_PUBLIC_THEME || 'github-docs';
    const contentPath = path.join(__dirname, `../themes/${themeName}/content.json`);
    
    let content = {};
    if (fs.existsSync(contentPath)) {
      content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
    } else {
      console.warn(`Warning: Theme content file not found at ${contentPath}`);
    }

    // 統計情報の抽出
    const docs = content.pages?.docs || [];
    const blogPosts = content.pages?.blog?.posts || [];
    const topics = docs.length;
    const posts = blogPosts.length;
    
    // サイトマップツリーの生成
    let siteMapTree = '';
    const navigation = content.navigation || [];
    
    navigation.forEach((nav) => {
      siteMapTree += `- [${nav.label}](${nav.href})\n`;
      
      // Docsの子要素
      if (nav.href === '/docs' && docs.length > 0) {
        docs.forEach((doc) => {
           siteMapTree += `  - [${doc.title}](/docs/${doc.slug})\n`;
        });
      }
      
      // Blogの子要素
      if (nav.href === '/blog' && blogPosts.length > 0) {
        blogPosts.forEach((post) => {
           siteMapTree += `  - [${post.title}](/blog/${post.slug})\n`;
        });
      }
    });

    const totalPages = 5 + topics + posts; // 概算

    return {
      siteName: content.site?.name || 'Code Voyage',
      description: content.site?.description || 'Mastering GitHub',
      topics,
      posts,
      totalPages,
      siteMapTree,
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {},
    };
  } catch (error) {
    console.error('設定の読み込みエラー:', error);
    return { 
      siteName: 'Code Voyage', 
      description: 'Documentation Site',
      topics: 0, 
      posts: 0, 
      totalPages: 0, 
      siteMapTree: '',
      dependencies: {}, 
      devDependencies: {} 
    };
  }
}

// READMEを生成
function generateReadme() {
  const config = loadConfig();
  const repoName = process.env.GITHUB_REPOSITORY || 'your-username/web-site';
  const [owner, repo] = repoName.split('/');
  
  const deployUrl = `https://${owner}.github.io/${repo}/`;
  const actionsUrl = `https://github.com/${repoName}/actions`;
  
  const readme = `# 🚀 ${config.siteName}

[![Deploy to GitHub Pages](https://github.com/${repoName}/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](${actionsUrl})
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Topics](https://img.shields.io/badge/Topics-${config.topics}-blue)
![Posts](https://img.shields.io/badge/Posts-${config.posts}-purple)
![Status](https://img.shields.io/badge/Status-Live-green)

> **${config.description}** - Powered by Next.js 15 & Cinematic UI

## 🌐 ライブデモ

**🔗 [${deployUrl}](${deployUrl})**

最新のデプロイ状況: [GitHub Actions](${actionsUrl})

---

## 🗺️ サイトマップ

このサイトの構造は \`content.json\` から自動生成されています。

${config.siteMapTree}

---

## ✨ 特徴

### 🎨 Cinematic Design System
- **没入型体験** - 映画のようなストーリーテリングUI
- **完全レスポンシブ** - あらゆるデバイスで美しく表示
- **JSON駆動** - コンテンツとデザインの完全分離
- **ダークモード** - 開発者に最適化された配色

### 🛠️ アーキテクチャ
- **JSON Content Engine** - \`content.json\` を編集するだけでサイト構築
- **Dynamic Routing** - コンテンツに基づいた自動ページ生成
- **Optimized Assets** - Next.js Image による自動最適化
- **Quality Checks** - リンク切れ・画像欠損の自動検知

### 🚀 技術スタック
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0 + Framer Motion
- **Testing**: Vitest

---

## 📊 プロジェクト統計

- **ドキュメント数**: ${config.topics} Chapters
- **ブログ記事数**: ${config.posts} Stories
- **総ページ数**: 約 ${config.totalPages} ページ
- **依存パッケージ**: ${Object.keys(config.dependencies).length} 個

---

## 🏃 クイックスタート

### 必要環境
- Node.js 20以上
- npm または yarn

### インストール

\`\`\`bash
# リポジトリをクローン
git clone https://github.com/${repoName}.git
cd ${repo}

# 依存関係をインストール
npm install
\`\`\`

### 開発サーバー起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### コンテンツの編集

\`themes/github-docs/content.json\` を編集するだけで、サイトの内容が即座に反映されます。

\`\`\`json
{
  "site": {
    "name": "My New Site",
    "description": "Generated by AI Agents"
  },
  "pages": {
    "home": { ... }
  }
}
\`\`\`

---

## 🧪 品質管理

ビルド前に以下のスクリプトが自動実行され、品質を担保します。

\`\`\`bash
npm run check         # 総合チェック
npm run check:images  # 画像リンク切れチェック
npm run check:links   # 内部リンク切れチェック
\`\`\`

---

## 📁 プロジェクト構造

\`\`\`
web-site/
├── .github/
│   └── workflows/          # CI/CD設定
├── app/
│   ├── components/     # UIコンポーネント (Cinematic UI)
│   │   ├── home/       # ホーム専用コンポーネント
│   │   └── ui/         # 汎用パーツ
│   ├── lib/            # コンテンツローダー (JSON処理)
│   ├── docs/           # ドキュメントページ (動的生成)
│   └── page.tsx        # エントリポイント
├── themes/             # テーマ定義
│   └── github-docs/    # デフォルトテーマ
│       └── content.json # コンテンツのすべて
├── scripts/            # チェック・生成スクリプト
└── README.md               # このファイル (自動生成)
\`\`\`

---

## 🤝 貢献

貢献を歓迎します！
新しいテーマの作成、コンポーネントの追加、バグ修正など、Pull Requestをお待ちしています。

---

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下でライセンスされています。

---

*このREADMEは自動生成されています。変更は \`scripts/generate-readme.js\` を編集してください。*

*最終更新: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}*
`;

  return readme;
}

// メイン処理
function main() {
  console.log('📝 README生成中...');
  
  const readme = generateReadme();
  const outputPath = path.join(__dirname, '../README.md');
  
  try {
    fs.writeFileSync(outputPath, readme, 'utf-8');
    console.log('✅ README生成完了:', outputPath);
  } catch (err) {
    console.error('❌ README書き込みエラー:', err);
    process.exit(1);
  }
}

main();
