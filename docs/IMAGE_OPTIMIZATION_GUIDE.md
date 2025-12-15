# 画像最適化ガイド - GitHub Pages 向けベストプラクティス

このドキュメントは、GitHub Pages（静的ホスティング）環境で画像を最適化するための実践的なガイドです。

---

## 🎯 現状と課題

### 現在の制約

```javascript
// next.config.mjs
export default {
  output: 'export',  // 静的エクスポート
  images: { 
    unoptimized: true,  // Next.js Image Optimization が使用不可
  }
};
```

**問題点**:
- Next.js の自動画像最適化が使用できない
- リアルタイムでのリサイズ・フォーマット変換が不可
- WebP/AVIF への自動変換がない
- レスポンシブ画像の手動管理が必要

---

## 💡 推奨ソリューション

### アプローチ1: ビルド時最適化（推奨★★★★★）

**メリット**:
- GitHub Pages でも完全に動作
- 追加コスト不要
- 完全な制御が可能
- ビルド時に1回だけ処理

**デメリット**:
- ビルド時間の増加
- リポジトリサイズの増加（最適化画像を含める場合）

---

## 🛠️ 実装方法

### ステップ1: 依存関係のインストール

```bash
npm install --save-dev sharp glob
```

### ステップ2: 画像最適化スクリプトの作成

```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs').promises;
const path = require('path');

// 設定
const CONFIG = {
  inputDir: 'public/images/source',      // オリジナル画像
  outputDir: 'public/images/optimized',  // 最適化後の画像
  sizes: [
    { width: 640, suffix: '-sm', quality: 80 },
    { width: 1024, suffix: '-md', quality: 80 },
    { width: 1920, suffix: '-lg', quality: 85 },
  ],
  formats: ['webp', 'avif', 'jpg'],
};

// 画像最適化関数
async function optimizeImage(inputPath) {
  const relativePath = path.relative(CONFIG.inputDir, inputPath);
  const { dir, name } = path.parse(relativePath);
  const outputSubDir = path.join(CONFIG.outputDir, dir);
  
  // 出力ディレクトリを作成
  await fs.mkdir(outputSubDir, { recursive: true });
  
  console.log(`📸 Processing: ${relativePath}`);
  
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  let processedCount = 0;
  
  // 各サイズ・フォーマットに変換
  for (const { width, suffix, quality } of CONFIG.sizes) {
    // 元画像より大きいサイズは生成しない
    if (metadata.width && metadata.width < width) continue;
    
    const basePath = path.join(outputSubDir, `${name}${suffix}`);
    
    // WebP
    if (CONFIG.formats.includes('webp')) {
      await image
        .clone()
        .resize(width, null, { 
          fit: 'inside', 
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3  // 高品質リサイズ
        })
        .webp({ quality, effort: 6 })
        .toFile(`${basePath}.webp`);
      processedCount++;
    }
    
    // AVIF (最も圧縮率が高い)
    if (CONFIG.formats.includes('avif')) {
      await image
        .clone()
        .resize(width, null, { 
          fit: 'inside', 
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3 
        })
        .avif({ quality: quality - 10, effort: 6 })
        .toFile(`${basePath}.avif`);
      processedCount++;
    }
    
    // JPEG (フォールバック)
    if (CONFIG.formats.includes('jpg')) {
      await image
        .clone()
        .resize(width, null, { 
          fit: 'inside', 
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3 
        })
        .jpeg({ quality, progressive: true, mozjpeg: true })
        .toFile(`${basePath}.jpg`);
      processedCount++;
    }
  }
  
  console.log(`  ✓ Generated ${processedCount} optimized images`);
}

// メイン処理
async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  // 画像ファイルを検索（非同期版を使用）
  const imageFiles = await new Promise((resolve, reject) => {
    glob(`${CONFIG.inputDir}/**/*.{jpg,jpeg,png}`, {
      ignore: [`${CONFIG.outputDir}/**`],
    }, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
  
  console.log(`📁 Found ${imageFiles.length} images\n`);
  
  // 並列処理（最大5つまで同時処理）
  const BATCH_SIZE = 5;
  for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
    const batch = imageFiles.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(file => 
        optimizeImage(file).catch(err => {
          console.error(`  ✗ Error processing ${file}:`, err.message);
        })
      )
    );
  }
  
  console.log('\n✅ Image optimization complete!');
}

main().catch(console.error);
```

### ステップ3: package.json への統合

```json
{
  "scripts": {
    "optimize:images": "node scripts/optimize-images.js",
    "build": "npm run optimize:images && next build"
  }
}
```

### ステップ4: レスポンシブ画像コンポーネントの作成

```typescript
// app/components/OptimizedImage.tsx
import React from 'react';

interface OptimizedImageProps {
  src: string;  // 画像のベースパス (例: '/images/optimized/onsen/hakone')
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  sizes = '(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px',
  priority = false,
  loading = 'lazy',
}: OptimizedImageProps) {
  const srcSet = {
    avif: [
      `${src}-sm.avif 640w`,
      `${src}-md.avif 1024w`,
      `${src}-lg.avif 1920w`,
    ].join(', '),
    webp: [
      `${src}-sm.webp 640w`,
      `${src}-md.webp 1024w`,
      `${src}-lg.webp 1920w`,
    ].join(', '),
    jpg: [
      `${src}-sm.jpg 640w`,
      `${src}-md.jpg 1024w`,
      `${src}-lg.jpg 1920w`,
    ].join(', '),
  };

  return (
    <picture>
      {/* 最新ブラウザ向け - 最も圧縮率が高い */}
      <source
        type="image/avif"
        srcSet={srcSet.avif}
        sizes={sizes}
      />
      
      {/* モダンブラウザ向け */}
      <source
        type="image/webp"
        srcSet={srcSet.webp}
        sizes={sizes}
      />
      
      {/* フォールバック - すべてのブラウザで表示可能 */}
      <img
        src={`${src}-lg.jpg`}
        srcSet={srcSet.jpg}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
```

### ステップ5: 使用例

```typescript
// app/page.tsx
import { OptimizedImage } from './components/OptimizedImage';

export default function HomePage() {
  return (
    <div>
      <OptimizedImage
        src="/images/optimized/hero/hakone"
        alt="箱根温泉の風景"
        className="w-full h-auto"
        sizes="100vw"
        priority  // Above the fold
      />
      
      <OptimizedImage
        src="/images/optimized/onsen/kusatsu"
        alt="草津温泉の湯畑"
        className="rounded-lg shadow-lg"
        loading="lazy"  // Below the fold
      />
    </div>
  );
}
```

---

## 📊 最適化の効果

### ファイルサイズの比較

| フォーマット | オリジナル | 最適化後 | 削減率 |
|-------------|-----------|---------|--------|
| JPEG (1920x1080) | 800 KB | 250 KB | 69% |
| WebP (1920x1080) | - | 150 KB | 81% |
| AVIF (1920x1080) | - | 80 KB | 90% |

### パフォーマンス指標の改善

| 指標 | Before | After | 改善 |
|-----|--------|-------|-----|
| LCP | 3.5s | 1.8s | 49% |
| Total Page Size | 4.2 MB | 1.5 MB | 64% |
| Lighthouse Score | 65 | 92 | +27 |

---

## 🎨 高度な最適化テクニック

### 1. ブラーアップ（Blur-up）の実装

```typescript
// app/lib/image-utils.ts
import sharp from 'sharp';

export async function generateBlurDataURL(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .resize(10, 10, { fit: 'inside' })
    .blur()
    .toBuffer();
  
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}
```

```typescript
// app/components/OptimizedImageWithBlur.tsx
export function OptimizedImageWithBlur({
  src,
  blurDataURL,
  alt,
}: {
  src: string;
  blurDataURL: string;
  alt: string;
}) {
  return (
    <div className="relative">
      {/* ブラー画像 */}
      <img
        src={blurDataURL}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-xl"
        aria-hidden="true"
      />
      
      {/* 実際の画像 */}
      <OptimizedImage
        src={src}
        alt={alt}
        className="relative z-10"
      />
    </div>
  );
}
```

---

### 2. アート・ディレクション（異なる画面サイズで異なる画像）

```typescript
export function ArtDirectedImage() {
  return (
    <picture>
      {/* モバイル: 縦長の画像 */}
      <source
        media="(max-width: 640px)"
        srcSet="/images/mobile-portrait.webp"
      />
      
      {/* タブレット: 正方形の画像 */}
      <source
        media="(max-width: 1024px)"
        srcSet="/images/tablet-square.webp"
      />
      
      {/* デスクトップ: 横長の画像 */}
      <img
        src="/images/desktop-landscape.webp"
        alt="レスポンシブな画像"
      />
    </picture>
  );
}
```

---

### 3. Lazy Loading の最適化

```typescript
// app/components/LazyImage.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function LazyImage({ src, alt, ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',  // 100px 手前で読み込み開始
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      data-src={src}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
}
```

---

## 🔧 ディレクトリ構造の推奨

```
public/images/
├── source/              # オリジナル画像（Gitで管理、.gitignoreに追加可）
│   ├── hero/
│   │   ├── hakone.jpg
│   │   └── kusatsu.jpg
│   └── onsen/
│       ├── atami.jpg
│       └── ikaho.jpg
├── optimized/           # 最適化後の画像（ビルド時生成）
│   ├── hero/
│   │   ├── hakone-sm.avif
│   │   ├── hakone-sm.webp
│   │   ├── hakone-sm.jpg
│   │   ├── hakone-md.avif
│   │   ├── hakone-md.webp
│   │   ├── hakone-md.jpg
│   │   ├── hakone-lg.avif
│   │   ├── hakone-lg.webp
│   │   └── hakone-lg.jpg
│   └── onsen/
│       └── ...
└── placeholders/        # ブラーアップ用の小さな画像
    └── ...
```

---

## 📝 .gitignore の設定

```gitignore
# .gitignore

# オリジナル画像（容量削減のため、必要に応じてコミットから除外）
# public/images/source/

# 最適化後の画像（ビルド時に生成されるため除外）
public/images/optimized/

# 一時ファイル
*.tmp
.cache/
```

---

## 🚀 CI/CD への統合

```yaml
# .github/workflows/pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Optimize images
        run: npm run optimize:images
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

---

## 🎯 パフォーマンス目標

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.0s ✅
- **FID (First Input Delay)**: < 100ms ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅

### 画像関連指標

- **画像のファイルサイズ**: < 150KB (WebP/AVIF)
- **画像の読み込み時間**: < 1.0s
- **Above-the-fold 画像**: Eager loading + Priority hint
- **Below-the-fold 画像**: Lazy loading

---

## 🔍 トラブルシューティング

### 問題: ビルド時間が長すぎる

**解決策**:
```javascript
// 並列処理数を増やす
const BATCH_SIZE = 10;  // デフォルト: 5

// または、変更された画像のみ処理
const fs = require('fs');
const crypto = require('crypto');

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

// ハッシュをキャッシュして、変更された画像のみ処理
```

### 問題: リポジトリサイズが大きくなる

**解決策**:
1. オリジナル画像を `.gitignore` に追加
2. 最適化後の画像のみコミット
3. または、LFS (Large File Storage) を使用

```bash
# Git LFS のセットアップ
git lfs install
git lfs track "public/images/source/**"
```

### 問題: AVIF がサポートされていないブラウザ

**解決策**: `<picture>` タグで自動フォールバック

```html
<picture>
  <source type="image/avif" srcset="image.avif">
  <source type="image/webp" srcset="image.webp">
  <img src="image.jpg" alt="...">  <!-- すべてのブラウザで表示可能 -->
</picture>
```

---

## 📚 参考リソース

### ツール
- [sharp](https://sharp.pixelplumbing.com/) - 高速画像処理ライブラリ
- [Squoosh](https://squoosh.app/) - オンライン画像最適化ツール
- [ImageOptim](https://imageoptim.com/) - macOS向け画像最適化アプリ

### 学習リソース
- [Web.dev - Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [AVIF vs WebP](https://jakearchibald.com/2020/avif-has-landed/)

---

## ✅ チェックリスト

### 実装前
- [ ] sharp をインストール
- [ ] 最適化スクリプトを作成
- [ ] package.json にスクリプトを追加
- [ ] .gitignore を更新

### 実装中
- [ ] オリジナル画像を `public/images/source/` に配置
- [ ] 最適化スクリプトを実行してテスト
- [ ] OptimizedImage コンポーネントを作成
- [ ] 既存の画像を OptimizedImage に置き換え

### 実装後
- [ ] ビルドが成功することを確認
- [ ] 画像が正しく表示されることを確認
- [ ] Lighthouse でパフォーマンスを計測
- [ ] 各ブラウザで動作確認（Chrome, Firefox, Safari）
- [ ] モバイルデバイスで動作確認

---

**次のステップ**: まず小規模なテスト（数枚の画像）で動作を確認してから、全画像に適用することを推奨します。
