# ディレクトリ整理サマリー

## 削除したファイル・ディレクトリ

### 1. 空のディレクトリ
- `app/[slug]/` - 空のディレクトリを削除

### 2. テスト用ページ
- `app/image-test/` - 外部APIテスト用ページ（不要）

### 3. 重複スクリプト
- `scripts/verify-assets-policy.js` - `.mjs`版に統一

## 非推奨化したファイル（後方互換性のため保持）

### 1. `app/lib/onsen-data.ts`
- **状態**: `@deprecated`マークを追加
- **理由**: 新しい構造`src/features/onsen/repository.ts`に移行
- **対応**: 新しいコードでは`src/features/onsen/repository.ts`を使用

### 2. `app/lib/onsen-types.ts`
- **状態**: `@deprecated`マークを追加、新しい型を再エクスポート
- **理由**: 新しい構造`src/domain/onsen/types.ts`に移行
- **対応**: 新しいコードでは`src/domain/onsen/types.ts`を使用

## 移行した依存関係

### `app/lib/images.ts`
- **変更前**: `app/lib/onsen-data.ts`に依存
- **変更後**: `src/features/onsen/repository.ts`に依存
- **影響**: `getOnsenImage()`が非同期関数に変更（既存コードは`getThemeImage()`を使用するように修正）

### `app/lib/content.ts`
- **変更**: `getOnsenImage()`の同期呼び出しを`getThemeImage()`に変更
- **理由**: `getOnsenImage()`が非同期になったため

## 現在のディレクトリ構造

```
website_v2/
├── app/                    # Next.js App Router
│   ├── components/         # UIコンポーネント（既存）
│   ├── lib/                # ユーティリティ（一部非推奨）
│   ├── onsen/              # 温泉ページ（新規）
│   └── ...
├── src/                    # 新しいアーキテクチャ層
│   ├── domain/            # ドメイン層（型・検証・正規化）
│   ├── features/          # 機能層（Repository・Queries）
│   └── ui/                # UI層（コンポーネント・レイアウト）
├── data/                   # SSOT（JSONデータ）
├── scripts/                # ビルド・検証スクリプト
├── public/                 # 静的アセット
└── docs/                   # ドキュメント
```

## 移行ガイド

### 新しいコードで使用すべきインポート

```typescript
// ❌ 古い方法（非推奨）
import { getOnsenSpot } from '@/app/lib/onsen-data';
import { OnsenSpot } from '@/app/lib/onsen-types';

// ✅ 新しい方法
import { getOnsenBySlug } from '@/src/features/onsen/repository';
import { OnsenSpot } from '@/src/domain/onsen/types';
import { getAllOnsens, filterByArea } from '@/src/features/onsen/queries';
```

### 画像取得

```typescript
// ❌ 古い方法（非推奨）
import { getOnsenImage } from '@/app/lib/images';
const image = getOnsenImage(slug); // 同期

// ✅ 新しい方法
import { getOnsen } from '@/src/features/onsen/queries';
const onsen = await getOnsen(slug);
const image = onsen.images.hero; // スロット形式
```

## 今後の作業

1. **段階的移行**: 既存コードを新しい構造に移行
2. **非推奨ファイルの削除**: すべての参照を移行した後、`app/lib/onsen-data.ts`と`onsen-types.ts`を削除
3. **型の統一**: `app/lib/onsen-types.ts`のレガシー型を完全に削除

## 注意事項

- 非推奨ファイルは後方互換性のため保持されています
- 新しいコードでは必ず新しい構造（`src/`配下）を使用してください
- 既存コードの移行は段階的に行ってください
