# リポジトリ構造設計書

## 設計原則

1. **単一の情報源**: `themes/onsen-kanto/content.json`が唯一のコンテンツソース
2. **明確な依存関係**: すべてのファイルの依存関係を明確化
3. **使用されていないファイルの整理**: 不要なファイルは削除または整理

## ディレクトリ構成

```
/
├── app/                          # Next.js App Router
│   ├── components/              # 再利用可能なコンポーネント
│   │   ├── navigation/         # ナビゲーション関連
│   │   ├── home/               # ホームページ用コンポーネント
│   │   ├── ui/                 # UIコンポーネント
│   │   └── icons/              # アイコンコンポーネント
│   ├── lib/                     # ユーティリティ関数
│   │   └── content.ts          # コンテンツ読み込みロジック（重要）
│   ├── page.tsx                 # トップページ
│   ├── layout.tsx               # ルートレイアウト
│   └── [各ページ]/              # 各ページ
├── themes/                      # テーマ設定
│   └── onsen-kanto/            # 関東温泉テーマ
│       └── content.json        # メインコンテンツ（唯一の情報源）
├── config/                      # 設定ファイル（使用されていない）
│   └── site.config.ts          # ❌ 使用されていない（削除推奨）
└── public/                      # 静的ファイル
    └── images/                  # 画像ファイル
```

## ファイル依存関係マップ

### コンテンツ読み込みフロー

```
app/layout.tsx
  └─> app/lib/content.ts
      └─> themes/onsen-kanto/content.json

app/page.tsx
  └─> app/lib/content.ts
      └─> themes/onsen-kanto/content.json

app/docs/[slug]/page.tsx
  └─> app/lib/content.ts
      └─> themes/onsen-kanto/content.json

app/components/navigation/Header.tsx
  └─> app/components/icons/index.tsx
  └─> (props from layout.tsx)
```

### 使用されていないファイル

- ❌ `config/site.config.ts` - 使用されていない（削除推奨）
- ❌ `app/config/theme.config.ts` - 使用されていない（onsen-kantoでは不要）

## データフロー

1. **コンテンツ読み込み**
   - `app/lib/content.ts`が`themes/onsen-kanto/content.json`を読み込む
   - 環境変数`NEXT_PUBLIC_THEME`でテーマを選択（デフォルト: `onsen-kanto`）

2. **データの配布**
   - `layout.tsx`が`loadContent()`を呼び出し、ヘッダーにデータを渡す
   - 各ページが`loadContent()`を呼び出し、ページ固有のデータを取得

3. **コンポーネントの表示**
   - コンポーネントがpropsでデータを受け取り、表示

## 修正が必要な項目

1. **画像URL**: すべての画像を明確に温泉らしいものに変更
2. **ハンバーガーメニュー**: z-indexと表示ロジックの修正（完了）
3. **テキスト量**: すべてのサブページのテキストを拡充（完了）
4. **リポジトリ構成**: 使用されていないファイルの削除
