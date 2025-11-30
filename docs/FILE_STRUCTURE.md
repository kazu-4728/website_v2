# ファイル構造ガイド

## 🎯 このリポジトリの構成

### 最重要ファイル（編集するファイル）

#### `/themes/onsen-kanto/content.json` ⭐⭐⭐
**役割**: サイト全体のコンテンツを定義（唯一の情報源）

**編集方法**:
- このファイルを編集するだけで、サイト全体のコンテンツが変更されます
- JSON形式で記述されています

**編集可能な項目**:
- `site`: サイト基本情報（名前、ロゴ、メタデータ）
- `navigation`: ナビゲーションメニュー
- `pages.home`: トップページのコンテンツ
- `pages.docs`: ドキュメントページのコンテンツ
- `pages.blog`: ブログページのコンテンツ
- `pages.features`: フィーチャーページのコンテンツ
- `pages.contact`: お問い合わせページのコンテンツ

---

### コアファイル（開発者が理解すべきファイル）

#### `/app/lib/content.ts` ⭐⭐
**役割**: コンテンツ読み込みロジック

**機能**:
- `loadContent()`: `content.json`を読み込む
- `getDocPage()`: 特定のドキュメントページを取得
- `getAllDocSlugs()`: すべてのドキュメントスラッグを取得
- `getBlogPost()`: 特定のブログ投稿を取得
- `getAllBlogSlugs()`: すべてのブログスラッグを取得

**読み込み元**: `themes/onsen-kanto/content.json`

#### `/app/layout.tsx` ⭐⭐
**役割**: ルートレイアウト（全ページ共通）

**機能**:
- `loadContent()`を呼び出してコンテンツを取得
- Headerコンポーネントにデータを渡す
- メタデータを動的に生成

#### `/app/components/navigation/Header.tsx` ⭐⭐
**役割**: ヘッダーコンポーネント（ナビゲーション）

**機能**:
- ロゴの表示（JSONから取得）
- ナビゲーションメニューの表示（JSONから取得）
- ハンバーガーメニュー（モバイル）
- スクロール時のスタイル変更

---

### ページファイル

#### `/app/page.tsx`
**役割**: トップページ
**データソース**: `content.json > pages.home`

#### `/app/docs/page.tsx`
**役割**: ドキュメント一覧ページ
**データソース**: `content.json > pages.docs`

#### `/app/docs/[slug]/page.tsx`
**役割**: 個別のドキュメントページ
**データソース**: `content.json > pages.docs[slug]`

#### `/app/blog/page.tsx`
**役割**: ブログ一覧ページ
**データソース**: `content.json > pages.blog`

#### `/app/blog/[slug]/page.tsx`
**役割**: 個別のブログ投稿ページ
**データソース**: `content.json > pages.blog.posts[slug]`

#### `/app/features/page.tsx`
**役割**: フィーチャーページ
**データソース**: `content.json > pages.features`

#### `/app/contact/page.tsx`
**役割**: お問い合わせページ
**データソース**: `content.json > pages.contact`

---

### コンポーネントファイル

#### `/app/components/home/`
- `CinematicHero.tsx`: ヒーローセクション
- `SplitFeature.tsx`: 分割フィーチャーセクション
- `GridGallery.tsx`: グリッドギャラリーセクション
- `Testimonials.tsx`: お客様の声セクション
- `CtaFullscreen.tsx`: 全画面CTAセクション

#### `/app/components/ui/`
- `Button.tsx`: ボタンコンポーネント
- `MarkdownRenderer.tsx`: Markdownレンダラー
- `TableOfContents.tsx`: 目次コンポーネント
- その他のUIコンポーネント

---

### ドキュメントファイル（整理済み）

#### `/docs/`
- `README.md`: ドキュメント一覧
- `QUICK_START.md`: クイックスタートガイド
- `INDEX.md`: ドキュメントインデックス
- `FILE_STRUCTURE.md`: このファイル

#### `/docs/architecture/`
- `MASTER_ARCHITECTURE.md` ⭐ - 完全なアーキテクチャ設計（最重要）
- `ARCHITECTURE_ANALYSIS.md`: アーキテクチャ分析
- `ARCHITECTURE_DESIGN.md`: アーキテクチャ設計
- `COMPLETE_ARCHITECTURE.md`: 完全なアーキテクチャ設計（詳細版）
- `REPOSITORY_STRUCTURE.md`: リポジトリ構造

#### `/docs/development/`
- `REFACTORING_PLAN.md`: リファクタリング計画
- `REFACTORING_SUMMARY.md`: リファクタリングサマリー
- `STEP1_COMPLETION.md`: ステップ1完了報告
- `STEP2_COMPLETION.md`: ステップ2完了報告
- `STRUCTURE_REVIEW.md`: 構成レビュー

#### `/docs/deployment/`
- `DEPLOYMENT_SUMMARY.md`: デプロイサマリー
- `PRE_DEPLOYMENT_CHECKLIST.md`: デプロイ前チェックリスト
- `FINAL_FIXES_REPORT.md`: 最終修正報告
- `FINAL_REVIEW_REPORT.md`: 最終レビュー報告
- `FINAL_COMPREHENSIVE_REPORT.md`: 最終包括的報告
- `FIXES_SUMMARY.md`: 修正サマリー
- `COMPREHENSIVE_REPORT.md`: 包括的報告
- `IMAGE_URLS.md`: 画像URLの説明

---

### 設定ファイル

#### `/next.config.mjs`
**役割**: Next.js設定
**内容**: 静的エクスポート、ベースパス設定

#### `/package.json`
**役割**: 依存関係とスクリプト定義

#### `/tsconfig.json`
**役割**: TypeScript設定

---

### 使用されていないファイル

- ❌ `config/site.config.ts` - 削除済み
- ⚠️ `app/config/theme.config.ts` - 使用されていないが、将来の拡張のために保持

---

## 🔍 ファイル検索ガイド

### コンテンツを編集したい
→ `/themes/onsen-kanto/content.json`

### コードの構造を理解したい
→ `/docs/architecture/MASTER_ARCHITECTURE.md`

### ヘッダーを変更したい
→ `/app/components/navigation/Header.tsx`

### コンテンツ読み込みロジックを変更したい
→ `/app/lib/content.ts`

### デプロイ前に確認したい
→ `/docs/deployment/PRE_DEPLOYMENT_CHECKLIST.md`

---

## 📖 各エージェント向けガイド

### AIエージェント向け
1. `/docs/architecture/MASTER_ARCHITECTURE.md` を最初に読む
2. `/themes/onsen-kanto/content.json` の構造を理解する
3. `/app/lib/content.ts` の読み込みロジックを確認する

### 人間の開発者向け
1. `/docs/QUICK_START.md` で概要を把握
2. `/docs/architecture/MASTER_ARCHITECTURE.md` で詳細を理解
3. 必要に応じて各ドキュメントを参照

### コンテンツ編集者向け
1. `/docs/QUICK_START.md` で編集方法を確認
2. `/themes/onsen-kanto/content.json` を編集
3. 変更は自動的に反映される
