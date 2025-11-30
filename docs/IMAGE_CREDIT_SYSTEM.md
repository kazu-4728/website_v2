# 画像クレジットシステム

## 概要

このシステムは、Unsplashの画像を使用し、適切な著作権情報を表示するためのものです。

## 実装内容

### 1. 画像メタデータ管理

`app/lib/images.ts`で、各画像に以下の情報を管理：
- 画像URL
- 写真家名
- 写真家のUnsplashプロフィールURL
- Unsplash画像ページURL
- 画像の説明

### 2. ImageCreditコンポーネント

`app/components/ui/ImageCredit.tsx`で、画像のクレジット情報を表示：
- 写真家名へのリンク
- Unsplashへのリンク
- 位置指定（bottom-left, bottom-right, top-left, top-right）

### 3. 使用例

```tsx
import { ImageCredit } from '../ui/ImageCredit';
import { getImageMetadata } from '../../lib/images';

// メタデータを取得
const imageMetadata = getImageMetadata('hero', 'main');

// コンポーネントで使用
<ImageCredit metadata={imageMetadata} position="bottom-right" />
```

## Unsplashライセンス

- **ライセンス**: Unsplash License (https://unsplash.com/license)
- **商用利用**: 無料で商用利用可能
- **クレジット**: 推奨されるが必須ではない
- **制限**: 画像を再配布してはいけない（Unsplashのサービスとして提供する場合を除く）

## 現在の画像

現在、全ての画像は仮の画像ID（`photo-1540555700478-4be289fbecef`）を使用しています。

### 次のステップ

1. Unsplashで実際の温泉画像を検索
2. 適切な画像IDを特定
3. `app/lib/images.ts`の`createImageMetadata`呼び出しを更新
4. 各温泉地に適した画像を割り当て

## 注意事項

- 画像IDは実際の温泉画像に置き換える必要があります
- 写真家の情報は正確に記載してください
- Unsplashの利用規約を遵守してください
