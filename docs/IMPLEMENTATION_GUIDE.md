# 実装ガイド - ベストプラクティスの適用

このドキュメントは、`BEST_PRACTICES_RECOMMENDATIONS.md` で提案された改善を実際に実装するための具体的な手順を示します。

---

## 🎯 即座に実装可能な改善（クイックウィン）

これらの改善は、1-2時間以内に実装でき、即座に効果が得られます。

### 1. Next.js セキュリティ脆弱性の解消

**所要時間**: 30分  
**難易度**: ⭐☆☆☆☆

```bash
# 1. 最新バージョンに更新
npm install next@latest

# 2. ビルドテスト
npm run build

# 3. 開発サーバーで動作確認
npm run dev

# 4. コミット
git add package.json package-lock.json
git commit -m "security: Update Next.js to fix critical vulnerabilities"
```

**検証方法**:
```bash
npm audit --omit=dev
# critical および high の脆弱性が0になることを確認
```

---

### 2. TypeScript 型安全性の段階的向上

**所要時間**: 1-2時間  
**難易度**: ⭐⭐☆☆☆

#### ステップ1: 型エラーの特定

```bash
# 現状の型エラーを確認
npx tsc --noEmit --strict > type-errors.txt
```

#### ステップ2: 段階的な修正

```json
// tsconfig.json
{
  "compilerOptions": {
    // 段階的に有効化
    "noImplicitAny": true,  // まずこれから
    "strictNullChecks": false,  // 後で有効化
    "strict": false  // 最終目標
  }
}
```

#### ステップ3: ファイル単位で修正

```typescript
// Before: any の使用
function loadData(data: any) {
  return data.items;
}

// After: 明示的な型定義
interface DataResponse {
  items: Array<{ id: string; name: string }>;
}

function loadData(data: DataResponse) {
  return data.items;
}
```

---

### 3. フォント最適化の実装

**所要時間**: 30分  
**難易度**: ⭐☆☆☆☆

```typescript
// app/layout.tsx
import { Noto_Sans_JP } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-noto-sans-jp',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'sans-serif'],
      },
    },
  },
};
```

**効果**: CLS (Cumulative Layout Shift) の改善、フォント読み込みの最適化

---

### 4. robots.txt の強化

**所要時間**: 10分  
**難易度**: ⭐☆☆☆☆

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kazu-4728.github.io/website_v2';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/', '/.git/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

---

### 5. エラーページの改善

**所要時間**: 30分  
**難易度**: ⭐☆☆☆☆

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーログ（本番環境ではSentryなどに送信）
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">エラー</h1>
        <p className="mb-8 text-xl text-gray-600">
          申し訳ございません。問題が発生しました。
        </p>
        {error.digest && (
          <p className="mb-4 text-sm text-gray-500">
            エラーID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
```

```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <p className="mb-8 text-xl text-gray-600">
          お探しのページが見つかりませんでした。
        </p>
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
```

---

### 6. loading.tsx の追加

**所要時間**: 20分  
**難易度**: ⭐☆☆☆☆

```typescript
// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
}
```

```typescript
// app/[slug]/loading.tsx
export default function DocLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="space-y-2 pt-4">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}
```

---

## 📈 中期的な実装（1-2週間）

### 7. SEO メタデータの完全実装

**所要時間**: 4-6時間  
**難易度**: ⭐⭐⭐☆☆

#### 共通メタデータ設定

```typescript
// app/lib/metadata.ts
import { Metadata } from 'next';

export function generateCommonMetadata(
  title: string,
  description: string,
  image?: string,
  path: string = ''
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kazu-4728.github.io/website_v2';
  const fullUrl = `${baseUrl}${path}`;
  const defaultImage = `${baseUrl}/og-image.jpg`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: '関東温泉紀行',
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || defaultImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
```

#### ページごとのメタデータ

```typescript
// app/[slug]/page.tsx
import { generateCommonMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const content = await loadContent();
  const doc = content.pages.docs?.find(d => d.slug === params.slug);

  if (!doc) {
    return {
      title: 'ページが見つかりません',
    };
  }

  return generateCommonMetadata(
    doc.title,
    doc.description,
    doc.image,
    `/${params.slug}`
  );
}
```

---

### 8. 構造化データ（JSON-LD）の実装

**所要時間**: 3-4時間  
**難易度**: ⭐⭐⭐☆☆

```typescript
// app/lib/structured-data.ts
export function generateOrganizationSchema(siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: process.env.NEXT_PUBLIC_BASE_URL,
    logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
    sameAs: [
      // ソーシャルメディアのURLがあれば追加
    ],
  };
}

export function generateTouristAttractionSchema(doc: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: doc.title,
    description: doc.description,
    image: doc.image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: doc.location?.city || '',
      addressRegion: doc.location?.prefecture || '関東',
      addressCountry: 'JP',
    },
    ...(doc.location?.lat && doc.location?.lng && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: doc.location.lat,
        longitude: doc.location.lng,
      },
    }),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

```typescript
// app/[slug]/page.tsx
import { generateTouristAttractionSchema, generateBreadcrumbSchema } from '@/lib/structured-data';

export default async function OnsenPage({ params }: { params: { slug: string } }) {
  const content = await loadContent();
  const doc = content.pages.docs?.find(d => d.slug === params.slug);

  const jsonLd = [
    generateTouristAttractionSchema(doc),
    generateBreadcrumbSchema([
      { name: 'ホーム', url: '/' },
      { name: doc.title, url: `/${params.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ページコンテンツ */}
    </>
  );
}
```

---

### 9. アクセシビリティの段階的改善

**所要時間**: 6-8時間  
**難易度**: ⭐⭐⭐⭐☆

#### スキップリンクの追加

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {/* スキップリンク */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-blue-600 focus:p-4 focus:text-white"
        >
          メインコンテンツへスキップ
        </a>
        
        <Header />
        
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
```

```css
/* app/globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

#### ARIAラベルの追加

```typescript
// app/components/_legacy/navigation/Header.tsx
export function Header({ navigation }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header role="banner">
      <nav aria-label="メインナビゲーション">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニューを開く"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden"
        >
          <MenuIcon aria-hidden="true" />
        </button>
        
        <ul id="mobile-menu" className={isOpen ? 'block' : 'hidden'}>
          {navigation.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

---

### 10. 画像最適化スクリプトの作成

**所要時間**: 6-8時間  
**難易度**: ⭐⭐⭐⭐☆

```bash
# 依存関係のインストール
npm install --save-dev sharp glob
```

```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = 'public/images';
const OUTPUT_DIR = 'public/images/optimized';
const SIZES = [
  { width: 640, suffix: '-sm', quality: 80 },
  { width: 1024, suffix: '-md', quality: 80 },
  { width: 1920, suffix: '-lg', quality: 80 },
];

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function optimizeImage(inputPath) {
  const relativePath = path.relative(INPUT_DIR, inputPath);
  const { dir, name, ext } = path.parse(relativePath);
  const outputSubDir = path.join(OUTPUT_DIR, dir);
  
  await ensureDir(outputSubDir);
  
  console.log(`Optimizing: ${relativePath}`);
  
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  for (const { width, suffix, quality } of SIZES) {
    if (metadata.width && metadata.width < width) continue;
    
    const basePath = path.join(outputSubDir, `${name}${suffix}`);
    
    // WebP
    await image
      .clone()
      .resize(width, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(`${basePath}.webp`);
    
    // AVIF (より高圧縮)
    await image
      .clone()
      .resize(width, null, { fit: 'inside', withoutEnlargement: true })
      .avif({ quality: quality - 10 })
      .toFile(`${basePath}.avif`);
    
    // JPEG (フォールバック)
    await image
      .clone()
      .resize(width, null, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality })
      .toFile(`${basePath}.jpg`);
  }
  
  console.log(`✓ Optimized: ${relativePath}`);
}

async function main() {
  const imageFiles = glob.sync(`${INPUT_DIR}/**/*.{jpg,jpeg,png}`, {
    ignore: [`${OUTPUT_DIR}/**`],
  });
  
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  for (const file of imageFiles) {
    try {
      await optimizeImage(file);
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err.message);
    }
  }
  
  console.log('✓ All images optimized');
}

main().catch(console.error);
```

```json
// package.json に追加
{
  "scripts": {
    "optimize-images": "node scripts/optimize-images.js",
    "prebuild": "npm run optimize-images"
  }
}
```

---

### 11. CI/CD の強化

**所要時間**: 3-4時間  
**難易度**: ⭐⭐⭐☆☆

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:all
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: always()
        with:
          files: ./coverage/coverage-final.json

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: out/
          retention-days: 7
```

---

## 🔄 継続的改善のチェックリスト

### 毎週実施

- [ ] `npm outdated` で依存関係の更新確認
- [ ] `npm audit` でセキュリティチェック
- [ ] ビルドサイズの確認（`npm run build` の出力）
- [ ] Lighthouse スコアの計測

### 毎月実施

- [ ] 依存関係のメジャーアップデート検討
- [ ] パフォーマンス指標の分析
- [ ] SEO ランキングの確認
- [ ] アクセシビリティ監査

### 四半期ごと実施

- [ ] リポジトリ構造の見直し
- [ ] ドキュメントの更新
- [ ] 未使用コードの削除
- [ ] テストカバレッジの向上

---

## 📊 効果測定

### ツール

1. **Lighthouse**
```bash
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000
```

2. **WebPageTest**
https://www.webpagetest.org/

3. **PageSpeed Insights**
https://pagespeed.web.dev/

### 計測指標

- Performance Score (目標: 90+)
- Accessibility Score (目標: 95+)
- Best Practices Score (目標: 100)
- SEO Score (目標: 100)
- First Contentful Paint (目標: < 1.0s)
- Largest Contentful Paint (目標: < 2.0s)
- Cumulative Layout Shift (目標: < 0.1)
- Time to Interactive (目標: < 2.5s)

---

## 🎓 学習リソース

### 公式ドキュメント
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev](https://web.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)

### ツール
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Can I Use](https://caniuse.com/)

### コミュニティ
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [Web Performance Slack](https://webperformance.slack.com/)

---

**次のステップ**: このガイドの「即座に実装可能な改善」から始めて、徐々に中期的な実装に移行することを推奨します。
