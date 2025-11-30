# クイックスタートガイド

## 🎯 このリポジトリの目的

関東温泉ガイドサイト専用のJSON-first構造のNext.jsサイトです。

## 📁 重要なファイル

### コンテンツ編集（非エンジニア向け）
**`/themes/onsen-kanto/content.json`**
- このファイルを編集するだけで、サイト全体のコンテンツが変更されます
- ナビゲーション、ページ内容、画像URLなど、すべてここで管理

### コード構造（開発者向け）
**`/app/lib/content.ts`**
- コンテンツ読み込みロジック
- `loadContent()`関数が`content.json`を読み込む

**`/app/layout.tsx`**
- ルートレイアウト
- ヘッダーにデータを渡す

**`/app/components/navigation/Header.tsx`**
- ヘッダーコンポーネント
- JSONから受け取ったデータを表示

## 🔄 データフロー

```
themes/onsen-kanto/content.json
  ↓
app/lib/content.ts (loadContent())
  ↓
各ページコンポーネント
  ↓
表示
```

## ✏️ 編集方法

### ナビゲーションを変更したい
`themes/onsen-kanto/content.json`の`navigation`配列を編集

### ページのコンテンツを変更したい
`themes/onsen-kanto/content.json`の`pages`セクションを編集

### 画像を変更したい
`themes/onsen-kanto/content.json`の各`image`フィールドを編集

## 📚 詳細なドキュメント

- アーキテクチャ設計: `/docs/architecture/COMPLETE_ARCHITECTURE.md`
- 開発ドキュメント: `/docs/development/`
- デプロイ関連: `/docs/deployment/`
