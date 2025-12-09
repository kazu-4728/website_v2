# 画像自動取得システム実装サマリー

## 実装完了

Wikimedia Commons APIを使用した画像自動取得システムを実装しました。

## 実装内容

### 1. Wikimedia Commons API統合

**ファイル**: `app/lib/wikimedia.ts`

- `searchWikimediaImages()`: キーワードで画像を検索
- `getOnsenImageFromWikimedia()`: 特定の温泉地の画像を取得
- `getCachedOnsenImage()`: キャッシュ付きで画像を取得

### 2. 画像メタデータの拡張

**ファイル**: `app/lib/images.ts`

- `ImageMetadata`インターフェースに`skipCredit`プロパティを追加
- パブリックドメインの画像は自動的にクレジット表示を省略

### 3. クレジット表示の自動判定

**ファイル**: `app/components/ui/ImageCredit.tsx`

- `skipCredit: true`の場合は自動的に非表示
- 著作権問題がない画像はクレジット表示不要

### 4. 自動取得スクリプト

**ファイル**: `scripts/fetch-wikimedia-images.js`

- ビルド前に各温泉地の画像を自動取得
- 適切なライセンス（CC、パブリックドメイン）の画像を選択
- 結果をJSONファイルに保存

## 使用方法

### ビルド前に画像を取得（推奨）

```bash
node scripts/fetch-wikimedia-images.js
```

これにより、`data/wikimedia-images.json`に画像情報が保存されます。

### コードでの使用

```typescript
// 同期版（既存コードとの互換性）
import { getOnsenImage } from './lib/images';
const imageUrl = getOnsenImage('hakone');

// 非同期版（自動取得）
import { getOnsenImageAsync } from './lib/images';
const imageUrl = await getOnsenImageAsync('hakone');
```

## ライセンス対応

- **CCライセンス**: クレジット表示が必要（自動表示）
- **パブリックドメイン**: クレジット表示不要（自動的に非表示）

## 特徴

1. **自動取得**: Wikimedia Commons APIから自動的に画像を取得
2. **著作権対応**: ライセンス情報を自動的に管理
3. **クレジット自動判定**: パブリックドメインの場合は自動的に非表示
4. **フォールバック**: 画像が見つからない場合は事前定義された画像を使用

## 次のステップ

1. `scripts/fetch-wikimedia-images.js`を実行して画像を取得
2. 取得した画像情報を`app/lib/images.ts`に反映（オプション）
3. 必要に応じて手動で調整

## 注意事項

- API制限: Wikimedia Commons APIにはレート制限があります
- ビルド時取得: 実行時の取得は避け、ビルド時に事前取得することを推奨
- フォールバック: 画像が見つからない場合は、事前定義された画像を使用
