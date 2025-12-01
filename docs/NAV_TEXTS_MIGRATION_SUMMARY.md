# ナビゲーション・バックリンク文言のJSON化完了サマリー

最終更新: 2025/11/30

## 📋 実装内容

`HARDCODED_CONTENT_AUDIT.md` に記載されていたナビゲーション・バックリンクのハードコーディングをすべて `content.texts.nav` から取得するように変更しました。

---

## 📝 変更ファイル一覧

### 変更したファイル（6ファイル）

1. **`app/docs/page.tsx`**
   - バックリンク「ホームに戻る」を `content.texts.nav.backLinks.home` から取得

2. **`app/docs/[slug]/page.tsx`**
   - バックリンク「温泉ガイド一覧に戻る」を `content.texts.nav.backLinks.docs` から取得
   - ページネーション「前の温泉地」を `content.texts.nav.pagination.previous` から取得
   - ページネーション「次の温泉地」を `content.texts.nav.pagination.next` から取得

3. **`app/blog/page.tsx`**
   - バックリンク「ホームに戻る」を `content.texts.nav.backLinks.home` から取得

4. **`app/blog/[slug]/page.tsx`**
   - バックリンク「特集記事一覧に戻る」を `content.texts.nav.backLinks.blog` から取得

5. **`app/features/page.tsx`**
   - バックリンク「ホームに戻る」を `content.texts.nav.backLinks.home` から取得

6. **`app/contact/page.tsx`**
   - バックリンク「ホームに戻る」を `content.texts.nav.backLinks.home` から取得

---

## 🔄 Before/After コード例

### 1. `app/docs/page.tsx`

**Before:**
```tsx
export default async function DocsIndexPage() {
  const content = await loadContent();
  const docs = content.pages.docs || [];

  return (
    <main>
      <Link href="/">
        ホームに戻る
      </Link>
    </main>
  );
}
```

**After:**
```tsx
export default async function DocsIndexPage() {
  const content = await loadContent();
  const docs = content.pages.docs || [];
  const texts = content.texts;

  return (
    <main>
      <Link href="/">
        {texts.nav.backLinks.home}
      </Link>
    </main>
  );
}
```

---

### 2. `app/docs/[slug]/page.tsx`

**Before:**
```tsx
<Link href="/docs">
  温泉ガイド一覧に戻る
</Link>

<div>前の温泉地</div>
<div>次の温泉地</div>
```

**After:**
```tsx
const texts = content.texts;

<Link href="/docs">
  {texts.nav.backLinks.docs}
</Link>

<div>{texts.nav.pagination.previous}</div>
<div>{texts.nav.pagination.next}</div>
```

---

### 3. `app/blog/page.tsx`

**Before:**
```tsx
export default async function BlogPage() {
  const content = await loadContent();
  // ...
  return (
    <Link href="/">
      ホームに戻る
    </Link>
  );
}
```

**After:**
```tsx
export default async function BlogPage() {
  const content = await loadContent();
  const texts = content.texts;
  // ...
  return (
    <Link href="/">
      {texts.nav.backLinks.home}
    </Link>
  );
}
```

---

### 4. `app/blog/[slug]/page.tsx`

**Before:**
```tsx
<Link href="/blog">
  特集記事一覧に戻る
</Link>
```

**After:**
```tsx
const content = await loadContent();
const texts = content.texts;

<Link href="/blog">
  {texts.nav.backLinks.blog}
</Link>
```

---

### 5. `app/features/page.tsx`

**Before:**
```tsx
<Link href="/">
  ホームに戻る
</Link>
```

**After:**
```tsx
const texts = content.texts;

<Link href="/">
  {texts.nav.backLinks.home}
</Link>
```

---

### 6. `app/contact/page.tsx`

**Before:**
```tsx
<Link href="/">
  ホームに戻る
</Link>
```

**After:**
```tsx
const texts = content.texts;

<Link href="/">
  {texts.nav.backLinks.home}
</Link>
```

---

## 📊 変更内容の詳細

### 変更パターン

すべてのファイルで以下のパターンで変更しました：

1. **`loadContent()` の呼び出し後に `texts` を取得**
   ```tsx
   const content = await loadContent();
   const texts = content.texts;
   ```

2. **ハードコーディングされた文字列を `texts.nav.*` に置き換え**
   - `"ホームに戻る"` → `{texts.nav.backLinks.home}`
   - `"温泉ガイド一覧に戻る"` → `{texts.nav.backLinks.docs}`
   - `"特集記事一覧に戻る"` → `{texts.nav.backLinks.blog}`
   - `"前の温泉地"` → `{texts.nav.pagination.previous}`
   - `"次の温泉地"` → `{texts.nav.pagination.next}`

---

## ✅ 確認事項

- ✅ `texts.json` に必要なキーがすべて定義されている
- ✅ `TextsConfig` 型定義が正しく設定されている
- ✅ すべてのコンポーネントで `content.texts.nav` から取得するように変更
- ✅ リンターエラーなし
- ✅ TypeScriptの型チェック通過

---

## 📝 今後のナビ文言変更方法

**ナビゲーション・バックリンクの文言を変更したい場合は、`themes/onsen-kanto/texts.json` の `nav` セクションを編集してください。**

具体的には：
- `nav.backLinks.home`: ホームへの戻るリンク
- `nav.backLinks.docs`: ドキュメント一覧への戻るリンク
- `nav.backLinks.blog`: ブログ一覧への戻るリンク
- `nav.pagination.previous`: 「前の」リンクのテキスト
- `nav.pagination.next`: 「次の」リンクのテキスト

---

## 🔗 関連ファイル

- `themes/onsen-kanto/texts.json` - テキスト定義ファイル（`nav` セクション）
- `app/lib/content.ts` - `TextsConfig` 型定義と `loadTexts()` 関数
- `docs/HARDCODED_CONTENT_AUDIT.md` - ハードコーディング箇所の洗い出し
- `docs/TEXTS_JSON_GUIDE.md` - texts.json の詳細ガイド
