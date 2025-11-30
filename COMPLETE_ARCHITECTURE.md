# 完全なアーキテクチャ設計書

## 設計原則

1. **単一の情報源**: `themes/onsen-kanto/content.json`が唯一のコンテンツソース
2. **明確な依存関係**: すべてのファイルの依存関係を明確化
3. **使用されていないファイルの整理**: 不要なファイルは削除または整理

## ファイル構成と役割

### コアファイル（実際に使用されている）

```
themes/onsen-kanto/content.json
├─ 役割: サイト全体のコンテンツを定義（唯一の情報源）
├─ 読み込み: app/lib/content.ts から読み込まれる
└─ 内容:
    ├─ site: サイト基本情報（名前、ロゴ、メタデータ）
    ├─ navigation: ナビゲーションメニュー
    └─ pages: 各ページのコンテンツ

app/lib/content.ts
├─ 役割: コンテンツ読み込みロジック
├─ 読み込み: 各ページとlayout.tsxから呼び出される
└─ 機能:
    ├─ loadContent(): メインコンテンツを読み込む
    ├─ getDocPage(): 特定のドキュメントページを取得
    ├─ getAllDocSlugs(): すべてのドキュメントスラッグを取得
    ├─ getBlogPost(): 特定のブログ投稿を取得
    └─ getAllBlogSlugs(): すべてのブログスラッグを取得

app/layout.tsx
├─ 役割: ルートレイアウト（全ページ共通）
├─ 読み込み: Next.jsが自動的に読み込む
└─ 機能:
    ├─ loadContent()を呼び出してコンテンツを取得
    ├─ Headerコンポーネントにデータを渡す
    └─ メタデータを動的に生成

app/components/navigation/Header.tsx
├─ 役割: ヘッダーコンポーネント（ナビゲーション）
├─ 読み込み: app/layout.tsxから読み込まれる
└─ 機能:
    ├─ ロゴの表示（JSONから取得）
    ├─ ナビゲーションメニューの表示（JSONから取得）
    ├─ ハンバーガーメニュー（モバイル）
    └─ スクロール時のスタイル変更

app/components/icons/index.tsx
├─ 役割: アイコンコンポーネントとマッピング
├─ 読み込み: Header.tsxなどから読み込まれる
└─ 機能:
    ├─ 各種アイコンコンポーネントの定義
    └─ getIconComponent(): アイコン名からコンポーネントを取得
```

### ページファイル

```
app/page.tsx
├─ 役割: トップページ
└─ データソース: themes/onsen-kanto/content.json > pages.home

app/docs/page.tsx
├─ 役割: ドキュメント一覧ページ
└─ データソース: themes/onsen-kanto/content.json > pages.docs

app/docs/[slug]/page.tsx
├─ 役割: 個別のドキュメントページ
└─ データソース: themes/onsen-kanto/content.json > pages.docs[slug]

app/blog/page.tsx
├─ 役割: ブログ一覧ページ
└─ データソース: themes/onsen-kanto/content.json > pages.blog

app/blog/[slug]/page.tsx
├─ 役割: 個別のブログ投稿ページ
└─ データソース: themes/onsen-kanto/content.json > pages.blog.posts[slug]

app/features/page.tsx
├─ 役割: フィーチャーページ
└─ データソース: themes/onsen-kanto/content.json > pages.features

app/contact/page.tsx
├─ 役割: お問い合わせページ
└─ データソース: themes/onsen-kanto/content.json > pages.contact
```

### コンポーネントファイル

```
app/components/home/
├─ CinematicHero.tsx: ヒーローセクション
├─ SplitFeature.tsx: 分割フィーチャーセクション
├─ GridGallery.tsx: グリッドギャラリーセクション
├─ Testimonials.tsx: お客様の声セクション
└─ CtaFullscreen.tsx: 全画面CTAセクション

app/components/ui/
├─ Button.tsx: ボタンコンポーネント
├─ MarkdownRenderer.tsx: Markdownレンダラー
├─ TableOfContents.tsx: 目次コンポーネント
└─ その他のUIコンポーネント
```

## データフロー

```
1. ユーザーがページにアクセス
   ↓
2. Next.jsが該当するページコンポーネントを読み込む
   ↓
3. ページコンポーネントが loadContent() を呼び出し
   ↓
4. app/lib/content.ts が themes/onsen-kanto/content.json を読み込む
   ↓
5. データがページコンポーネントに返される
   ↓
6. ページコンポーネントがデータを各セクションコンポーネントに渡す
   ↓
7. セクションコンポーネントがデータを表示
```

## 環境変数

```
NEXT_PUBLIC_THEME=onsen-kanto  # テーマ選択（デフォルト: onsen-kanto）
NEXT_PUBLIC_BASE_PATH=/repo-name  # GitHub Pages用のベースパス
```

## 使用されていないファイル

- ❌ `config/site.config.ts` - 削除済み
- ⚠️ `app/config/theme.config.ts` - 使用されていないが、将来の拡張のために保持

## 修正済みの問題

1. ✅ ハンバーガーメニューのz-index修正
2. ✅ すべてのサブページのテキスト拡充
3. ✅ リポジトリ構成の整理（使用されていないファイルの削除）

## 残りの課題

1. ⚠️ 画像URLの修正: すべての画像を明確に温泉らしいものに変更
2. ⚠️ 実際の画像の確認: Unsplashの画像IDが実際に温泉の画像を指しているか確認
