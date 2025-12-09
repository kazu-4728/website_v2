# 画像表示問題の診断レポート

作成日: 2025年1月

## 問題の概要

**症状**: 画像メインなサイトで温泉画像が全く表示されていない

## 診断結果

### 1. データファイルの確認 ✅

- `data/wikimedia-images.json`は存在し、26件の画像データが含まれている
- すべての画像に`url`フィールドが存在している
- 画像URLは有効なWikimedia CommonsのURLである

### 2. 画像解決関数の確認 ✅

- `app/lib/images.ts`の`getOnsenImage()`関数は正しく動作している
- テスト結果: `hakone` → `https://upload.wikimedia.org/wikipedia/commons/e/e6/Gorakadan_Onsen_Rotenburo_1.jpg`
- テスト結果: `kusatsu` → `https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg`

### 3. content.jsonの確認 ✅

- `themes/onsen-kanto/content.json`の`pages.docs[]`には21件の温泉地データが存在
- 各温泉地の`image`フィールドは文字列（例: `"hakone"`, `"kusatsu"`）として設定されている

### 4. 画像解決の流れの確認

`app/lib/content.ts`の`resolveImageUrls()`関数で、`pages.docs`の画像が解決されている：

```typescript
pages: {
  docs: content.pages.docs?.map(doc => ({
    ...doc,
    image: resolveImageUrl(
      doc.image,
      'onsen',
      doc.slug,
      `onsen,${doc.slug},japan`
    ),
  })),
}
```

この処理で、`doc.image`（文字列）が`resolveImageUrl()`に渡され、最終的に`getOnsenImage()`が呼ばれる。

## 考えられる問題

### 問題1: ビルド時に画像が解決されていない

**可能性**: `resolveImageUrls()`が正しく動作していない、またはビルド時にエラーが発生している

**確認方法**:
```bash
npm run build
# ビルドログを確認してエラーがないか確認
```

### 問題2: Next.js Imageコンポーネントの設定問題

**可能性**: `next.config.mjs`の`remotePatterns`が正しく設定されていない

**確認**: `next.config.mjs`を確認
- ✅ `upload.wikimedia.org`が`remotePatterns`に含まれている
- ✅ `images.unoptimized: true`が設定されている（GitHub Pages用）

### 問題3: 画像URLが正しく解決されていない

**可能性**: `resolveImageUrl()`関数内で、文字列の`doc.image`が正しく処理されていない

**確認方法**: ビルド後のコードを確認、またはデバッグログを追加

## 推奨される解決策

### 解決策1: 画像取得スクリプトを再実行

最新の画像を取得して、`data/wikimedia-images.json`を更新：

```bash
node scripts/fetch-wikimedia-images.js
```

### 解決策2: ビルドを実行して画像解決を確認

```bash
npm run build
```

ビルドログでエラーがないか確認。

### 解決策3: 開発サーバーで確認

```bash
npm run dev
```

ブラウザで`http://localhost:3000/docs`を開いて、画像が表示されるか確認。

### 解決策4: 画像URLを直接確認

ブラウザで以下のURLに直接アクセスして、画像が表示されるか確認：

```
https://upload.wikimedia.org/wikipedia/commons/e/e6/Gorakadan_Onsen_Rotenburo_1.jpg
```

### 解決策5: デバッグログを追加

`app/lib/content.ts`の`resolveImageUrl()`関数にログを追加：

```typescript
function resolveImageUrl(...) {
  console.log('Resolving image:', { image, category, key });
  // ... 既存のコード
  const url = getOnsenImage(key);
  console.log('Resolved URL:', url);
  return url;
}
```

## 次のステップ

1. **画像取得スクリプトを実行**して最新の画像を取得
2. **ビルドを実行**して画像解決を確認
3. **開発サーバーで確認**して画像が表示されるか確認
4. **問題が続く場合は**、デバッグログを追加して原因を特定

## 画像取得方法の詳細

詳細は `docs/IMAGE_FETCH_GUIDE.md` を参照してください。
