# 画像データ配置場所リスト

## 概要
スクリプトで取得した画像データの配置場所と使用方法をまとめました。

## データファイル

### 1. `data/wikimedia-images.json`
**場所**: `/workspace/data/wikimedia-images.json`

**内容**:
- 21個の温泉地の画像URL、作者、ライセンス情報を格納
- JSON形式
- ファイルサイズ: 約8.4 KB

**データ構造**:
```json
{
  "hakone": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/...",
    "author": "Author Name",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "title": "File:Image title.jpg"
  },
  ...
}
```

**更新方法**:
```bash
npm run fetch-images
```

**コミット**: リポジトリに含める（推奨）

## スクリプトファイル

### 2. `scripts/fetch-wikimedia-images.js`
**場所**: `/workspace/scripts/fetch-wikimedia-images.js`

**用途**: Wikimedia Commons APIから画像を取得

**実行方法**:
```bash
npm run fetch-images
# または
node scripts/fetch-wikimedia-images.js
```

**出力先**: `data/wikimedia-images.json`

## ライブラリファイル（画像データを使用）

### 3. `app/lib/wikimedia.ts`
**場所**: `/workspace/app/lib/wikimedia.ts`

**主要関数**:
- `getCachedOnsenImage(onsenName: string)`: `data/wikimedia-images.json`を読み込んで`ImageMetadata`を返す

**動作**:
1. `data/wikimedia-images.json`を読み込む
2. 指定された温泉地の画像データを取得
3. `ImageMetadata`オブジェクトに変換して返す

### 4. `app/lib/images.ts`
**場所**: `/workspace/app/lib/images.ts`

**主要関数**:
- `getOnsenImageAsync(onsenSlug: string)`: `wikimedia.ts`の`getCachedOnsenImage()`を呼び出し

**動作**:
1. `wikimedia.ts`の`getCachedOnsenImage()`を呼び出す
2. 画像URLを取得
3. フォールバック処理（必要に応じて）

### 5. `app/lib/content.ts`
**場所**: `/workspace/app/lib/content.ts`

**動作**: コンテンツ解決時に画像URLを解決

## ワークフローの変更

### 6. `.github/workflows/pages.yml`
**変更内容**: 画像取得ステップを削除

**変更前**:
```yaml
- name: Fetch Wikimedia images
  run: node scripts/fetch-wikimedia-images.js
```

**変更後**: 削除（リポジトリにコミットされた画像を使用）

### 7. `.github/workflows/nextjs.yml`
**変更内容**: 画像取得ステップを削除

**変更前**:
```yaml
- name: Fetch Wikimedia images
  run: node scripts/fetch-wikimedia-images.js
```

**変更後**: 削除（リポジトリにコミットされた画像を使用）

## package.jsonの変更

### 8. `package.json`
**変更内容**:
- `prebuild`スクリプトを削除
- `fetch-images`スクリプトは残存（手動実行用）

**変更前**:
```json
{
  "scripts": {
    "prebuild": "npm run fetch-images",
    "fetch-images": "node scripts/fetch-wikimedia-images.js"
  }
}
```

**変更後**:
```json
{
  "scripts": {
    "fetch-images": "node scripts/fetch-wikimedia-images.js"
  }
}
```

## データフロー

```
1. 開発者が手動で実行
   npm run fetch-images
   ↓
2. scripts/fetch-wikimedia-images.js が実行
   ↓
3. Wikimedia Commons APIから画像を取得
   ↓
4. data/wikimedia-images.json に保存
   ↓
5. リポジトリにコミット
   ↓
6. GitHub Actionsでビルド
   ↓
7. app/lib/wikimedia.ts が data/wikimedia-images.json を読み込み
   ↓
8. 画像URLがサイトに反映
```

## 画像一覧（21個）

1. hakone
2. hakone-yunohana
3. hakone-gora
4. hakone-sengokuhara
5. kusatsu
6. kusatsu-yubatake
7. kusatsu-sainokawara
8. kinugawa
9. ikaho
10. nasu
11. minakami
12. shima
13. nikko
14. shiobara
15. atami
16. ito
17. shuzenji
18. shimoda
19. yugawara
20. okutama
21. chichibu

## 更新手順

1. 画像を更新したい場合:
   ```bash
   npm run fetch-images
   ```

2. 変更を確認:
   ```bash
   git diff data/wikimedia-images.json
   ```

3. コミット:
   ```bash
   git add data/wikimedia-images.json
   git commit -m "Update Wikimedia images"
   git push
   ```

## メリット

- ✅ ビルドが安定（外部APIに依存しない）
- ✅ ビルド時間が短縮
- ✅ 再現性が高い（同じ画像が常に使用される）
- ✅ 画像の変更を明示的に管理できる
- ✅ オフラインでもビルド可能
