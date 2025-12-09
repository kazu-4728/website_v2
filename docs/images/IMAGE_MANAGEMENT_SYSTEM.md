# 画像管理システムの仕組み

作成日: 2025年1月

## 📋 概要

このドキュメントでは、取得した画像がどのように管理され、サイトで呼び出されているかを説明します。

## 🔄 画像のライフサイクル

### 1. 画像の取得

**スクリプト**: `scripts/fetch-onsen-images-multi-api.js`

```bash
node scripts/fetch-onsen-images-multi-api.js
```

**取得先**:
- Wikimedia Commons API（APIキー不要）
- Pixabay API（APIキー必要）
- Pexels API（APIキー必要）
- Unsplash API（APIキー必要）

**保存先**: `data/wikimedia-images.json`

**重要**: 取得した画像は**自動的にサイトに反映されません**。ユーザーが確認・承認してから使用します。

### 2. 画像の保存形式

`data/wikimedia-images.json`の構造:

```json
{
  "kusatsu": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Kusatsu-yubatake_2004.JPG",
    "author": "<a href=\"//commons.wikimedia.org/wiki/User:PekePON\" title=\"User:PekePON\">PekePON</a>",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "title": "File:Kusatsu-yubatake_2004.JPG",
    "source": "wikimedia"
  }
}
```

### 3. 画像の呼び出し

#### 3.1 コンテンツでの指定

`themes/onsen-kanto/content.json`で画像キーを指定:

```json
{
  "slug": "kusatsu",
  "title": "草津温泉完全ガイド",
  "image": "kusatsu",  // ← 画像キーを指定
  ...
}
```

#### 3.2 画像URLの解決

`app/lib/content.ts`の`resolveImageUrl()`関数が画像キーをURLに変換:

```typescript
// app/lib/content.ts
export function resolveImageUrl(image: string, category?: string): string {
  // 温泉カテゴリの場合は、getOnsenImage()を使用してwikimedia-images.jsonから取得
  if (category === 'onsen') {
    return optimizeImageUrl(getOnsenImage(image));
  }
  // その他のカテゴリ
  return optimizeImageUrl(getThemeImage('onsen', image, `onsen,${image},japan`));
}
```

#### 3.3 画像の取得ロジック

`app/lib/images.ts`の`getOnsenImage()`関数:

```typescript
export function getOnsenImage(onsenSlug: string): string {
  // 1. data/wikimedia-images.jsonから画像を取得を試みる
  try {
    const fs = require('fs');
    const path = require('path');
    const jsonPath = path.join(process.cwd(), 'data', 'wikimedia-images.json');
    
    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, 'utf-8');
      const imageData = JSON.parse(fileContent);
      const cachedImage = imageData[onsenSlug];
      
      if (cachedImage?.url) {
        return cachedImage.url;  // ← 見つかったらURLを返す
      }
    }
  } catch (error) {
    // エラーが発生した場合はフォールバックを使用
  }
  
  // 2. フォールバック: 事前定義された画像を使用
  return getThemeImage('onsen', onsenSlug, `onsen,${onsenSlug},japan`);
}
```

**処理の流れ**:
1. `data/wikimedia-images.json`から`onsenSlug`（例: "kusatsu"）で画像を検索
2. 見つかったら`url`を返す
3. 見つからない場合は、`ONSEN_KANTO_IMAGES`から事前定義された画像を使用

### 4. 画像の表示

`app/docs/[slug]/page.tsx`で画像を表示:

```typescript
// 画像のメタデータを取得（著作権情報）
const imageMetadata = getImageMetadata('onsen', slug);

// 画像を表示
<Image
  src={page.image}  // ← これは既にURLに解決されている
  alt={page.title}
  fill
  className="object-cover"
  priority
/>

// 画像のクレジット表示
<ImageCredit metadata={imageMetadata} position="bottom-right" />
```

## 📁 ファイル構成

```
data/
└── wikimedia-images.json          # 取得した画像のリスト（ユーザー確認用）

app/lib/
├── images.ts                      # 画像管理システム
│   ├── getOnsenImage()            # 温泉画像の取得（同期版）
│   ├── getOnsenImageAsync()       # 温泉画像の取得（非同期版）
│   └── getImageMetadata()         # 画像メタデータの取得
├── content.ts                     # コンテンツ管理システム
│   └── resolveImageUrl()         # 画像キーをURLに解決
└── wikimedia.ts                   # Wikimedia Commons API連携
    ├── getCachedOnsenImage()      # キャッシュから画像を取得
    └── getOnsenImageFromWikimedia() # APIから画像を取得

themes/onsen-kanto/
└── content.json                   # 画像キーを指定（例: "image": "kusatsu"）

app/docs/[slug]/
└── page.tsx                       # 画像を表示
```

## 🔍 画像の解決フロー

```
1. content.json
   "image": "kusatsu"
   ↓
2. content.ts - resolveImageUrl()
   getOnsenImage("kusatsu")
   ↓
3. images.ts - getOnsenImage()
   data/wikimedia-images.json から "kusatsu" を検索
   ↓
4. 見つかった場合
   return cachedImage.url
   ↓
5. 見つからない場合（フォールバック）
   return getThemeImage('onsen', 'kusatsu', ...)
   ↓
6. page.tsx
   <Image src={page.image} />  // URLが設定されている
```

## ⚠️ 重要な注意事項

### 画像の追加方法

1. **画像を取得**
   ```bash
   node scripts/fetch-onsen-images-multi-api.js
   ```

2. **ユーザーが画像を確認**
   - `data/wikimedia-images.json`を確認
   - 使用する画像を選択

3. **画像を承認**
   - ユーザーが承認した画像のみを`data/wikimedia-images.json`に追加
   - エージェントは**勝手に追加しない**

4. **サイトに反映**
   - `content.json`の`image`フィールドにキーを指定（例: `"image": "kusatsu"`）
   - `getOnsenImage()`が自動的に`wikimedia-images.json`から取得

### フォールバック動作

`data/wikimedia-images.json`に画像がない場合:
- `app/lib/images.ts`の`ONSEN_KANTO_IMAGES`から事前定義された画像を使用
- これは一時的なフォールバックで、最終的には`wikimedia-images.json`に追加する必要がある

### 画像メタデータの取得

画像のクレジット情報を表示する場合:

```typescript
// 画像メタデータを取得
const imageMetadata = getImageMetadata('onsen', slug);

// クレジット表示
<ImageCredit metadata={imageMetadata} position="bottom-right" />
```

`getImageMetadata()`は以下の順序でメタデータを取得:
1. `data/wikimedia-images.json`から取得
2. `ONSEN_KANTO_IMAGES`から取得
3. `wikimedia.ts`の`getCachedOnsenImage()`から取得

## 🔧 トラブルシューティング

### 画像が表示されない場合

1. **`data/wikimedia-images.json`を確認**
   - 該当するキーが存在するか確認
   - URLが正しいか確認

2. **`content.json`を確認**
   - `image`フィールドに正しいキーが指定されているか確認

3. **フォールバック画像を確認**
   - `app/lib/images.ts`の`ONSEN_KANTO_IMAGES`に該当する画像があるか確認

4. **ビルドログを確認**
   - `getOnsenImage()`のエラーメッセージを確認

### 画像のクレジットが表示されない場合

1. **`getImageMetadata()`の戻り値を確認**
   - メタデータが正しく取得されているか確認

2. **`ImageCredit`コンポーネントを確認**
   - `metadata`プロパティが正しく渡されているか確認

## 📚 関連ドキュメント

- [`MULTI_API_IMAGE_FETCH.md`](./MULTI_API_IMAGE_FETCH.md) - 画像取得システムの使い方
- [`IMAGE_FETCH_RECOMMENDATIONS.md`](./IMAGE_FETCH_RECOMMENDATIONS.md) - 画像取得の推奨事項
- [`../agent/AGENT_GUIDE.md`](../agent/AGENT_GUIDE.md) - エージェント向けガイド（画像ワークフロー）
