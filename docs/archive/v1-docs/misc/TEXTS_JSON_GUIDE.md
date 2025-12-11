# texts.json ガイド

最終更新: 2025/11/30

## 📋 概要

`themes/onsen-kanto/texts.json` は、温泉テーマ用の文言（ラベル・ボタン・メッセージなど）をすべてJSONから管理するためのファイルです。

---

## 📁 ファイル構造

```
themes/onsen-kanto/
├── content.json    # サイトコンテンツ（ページ構造、画像など）
└── texts.json      # 文言・ラベル・メッセージ（新規追加）
```

---

## 📊 JSON構造のサンプル

```json
{
  "nav": {
    "backLinks": {
      "home": "ホームに戻る",
      "docs": "温泉ガイド一覧に戻る",
      "blog": "特集記事一覧に戻る"
    },
    "pagination": {
      "previous": "前の温泉地",
      "next": "次の温泉地"
    }
  },
  "pages": {
    "onsenGuide": {
      "title": "温泉ガイド",
      "description": "関東エリアの名湯・秘湯を徹底ガイド...",
      "defaultSubtitle": "Documentation"
    },
    "contact": {
      "title": "お問い合わせ"
    }
  },
  "buttons": {
    "learnMore": "詳しく見る",
    "readStory": "Read Story",
    "learnMoreEn": "Learn more",
    "submit": "送信する"
  },
  "form": {
    "labels": {
      "name": "お名前",
      "email": "メールアドレス",
      "message": "メッセージ"
    },
    "placeholders": {
      "name": "山田 太郎",
      "email": "example@email.com",
      "message": "お問い合わせ内容をご記入ください..."
    },
    "fields": {
      "email": {
        "label": "Email"
      },
      "office": {
        "label": "Office"
      }
    }
  },
  "messages": {
    "notFound": {
      "docs": "温泉ガイドが見つかりませんでした。",
      "blog": "No posts found.",
      "features": "Features content not found.",
      "contact": "Contact content not found."
    }
  },
  "ui": {
    "labels": {
      "tableOfContents": "Table of Contents",
      "documentation": "Documentation",
      "readyToDeploy": "Ready to Deploy?",
      "interactiveDemoLoading": "Interactive Demo Module Loading..."
    }
  }
}
```

---

## 🎯 カテゴリー別の用途

### 1. `nav` - ナビゲーション関連

**用途**: バックリンクやページネーションの文言

- `backLinks`: 各ページの「戻る」リンクのテキスト
  - `home`: ホームページへの戻るリンク
  - `docs`: ドキュメント一覧への戻るリンク
  - `blog`: ブログ一覧への戻るリンク
- `pagination`: ページネーションのラベル
  - `previous`: 「前の」リンクのテキスト
  - `next`: 「次の」リンクのテキスト

**使用例**:
```typescript
const content = await loadContent();
const backLinkText = content.texts.nav.backLinks.home; // "ホームに戻る"
const prevText = content.texts.nav.pagination.previous; // "前の温泉地"
```

---

### 2. `pages` - ページタイトル・説明文

**用途**: 各ページのタイトルと説明文

- `onsenGuide`: 温泉ガイドページ（`/docs`）
  - `title`: ページタイトル
  - `description`: ページの説明文
  - `defaultSubtitle`: デフォルトのサブタイトル（ドキュメントがない場合）
- `contact`: お問い合わせページ（`/contact`）
  - `title`: ページタイトル

**使用例**:
```typescript
const content = await loadContent();
const guideTitle = content.texts.pages.onsenGuide.title; // "温泉ガイド"
const guideDesc = content.texts.pages.onsenGuide.description;
```

---

### 3. `buttons` - ボタンラベル

**用途**: ボタンやリンクのラベルテキスト

- `learnMore`: 「詳しく見る」ボタン（日本語）
- `readStory`: 「Read Story」ボタン（英語）
- `learnMoreEn`: 「Learn more」リンク（英語）
- `submit`: 「送信する」ボタン

**使用例**:
```typescript
const content = await loadContent();
const buttonText = content.texts.buttons.learnMore; // "詳しく見る"
const submitText = content.texts.buttons.submit; // "送信する"
```

---

### 4. `form` - フォーム関連

**用途**: フォームのラベルとプレースホルダー

- `labels`: フォームフィールドのラベル
  - `name`: 名前フィールドのラベル
  - `email`: メールアドレスフィールドのラベル
  - `message`: メッセージフィールドのラベル
- `placeholders`: プレースホルダーテキスト
  - `name`: 名前フィールドのプレースホルダー
  - `email`: メールアドレスフィールドのプレースホルダー
  - `message`: メッセージフィールドのプレースホルダー
- `fields`: その他のフィールドラベル
  - `email.label`: Emailフィールドのラベル（英語）
  - `office.label`: Officeフィールドのラベル（英語）

**使用例**:
```typescript
const content = await loadContent();
const nameLabel = content.texts.form.labels.name; // "お名前"
const namePlaceholder = content.texts.form.placeholders.name; // "山田 太郎"
const emailLabel = content.texts.form.fields.email.label; // "Email"
```

---

### 5. `messages` - メッセージ

**用途**: エラーメッセージや空状態のメッセージ

- `notFound`: コンテンツが見つからない場合のメッセージ
  - `docs`: ドキュメントが見つからない場合
  - `blog`: ブログ記事が見つからない場合
  - `features`: 機能ページが見つからない場合
  - `contact`: お問い合わせページが見つからない場合

**使用例**:
```typescript
const content = await loadContent();
const notFoundMsg = content.texts.messages.notFound.docs; // "温泉ガイドが見つかりませんでした。"
```

---

### 6. `ui` - UI要素・ラベル

**用途**: UI要素のラベルやテキスト

- `labels`: 各種UIラベル
  - `tableOfContents`: 目次のラベル
  - `documentation`: ドキュメントのデフォルトラベル
  - `readyToDeploy`: 「Ready to Deploy?」セクションのタイトル
  - `interactiveDemoLoading`: インタラクティブデモのローディングメッセージ

**使用例**:
```typescript
const content = await loadContent();
const tocLabel = content.texts.ui.labels.tableOfContents; // "Table of Contents"
```

---

## 🔧 TypeScript型定義

`app/lib/content.ts` に `TextsConfig` インターフェースが定義されています：

```typescript
export interface TextsConfig {
  nav: {
    backLinks: {
      home: string;
      docs: string;
      blog: string;
    };
    pagination: {
      previous: string;
      next: string;
    };
  };
  pages: {
    onsenGuide: {
      title: string;
      description: string;
      defaultSubtitle: string;
    };
    contact: {
      title: string;
    };
  };
  buttons: {
    learnMore: string;
    readStory: string;
    learnMoreEn: string;
    submit: string;
  };
  form: {
    labels: {
      name: string;
      email: string;
      message: string;
    };
    placeholders: {
      name: string;
      email: string;
      message: string;
    };
    fields: {
      email: { label: string };
      office: { label: string };
    };
  };
  messages: {
    notFound: {
      docs: string;
      blog: string;
      features: string;
      contact: string;
    };
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

`ContentConfig` インターフェースに `texts: TextsConfig` プロパティが追加され、`loadContent()` 関数で自動的に読み込まれます。

---

## 📝 使用方法

### 基本的な使い方

```typescript
import { loadContent } from '@/app/lib/content';

// コンポーネント内で
const content = await loadContent();

// テキストを取得
const backLinkText = content.texts.nav.backLinks.home;
const buttonText = content.texts.buttons.learnMore;
const formLabel = content.texts.form.labels.name;
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
    </div>
  );
}
```

---

## 🔗 関連ファイル

- `themes/onsen-kanto/texts.json` - テキスト定義ファイル
- `app/lib/content.ts` - コンテンツローダーと型定義
- `docs/HARDCODED_CONTENT_AUDIT.md` - ハードコーディング箇所の洗い出し

---

## ✅ チェックリスト

新しいテキストを追加する際は、以下を確認してください：

- [ ] `themes/onsen-kanto/texts.json` に適切なカテゴリーに追加
- [ ] `app/lib/content.ts` の `TextsConfig` 型定義を更新
- [ ] `fallbackTexts` にもデフォルト値を追加
- [ ] コンポーネントで `content.texts` から取得するように変更
