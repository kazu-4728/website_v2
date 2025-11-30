# ステップ1完了報告：ヘッダーの完全JSON制御

## 変更ファイル一覧

1. **`themes/onsen-kanto/content.json`**
   - `site.metadata`セクションを追加（title, description）
   - `navigation`配列にサブメニューを追加（温泉ガイドに箱根・草津・鬼怒川のサブメニュー）

2. **`app/lib/content.ts`**
   - `ContentConfig`インターフェースに`site.metadata`を追加
   - `fallbackContent`に`metadata`を追加

3. **`app/components/icons/index.tsx`**
   - `FlameIcon`コンポーネントを追加
   - `getIconComponent`関数を追加（アイコン名からコンポーネントを取得）

4. **`app/components/navigation/Header.tsx`**
   - ハードコーディングされた`navigation`配列を削除
   - `HeaderProps`インターフェースを追加（logo, navigationをpropsで受け取る）
   - JSONから受け取ったデータを使用するように変更
   - ロゴアイコンを`getIconComponent`で動的に取得
   - CTAボタンも`navigation`配列の`variant: "primary"`から取得

5. **`app/layout.tsx`**
   - ハードコーディングされたメタデータを削除
   - `generateMetadata`関数を追加（JSONからメタデータを読み込み）
   - `loadContent`でJSONを読み込み、Headerにpropsで渡す

## Before/After の挙動の違い

### Before
- ヘッダーのナビゲーション項目が「Home」「Journey」「Blog」「Showcase」とハードコーディング
- ロゴが「Code Voyage」固定、アイコンが`RocketIcon`固定
- CTAボタンが「Join Us」固定
- HTMLメタデータが「GitHub Docs 完全マニュアル」固定

### After
- すべてのヘッダー要素が`themes/onsen-kanto/content.json`から制御可能
- ナビゲーション項目が「ホーム」「温泉ガイド」「特集記事」「おすすめプラン」「お問い合わせ」に変更
- ロゴが「温泉紀行」、アイコンが`FlameIcon`（flame）に変更
- CTAボタンが「お問い合わせ」に変更
- HTMLメタデータが「関東温泉紀行 | 名湯・秘湯を巡る旅」に変更
- サブメニュー機能もJSONから制御可能（温泉ガイドに箱根・草津・鬼怒川のサブメニューを追加）

## 今後どのJSONを編集すれば何が変わるか

### ナビゲーション変更
**編集箇所**: `themes/onsen-kanto/content.json`の`navigation`配列

**例**:
```json
"navigation": [
  { "label": "ホーム", "href": "/" },
  { 
    "label": "温泉ガイド", 
    "href": "/docs",
    "submenu": [
      { "label": "箱根温泉", "href": "/docs/hakone" },
      { "label": "草津温泉", "href": "/docs/kusatsu" }
    ]
  }
]
```

**変更内容**:
- `label`: ナビゲーション項目の表示テキスト
- `href`: リンク先URL
- `submenu`: サブメニュー項目の配列（オプション）
- `variant: "primary"`: CTAボタンとして表示（通常のナビゲーション項目とは別スタイル）

### ロゴ変更
**編集箇所**: `themes/onsen-kanto/content.json`の`site.logo`

**例**:
```json
"logo": {
  "text": "温泉紀行",
  "icon": "flame"
}
```

**変更内容**:
- `text`: ロゴのテキスト部分
- `icon`: アイコン名（`flame`, `rocket`, `book`など、`app/components/icons/index.tsx`で定義されているもの）

### サイトタイトル・説明変更
**編集箇所**: `themes/onsen-kanto/content.json`の`site.metadata`

**例**:
```json
"metadata": {
  "title": "関東温泉紀行 | 名湯・秘湯を巡る旅",
  "description": "関東エリアの名湯・秘湯を巡る旅。歴史ある温泉地から隠れた名所まで、心と体を癒す至福の湯を徹底ガイド。"
}
```

**変更内容**:
- `title`: HTMLの`<title>`タグに表示されるタイトル（ブラウザのタブに表示）
- `description`: HTMLの`<meta name="description">`に設定される説明文（SEO用）

## 技術的な注意点

- Headerコンポーネントはクライアントコンポーネント（`'use client'`）のため、サーバーコンポーネント（`layout.tsx`）からpropsでデータを渡す必要がある
- アイコンは`getIconComponent`関数で動的に取得されるため、新しいアイコンを追加する場合は`app/components/icons/index.tsx`に追加し、`getIconComponent`の`iconMap`にも追加する必要がある
