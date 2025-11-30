# 画像自動取得システム

## 概要

Wikimedia Commons APIを使用して、各温泉地の画像を自動的に取得するシステムを実装しました。

## 実装内容

### 1. Wikimedia Commons API統合

`app/lib/wikimedia.ts`で以下の機能を提供：
- `searchWikimediaImages()`: キーワードで画像を検索
- `getOnsenImageFromWikimedia()`: 特定の温泉地の画像を取得
- `getCachedOnsenImage()`: キャッシュ付きで画像を取得

### 2. 自動取得スクリプト

`scripts/fetch-wikimedia-images.js`でビルド前に画像を取得：
- 各温泉地の画像を自動検索
- 適切なライセンス（CC、パブリックドメイン）の画像を選択
- 結果をJSONファイルに保存

### 3. クレジット表示の自動判定

- パブリックドメインの画像は`skipCredit: true`を設定
- クレジット表示が不要な場合は自動的に非表示

## 使用方法

### ビルド前に画像を取得

```bash
node scripts/fetch-wikimedia-images.js
```

これにより、`data/wikimedia-images.json`に画像情報が保存されます。

### コードでの使用

```typescript
import { getOnsenImage } from './lib/images';

// 自動取得を使用（サーバーサイドのみ）
const imageUrl = await getOnsenImage('hakone', true);

// 事前定義された画像を使用（デフォルト）
const imageUrl = getOnsenImage('hakone');
```

## ライセンス対応

- **CCライセンス**: クレジット表示が必要
- **パブリックドメイン**: クレジット表示は不要（自動的に非表示）

## 注意事項

1. **API制限**: Wikimedia Commons APIにはレート制限があります
2. **ビルド時取得**: 実行時の取得は避け、ビルド時に事前取得することを推奨
3. **フォールバック**: 画像が見つからない場合は、事前定義された画像を使用

## 次のステップ

1. `scripts/fetch-wikimedia-images.js`を実行して画像を取得
2. 取得した画像情報を`app/lib/images.ts`に反映
3. 必要に応じて手動で調整
