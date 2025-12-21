# 温泉画像選択システム - 使用ガイド

## 📋 概要

このシステムは、ヒーローセクションと温泉紹介ページに**温泉が写っている画像**を保証するために作成されました。

### 絶対条件
- ✅ ヒーローセクション: 温泉が写っている画像のみ
- ✅ 温泉紹介ページ: 温泉自体が写っている画像のみ
- ✅ 複数の画像候補から選択可能

---

## 🗂️ ファイル構成

```
data/
└── onsen-image-stock.json     # 温泉画像のストック（JSON）

app/lib/
└── onsen-image-selector.ts    # 画像選択システム（TypeScript）

tests/
└── onsen-image-selector.test.ts  # テスト
```

---

## 📸 画像ストック構造

### `data/onsen-image-stock.json`

```json
{
  "hero": {
    "primary": [
      {
        "id": "kusatsu-yubatake",
        "url": "https://...",
        "title": "草津温泉 湯畑",
        "hasOnsen": true,        // 温泉が写っているか（必須）
        "features": ["湯畑", "湯けむり"],
        "recommended": true
      }
    ],
    "alternative": [...]
  },
  "onsenPages": {
    "kusatsu": [
      {
        "id": "kusatsu-yubatake-main",
        "hasOnsen": true,
        "recommended": true,
        ...
      }
    ],
    "ikaho": [...],
    "nasu": [...],
    "atami": [...],
    "hakone": [...]
  }
}
```

### 重要フィールド

| フィールド | 型 | 説明 |
|-----------|---|------|
| `id` | string | 画像の一意なID |
| `url` | string | 画像のURL |
| `title` | string | 画像のタイトル |
| `description` | string | 画像の説明 |
| **`hasOnsen`** | **boolean** | **温泉が写っているか（必須）** |
| `features` | string[] | 画像の特徴 |
| `recommended` | boolean | 推奨画像かどうか |
| `author` | string | 作者 |
| `license` | string | ライセンス |
| `licenseUrl` | string | ライセンスURL |
| `source` | string | 出典 |

---

## 🚀 使用方法

### 1. ヒーローセクション用の画像を取得

```typescript
import {
  getHeroOnsenImages,
  getRecommendedHeroImage,
} from '@/app/lib/onsen-image-selector';

// すべてのprimary画像を取得
const heroImages = getHeroOnsenImages('primary');

// 推奨画像を取得
const recommendedImage = getRecommendedHeroImage();

console.log(recommendedImage);
// {
//   id: 'kusatsu-yubatake',
//   url: 'https://...',
//   title: '草津温泉 湯畑',
//   hasOnsen: true,
//   ...
// }
```

### 2. 温泉紹介ページ用の画像を取得

```typescript
import {
  getOnsenPageImages,
  getRecommendedOnsenImage,
} from '@/app/lib/onsen-image-selector';

// 草津温泉のすべての画像を取得
const kusatsuImages = getOnsenPageImages('kusatsu');

// 草津温泉の推奨画像を取得
const recommendedImage = getRecommendedOnsenImage('kusatsu');

console.log(recommendedImage);
// {
//   id: 'kusatsu-yubatake-main',
//   url: 'https://...',
//   title: '草津温泉 湯畑',
//   hasOnsen: true,
//   recommended: true,
//   ...
// }
```

### 3. 複数の画像から選択

```typescript
import { selectImage } from '@/app/lib/onsen-image-selector';

const kusatsuImages = getOnsenPageImages('kusatsu');

// 最初の画像を選択（デフォルト）
const firstImage = selectImage(kusatsuImages);

// 2番目の画像を選択
const secondImage = selectImage(kusatsuImages, 1);

// インデックスが範囲外の場合は最初の画像を返す
const fallbackImage = selectImage(kusatsuImages, 100); // → 最初の画像
```

### 4. 画像の検証

```typescript
import { validateOnsenImage } from '@/app/lib/onsen-image-selector';

const image = getRecommendedHeroImage();

try {
  validateOnsenImage(image);
  console.log('✅ 温泉画像の検証に合格');
} catch (error) {
  console.error('❌ 温泉が写っていません', error);
}
```

### 5. 利用可能な温泉地IDを取得

```typescript
import { getAvailableOnsenIds } from '@/app/lib/onsen-image-selector';

const onsenIds = getAvailableOnsenIds();
console.log(onsenIds);
// ['kusatsu', 'ikaho', 'nasu', 'atami', 'hakone']
```

---

## 🎨 コンポーネントでの使用例

### Hero コンポーネント

```tsx
'use client';

import { getRecommendedHeroImage } from '@/app/lib/onsen-image-selector';
import Image from 'next/image';

export default function Hero() {
  const heroImage = getRecommendedHeroImage();

  return (
    <section className="relative h-screen">
      <Image
        src={heroImage.url}
        alt={heroImage.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent">
        <h1 className="text-6xl font-bold text-white">
          {heroImage.title}
        </h1>
        <p className="text-xl text-white/90">
          {heroImage.description}
        </p>
      </div>
      
      {/* クレジット表示 */}
      <div className="absolute bottom-4 right-4 text-xs text-white/70">
        Photo by {heroImage.author} ({heroImage.license})
      </div>
    </section>
  );
}
```

### 温泉紹介ページ

```tsx
'use client';

import { getRecommendedOnsenImage } from '@/app/lib/onsen-image-selector';
import Image from 'next/image';

interface OnsenPageProps {
  onsenId: string;
}

export default function OnsenPage({ onsenId }: OnsenPageProps) {
  const onsenImage = getRecommendedOnsenImage(onsenId);

  if (!onsenImage) {
    return <div>画像が見つかりません</div>;
  }

  return (
    <article>
      <div className="relative h-96">
        <Image
          src={onsenImage.url}
          alt={onsenImage.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <h1>{onsenImage.title}</h1>
      <p>{onsenImage.description}</p>
    </article>
  );
}
```

### 画像選択UI（管理画面など）

```tsx
'use client';

import { useState } from 'react';
import { getOnsenPageImages, selectImage } from '@/app/lib/onsen-image-selector';
import Image from 'next/image';

interface ImageSelectorProps {
  onsenId: string;
}

export default function ImageSelector({ onsenId }: ImageSelectorProps) {
  const images = getOnsenPageImages(onsenId);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = selectImage(images, selectedIndex);

  return (
    <div>
      <h2>画像を選択</h2>
      
      {/* 選択された画像 */}
      <div className="mb-4">
        <Image
          src={selectedImage.url}
          alt={selectedImage.title}
          width={800}
          height={600}
          className="rounded-lg"
        />
        <p className="text-sm text-gray-600 mt-2">
          {selectedImage.description}
        </p>
      </div>

      {/* 画像リスト */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            className={`relative aspect-video rounded-lg overflow-hidden ${
              index === selectedIndex
                ? 'ring-4 ring-blue-500'
                : 'ring-1 ring-gray-300'
            }`}
          >
            <Image
              src={image.url}
              alt={image.title}
              fill
              className="object-cover"
            />
            {image.recommended && (
              <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                推奨
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ テスト

```bash
# テストを実行
npm test tests/onsen-image-selector.test.ts

# すべてのテストを実行
npm run test:all
```

### テストの内容

- ✅ ヒーロー画像の取得
- ✅ すべてのヒーロー画像が温泉を含んでいるか
- ✅ 温泉紹介ページ画像の取得
- ✅ すべての温泉紹介ページ画像が温泉を含んでいるか
- ✅ 推奨画像の取得
- ✅ 画像の検証
- ✅ 画像の選択
- ✅ 実際のデータの整合性

---

## 📝 新しい温泉地を追加する方法

### 1. `data/onsen-image-stock.json` に追加

```json
{
  "onsenPages": {
    "new-onsen": [
      {
        "id": "new-onsen-main",
        "url": "https://...",
        "title": "新しい温泉",
        "description": "新しい温泉の説明",
        "hasOnsen": true,           // 必須！
        "features": ["温泉", "露天風呂"],
        "author": "作者名",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://...",
        "source": "wikimedia",
        "recommended": true
      }
    ]
  }
}
```

### 2. テストを実行して確認

```bash
npm test tests/onsen-image-selector.test.ts
```

---

## ⚠️ 注意事項

### 必須条件

1. **`hasOnsen: true` は必須**
   - ヒーローセクションと温泉紹介ページには、温泉が写っている画像が絶対条件です。
   - `hasOnsen: false` の画像は自動的にフィルタされます。

2. **ライセンスとクレジット**
   - すべての画像にライセンス情報を含めてください。
   - クレジット表示が必要な場合は適切に表示してください。

3. **画像の品質**
   - 高解像度の画像を使用してください（推奨: 1920x1080以上）。
   - 温泉の特徴が明確に写っている画像を選んでください。

### ベストプラクティス

- **推奨画像を設定**: `recommended: true` を設定することで、デフォルトで使用される画像を指定できます。
- **複数の候補を用意**: 1つの温泉地に対して複数の画像を用意することで、選択肢が増えます。
- **適切な説明**: `description` フィールドに温泉の特徴を記載してください。

---

## 🔗 関連ファイル

- `data/onsen-image-stock.json` - 画像ストック
- `app/lib/onsen-image-selector.ts` - 画像選択システム
- `tests/onsen-image-selector.test.ts` - テスト
- `data/wikimedia-images.json` - Wikimedia画像データ（既存）

---

**作成日**: 2025年12月21日  
**最終更新**: 2025年12月21日
