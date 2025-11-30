# 画像・UI問題の報告書

## 問題の概要

画像が適切に表示されず、UIも崩れています。

## 発見された問題点

### 1. 画像がすべて同じになっている

**原因**:
- `app/lib/content.ts`の`resolveImageUrls()`関数が`getOnsenImage()`を呼び出している
- `getOnsenImage()`は`getThemeImage('onsen', slug, ...)`を呼び出している
- `getThemeImage()`は`THEME_IMAGES['onsen-kanto']['onsen'][slug]`を参照している
- `ONSEN_KANTO_IMAGES.onsen`には、すべての温泉地に対して**同じUnsplash画像ID** (`'1540555700478-4be289fbecef'`)が設定されている

**影響**:
- すべての温泉地ページで同じ画像が表示される
- 視覚的な区別がつかない
- ユーザー体験が悪化

**該当コード**:
- `app/lib/images.ts` 115-246行目: `ONSEN_KANTO_IMAGES.onsen`の定義
- すべての温泉地が同じ画像ID `'1540555700478-4be289fbecef'`を使用

### 2. Wikimedia画像が使われていない

**原因**:
- `data/wikimedia-images.json`には適切な画像URLが保存されている（21個）
- しかし、`resolveImageUrls()`は`getOnsenImage()`（同期版）を使っている
- `getOnsenImageAsync()`（非同期版）はWikimediaから取得するが、`resolveImageUrls()`は同期関数なので使えない

**影響**:
- 取得したWikimedia画像が実際には使用されていない
- Unsplashの同じ画像が表示される

**該当コード**:
- `app/lib/content.ts` 348行目: `resolveImageUrl(doc.image, 'onsen', doc.slug, ...)`
- `app/lib/images.ts` 486行目: `getOnsenImage()`の実装

### 3. 準備中画像の問題

**現状**:
- `hakone-yunohana`, `kusatsu-sainokawara`, `okutama`の3つが準備中画像を使用
- すべて同じ箱根の画像 (`Ashinoyu_onsen_-_Hakone.jpg`)を代用している
- しかし、実際には`ONSEN_KANTO_IMAGES`のUnsplash画像が表示されるため、準備中画像も機能していない

### 4. UIの崩れ

**原因**:
- すべて同じ画像が表示されるため、ページ間の視覚的な区別がつかない
- 画像のアスペクト比やサイズが統一されていない可能性

## 問題の根本原因

1. **画像解決の二重構造**:
   - `ONSEN_KANTO_IMAGES`（Unsplash画像ID）と`data/wikimedia-images.json`（Wikimedia画像URL）の2つのシステムが存在
   - `resolveImageUrls()`は`ONSEN_KANTO_IMAGES`を優先して使用
   - `data/wikimedia-images.json`の画像が実際には使われていない

2. **同期/非同期の不一致**:
   - `resolveImageUrls()`は同期関数
   - `getOnsenImageAsync()`は非同期関数
   - 非同期関数を同期関数から呼び出せない

3. **画像IDの重複**:
   - `ONSEN_KANTO_IMAGES.onsen`のすべてのエントリが同じ画像IDを使用
   - これにより、すべての温泉地で同じ画像が表示される

## 影響範囲

- **すべてのドキュメントページ** (`/docs/[slug]`)
- **ホームページのグリッドギャラリー** (`/`)
- **画像メタデータの取得** (`getImageMetadata()`)

## 修正が必要なファイル

1. `app/lib/images.ts`
   - `getOnsenImage()`を修正して`data/wikimedia-images.json`から読み込む
   - `ONSEN_KANTO_IMAGES.onsen`を`data/wikimedia-images.json`のデータで更新

2. `app/lib/content.ts`
   - `resolveImageUrls()`が正しくWikimedia画像を使用することを確認

3. `data/wikimedia-images.json`
   - 準備中画像の代用画像を適切なものに変更（現在はすべて箱根の画像）

## 推奨される修正方法

1. **`getOnsenImage()`を修正**:
   - `data/wikimedia-images.json`から同期的に画像URLを読み込む
   - フォールバックとして`ONSEN_KANTO_IMAGES`を使用

2. **`ONSEN_KANTO_IMAGES.onsen`を更新**:
   - `data/wikimedia-images.json`のデータを使用して更新
   - または、`getOnsenImage()`で直接`data/wikimedia-images.json`を参照

3. **準備中画像の改善**:
   - 各場所に適した代替画像を設定
   - または、一般的な温泉画像を使用
