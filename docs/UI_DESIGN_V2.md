# UI 設計 V2 - 完成版

最終更新: 2025-01-XX

## 📋 設計方針

**重要**: このドキュメントに書かれていない UI は新規追加しない。

このドキュメントは、`docs/requirements.md` を前提に、各ページごとのセクション構成、使用コンポーネント、JSON 構造をすべて定義する。

---

## 🏠 ホームページ (`/`)

### セクション構成

1. **S1: Hero（シネマティック温泉スライダー）**
   - コンポーネント: `app/components/home/CinematicHero.tsx`
   - Props: `HomeHero` 型（`content.json` → `pages.home.hero`）
   - 機能:
     - フルスクリーン背景画像（実写温泉）
     - マルチスライド（4枚: 星空/雪見/紅葉/新緑）
     - 自動スライド（3秒間隔、`prefers-reduced-motion` で無効化）
     - PC: ドットクリックで任意のスライドへ
     - モバイル: 指スワイプ（左/右）＋ドット
     - テキストは固定（背景だけが変わる）
   - JSON 構造:
     ```json
     {
       "pages": {
         "home": {
           "hero": {
             "type": "cinematic",
             "title": "心と体を\n癒す旅へ",
             "subtitle": "Healing Journey to Kanto's Finest Hot Springs",
             "description": "...",
             "secondaryDescription": "...",
             "badges": [...],
             "bgImage": { "key": "hero-night" },
             "slides": [
               {
                 "imageKey": "starry_night",
                 "season": "四季",
                 "area": "箱根"
               },
               ...
             ],
             "actions": [...]
           }
         }
       }
     }
     ```

2. **S2: エリアから探す（GridGallery）**
   - コンポーネント: `app/components/home/GridGallery.tsx`
   - Props: `GridGallerySection` 型
   - 機能:
     - 関東の主要温泉地（箱根/草津/鬼怒川/伊香保/那須/水上）をカード表示
     - 各カードは `/docs/[slug]` へのリンク
     - ホバーエフェクト: scale + transition
   - JSON 構造:
     ```json
     {
       "sections": [
         {
           "id": "area-selection",
           "type": "grid-gallery",
           "title": "エリアから探す",
           "items": [
             {
               "title": "箱根温泉郷",
               "description": "...",
               "image": "hakone",
               "href": "/docs/hakone"
             },
             ...
           ]
         }
       ]
     }
     ```

3. **S3: テーマから選ぶ（GridGallery）**
   - コンポーネント: `app/components/home/GridGallery.tsx`（再利用）
   - Props: `GridGallerySection` 型
   - 機能:
     - 日帰り/カップル/家族/絶景のテーマ別カード
     - 将来フィルタ連動予定（今は `/docs` への導線）
   - JSON 構造: 同上（`id: "theme-selection"`）

4. **S4: 旅行者の声（Testimonials）**
   - コンポーネント: `app/components/home/Testimonials.tsx`
   - Props: `TestimonialsSection` 型
   - 機能:
     - 2-4件の実際の滞在レビューを表示
     - アバター画像、名前、役割、コメント
   - JSON 構造:
     ```json
     {
       "sections": [
         {
           "id": "testimonials",
           "type": "testimonials",
           "title": "旅行者の声",
           "items": [
             {
               "content": "...",
               "author": "...",
               "role": "...",
               "avatar": "..."
             },
             ...
           ]
         }
       ]
     }
     ```

5. **S5: 温泉の選び方（Steps）**
   - コンポーネント: `app/components/home/Steps.tsx`
   - Props: `StepsSection` 型
   - 機能:
     - 3ステップ（エリア → 絞り込み → 比較）を視覚的に表示
     - 番号、タイトル、説明
   - JSON 構造:
     ```json
     {
       "sections": [
         {
           "id": "how-to-choose",
           "type": "steps",
           "title": "温泉の選び方",
           "items": [
             {
               "number": "01",
               "title": "エリアを選ぶ",
               "description": "..."
             },
             ...
           ]
         }
       ]
     }
     ```

6. **S6: フルスクリーンCTA**
   - コンポーネント: `app/components/home/CtaFullscreen.tsx`
   - Props: `CtaSection` 型
   - 機能:
     - 「今週末、どの温泉に浸かりますか？」などの問いかけ
     - `/docs` への強い導線
   - JSON 構造:
     ```json
     {
       "sections": [
         {
           "id": "cta",
           "type": "cta-fullscreen",
           "title": "今週末、どの温泉に浸かりますか？",
           "description": "...",
           "bgImage": { "key": "cta-sunset" },
           "action": {
             "label": "温泉ガイドを見る",
             "href": "/docs"
           }
         }
       ]
     }
     ```

---

## 📚 温泉ガイド一覧 (`/docs`)

### セクション構成

1. **ヘッダー**
   - タイトル: `texts.pages.onsenGuide.title`
   - 説明: `texts.pages.onsenGuide.description`
   - バックリンク: `/` へのリンク

2. **温泉カード一覧**
   - コンポーネント: `app/docs/page.tsx` 内で直接実装
   - 機能:
     - `content.pages.docs` から全温泉を取得
     - カード型表示（画像 + タイトル + 説明 + リンク）
     - 各カードは `/docs/[slug]` へのリンク
     - ホバーエフェクト: border-color + scale
   - JSON 構造: `content.json` → `pages.docs[]`

### 将来の拡張
- フィルタ機能（エリア、泉質、日帰り可否など）
- ソート機能（人気順、名前順など）

---

## 📖 温泉詳細ページ (`/docs/[slug]`)

### セクション構成

1. **Hero ヘッダー**
   - 背景画像: `page.image`
   - タイトル: `page.title`
   - サブタイトル: `page.subtitle`
   - 説明: `page.description`
   - バックリンク: `/docs` へのリンク

2. **メインコンテンツ**
   - Markdown レンダリング: `MarkdownRenderer`
   - 目次: `TableOfContents`（デスクトップ: サイドバー、モバイル: 折りたたみ）

3. **温泉データセクション**（`page.onsen` が存在する場合）
   - 地域情報: 都道府県、エリア
   - 泉質・効能: 泉質タイプ、pH、温度、効能リスト
   - 日帰り可否: フラグ + 施設リスト
   - アクセス情報: 最寄り駅、電車/車でのアクセス、駐車場
   - 代表旅館: 名前、特徴、価格帯、公式URL、Google Map URL
   - 季節ごとの魅力: 春夏秋冬の説明

4. **前後ナビゲーション**
   - 前の温泉地: `prevDoc`
   - 次の温泉地: `nextDoc`

### JSON 構造
- `content.json` → `pages.docs[]` の各要素
- `page.onsen` は `OnsenSpot` 型（`onsen-types.ts` 参照）

### 必須要素
- Google Map 埋め込みコンポーネント（共通化）
- すべての温泉地で地図を表示

---

## 🎯 おすすめプラン (`/features`)

### セクション構成

1. **Hero セクション**
   - 背景画像: `featuresData.hero.image`
   - タイトル: `featuresData.hero.title`（HTML可）
   - サブタイトル: `featuresData.hero.subtitle`
   - 説明: `featuresData.hero.description`

2. **プランカード一覧**
   - コンポーネント: `app/features/page.tsx` 内で直接実装
   - 機能:
     - 日帰り/1泊2日/カップル/家族/絶景などのモデルコースカード
     - アイコン、タイトル、説明、画像
   - JSON 構造:
     ```json
     {
       "pages": {
         "features": {
           "items": [
             {
               "title": "日帰り温泉プラン",
               "description": "...",
               "icon": "clock",
               "image": "day-trip"
             },
             ...
           ]
         }
       }
     }
     ```

### 将来の拡張
- フィルタ機能（目的、期間、予算など）
- 詳細ページ（各プランの詳細）

---

## 📝 ブログ一覧 (`/blog`)

### セクション構成

1. **ヘッダー**
   - タイトル: `blogData.title`
   - 説明: `blogData.description`
   - バックリンク: `/` へのリンク

2. **フィーチャード記事**（最初の1件）
   - 大サイズカード表示
   - 画像、カテゴリ、日付、タイトル、要約

3. **記事グリッド**（2件目以降）
   - 2カラムグリッド
   - 画像、カテゴリ、日付、読了時間、タイトル、要約

### JSON 構造
- `content.json` → `pages.blog.posts[]`

### 必須要素
- 最低3本分の「本当にありそうな」記事タイトル・要約・本文を JSON に入れる
- Markdown で表示できるようにする

---

## 📄 ブログ詳細 (`/blog/[slug]`)

### セクション構成

1. **Hero ヘッダー**
   - 背景画像: `post.image`
   - タイトル: `post.title`
   - メタ情報: カテゴリ、日付、読了時間、著者

2. **メインコンテンツ**
   - Markdown レンダリング: `MarkdownRenderer`
   - 目次: `TableOfContents`（オプション）

3. **前後ナビゲーション**（オプション）

### JSON 構造
- `content.json` → `pages.blog.posts[]` の各要素
- `post.content` は Markdown 形式

---

## 📧 お問い合わせ (`/contact`)

### セクション構成

1. **左側: 情報**
   - タイトル: `contactData.title`
   - メールアドレス: `contactData.email`
   - オフィス: `contactData.office`

2. **右側: フォーム**
   - コンポーネント: `app/contact/page.tsx` 内で直接実装
   - フィールド:
     - お名前: `texts.form.labels.name`
     - メールアドレス: `texts.form.labels.email`
     - メッセージ: `texts.form.labels.message`
   - 機能:
     - バリデーション（必須チェック、メール形式）
     - 送信完了メッセージ
     - 実送信: Formspree / mailto など（要件に合う方法を選択）

### JSON 構造
- `content.json` → `pages.contact`
- `texts.json` → `form.*`

---

## 🎨 共通UIコンポーネント

### 1. ヘッダー（`app/components/navigation/Header.tsx`）
- ロゴ: `content.site.logo`
- グローバルナビ: `content.navigation[]`
- モバイル: ハンバーガーメニュー

### 2. フッター（`app/components/layouts/Footer.tsx`）
- サイト名・タグライン: `content.site.name`, `texts.footer.tagline`
- ナビリンク: `content.navigation[]`
- コピーライト: `texts.footer.copyright`

### 3. ボタン（`app/components/ui/Button.tsx`）
- バリアント: `primary`, `secondary`
- サイズ: `sm`, `md`, `lg`, `xl`

### 4. カード（`app/components/ui/GlassCard.tsx`）
- ガラスモーフィズム効果
- ホバーエフェクト

### 5. 画像クレジット（`app/components/ui/ImageCredit.tsx`）
- 画像の著作権情報を表示
- 位置: `bottom-right`, `bottom-left` など

---

## 🖼️ 画像管理

### 画像キーとカテゴリ

- **Hero 画像**: `hero.*`（`starry_night`, `snow`, `autumn_leaves`, `spring_greenery`）
- **温泉地画像**: `onsen.*`（`hakone`, `kusatsu`, `kinugawa` など）
- **セクション画像**: `sections.*`
- **CTA画像**: `cta.*`
- **ブログ画像**: `blog.*`
- **フィーチャー画像**: `features.*`

### 画像取得関数

- `getHeroImage(key)`: Hero 画像を取得
- `getOnsenImage(slug)`: 温泉地画像を取得
- `getSectionImage(sectionId)`: セクション画像を取得
- `getCtaImage()`: CTA画像を取得
- `getBlogImage(slug)`: ブログ画像を取得
- `getFeatureImage(key)`: フィーチャー画像を取得

### 画像要件

- **すべて「明確に温泉と分かる実写」**
- できれば関東の温泉（箱根/草津/塩原/那須など）
- ライセンス: CC BY / CC BY-SA を原則（Wikimedia Commons など）
- URL・作者名・ライセンス表記を `images.ts` にメモ

---

## 🎭 インタラクションパターン

### 1. Hero スライド
- 自動スライド: 3秒間隔
- ドットクリック: 任意のスライドへ
- スワイプ: モバイル対応
- `prefers-reduced-motion`: 自動とアニメーションを無効化

### 2. カードホバー
- scale: `hover:scale-105`
- transition: `transition-transform duration-300`
- border-color: `hover:border-primary-500/50`

### 3. スクロールアニメーション
- Framer Motion の `useInView` を使用
- フェードイン + 上方向スライド

### 4. ボタンホバー
- scale: `hover:scale-105`
- shadow: `hover:shadow-xl`
- アイコンアニメーション: `hover:translate-x-1`

---

## 📐 スタイル統一

### 余白
- セクション間: `py-24 md:py-32`
- コンテナ内: `px-4 sm:px-6 lg:px-8`
- カード内: `p-8 md:p-12`

### フォントサイズ
- ヒーロータイトル: `text-5xl sm:text-7xl md:text-8xl lg:text-9xl`
- セクションタイトル: `text-4xl md:text-5xl`
- 本文: `text-base md:text-lg`
- 小見出し: `text-xl md:text-2xl`

### 色
- プライマリ: `primary-400`, `primary-500`
- 背景: `dark-950`, `dark-900`, `dark-800`
- テキスト: `white`, `gray-200`, `gray-300`, `gray-400`

### 影
- カード: `shadow-xl`
- ボタン: `hover:shadow-xl`

---

## ✅ チェックリスト

### 実装前
- [ ] このドキュメントに書かれていない UI は追加しない
- [ ] JSON First 構造に従う
- [ ] 型安全性を確保する

### 実装後
- [ ] `npm run lint` が通る
- [ ] `npm run build` が通る
- [ ] すべてのリンクが実在する遷移先を持つ
- [ ] 画像がすべて実在の温泉写真である
- [ ] `prefers-reduced-motion` に対応している

---

## 📝 変更履歴

- 2025-01-XX: 初版作成
