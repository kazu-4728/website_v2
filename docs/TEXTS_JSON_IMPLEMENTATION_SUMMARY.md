# texts.json 実装サマリー

最終更新: 2025/11/30

## 📋 実装内容

温泉テーマ用の文言（ラベル・ボタン・メッセージなど）をすべてJSONから管理できるように、`texts.json` とその型定義を追加しました。

---

## 📝 変更ファイル一覧

### 1. 新規作成ファイル

#### `themes/onsen-kanto/texts.json`
- **目的**: 温泉テーマ用の文言を定義するJSONファイル
- **内容**: 
  - `nav`: ナビゲーション関連（バックリンク、ページネーション）
  - `pages`: ページタイトル・説明文
  - `buttons`: ボタンラベル
  - `form`: フォームラベルとプレースホルダー
  - `messages`: エラーメッセージ・空状態
  - `ui`: UI要素・ラベル

---

### 2. 変更ファイル

#### `app/lib/content.ts`
- **変更内容**:
  1. **型定義の追加**
     - `TextsConfig` インターフェースを追加（export）
     - `ContentConfig` インターフェースに `texts: TextsConfig` プロパティを追加
  
  2. **関数の追加**
     - `loadTexts()`: `texts.json` を読み込む関数を追加
     - `loadContent()`: `loadTexts()` を呼び出して `texts` を `ContentConfig` に統合
  
  3. **フォールバックデータの追加**
     - `fallbackTexts`: エラー時のフォールバック用テキストデータを追加
     - `fallbackContent`: `texts` プロパティを追加

---

## 🎯 JSON構造の説明

### カテゴリー別の用途

| カテゴリー | 用途 | 主な項目 |
|-----------|------|---------|
| **nav** | ナビゲーション関連 | `backLinks`（戻るリンク）、`pagination`（ページネーション） |
| **pages** | ページタイトル・説明文 | `onsenGuide`（温泉ガイドページ）、`contact`（お問い合わせページ） |
| **buttons** | ボタンラベル | `learnMore`、`readStory`、`learnMoreEn`、`submit` |
| **form** | フォーム関連 | `labels`（ラベル）、`placeholders`（プレースホルダー）、`fields`（その他フィールド） |
| **messages** | メッセージ | `notFound`（コンテンツが見つからない場合のメッセージ） |
| **ui** | UI要素・ラベル | `labels`（各種UIラベル） |

---

## 📊 使用例

### 基本的な使い方

```typescript
import { loadContent } from '@/app/lib/content';

// コンポーネント内で
const content = await loadContent();

// テキストを取得
const backLinkText = content.texts.nav.backLinks.home; // "ホームに戻る"
const buttonText = content.texts.buttons.learnMore; // "詳しく見る"
const formLabel = content.texts.form.labels.name; // "お名前"
const notFoundMsg = content.texts.messages.notFound.docs; // "温泉ガイドが見つかりませんでした。"
```

### コンポーネントでの使用例

```tsx
// app/docs/page.tsx
export default async function DocsPage() {
  const content = await loadContent();
  const texts = content.texts;
  
  return (
    <div>
      <Link href="/">
        {texts.nav.backLinks.home}
      </Link>
      <h1>{texts.pages.onsenGuide.title}</h1>
      <p>{texts.pages.onsenGuide.description}</p>
      {docs.length === 0 && (
        <p>{texts.messages.notFound.docs}</p>
      )}
    </div>
  );
}
```

---

## 🔧 型定義の構造

```typescript
export interface TextsConfig {
  nav: {
    backLinks: { home: string; docs: string; blog: string };
    pagination: { previous: string; next: string };
  };
  pages: {
    onsenGuide: { title: string; description: string; defaultSubtitle: string };
    contact: { title: string };
  };
  buttons: {
    learnMore: string;
    readStory: string;
    learnMoreEn: string;
    submit: string;
  };
  form: {
    labels: { name: string; email: string; message: string };
    placeholders: { name: string; email: string; message: string };
    fields: { email: { label: string }; office: { label: string } };
  };
  messages: {
    notFound: { docs: string; blog: string; features: string; contact: string };
  };
  ui: {
    labels: {
      tableOfContents: string;
      documentation: string;
      readyToDeploy: string;
      interactiveDemoLoading: string;
    };
  };
}
```

---

## ✅ 次のステップ

1. **コンポーネントの更新**: ハードコーディングされたテキストを `content.texts` から取得するように変更
2. **追加テキストの定義**: 必要に応じて `texts.json` に新しい項目を追加
3. **型定義の更新**: 新しい項目を追加した場合は `TextsConfig` 型定義も更新

---

## 🔗 関連ドキュメント

- `docs/TEXTS_JSON_GUIDE.md` - texts.json の詳細ガイド
- `docs/HARDCODED_CONTENT_AUDIT.md` - ハードコーディング箇所の洗い出し
- `themes/onsen-kanto/texts.json` - テキスト定義ファイル
- `app/lib/content.ts` - コンテンツローダーと型定義
