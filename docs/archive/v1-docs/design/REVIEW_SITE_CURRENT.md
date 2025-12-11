# 現状分析レポート

作成日: 2025年1月

## 1. 概要

本レポートは、関東温泉紹介サイトの現状を分析し、「何が使えるか／何を捨てるか／どこが中途半端か」を整理したものです。

## 2. ページ構成の現状

### 2.1 実装済みページ

| パス | ページ名 | 状態 | 備考 |
|------|---------|------|------|
| `/` | ホーム（LP） | ✅ 完成度高 | Heroスライダー、GridGallery、Testimonials、Steps、CTA実装済み |
| `/docs` | 温泉ガイド一覧 | ✅ 実装済み | カード形式の一覧表示 |
| `/docs/[slug]` | 温泉詳細ページ | ✅ 実装済み | マークダウンコンテンツ、温泉データ、地図、前後ナビ |
| `/blog` | 特集記事一覧 | ✅ 実装済み | フィーチャー記事＋グリッド表示 |
| `/blog/[slug]` | 記事詳細 | ✅ 実装済み | マークダウンコンテンツ |
| `/features` | おすすめプラン | ⚠️ 中途半端 | ヒーロー＋カード3枚のみ。プラン詳細がない |
| `/contact` | お問い合わせ | ✅ 実装済み | フォーム実装済み |

### 2.2 ページ構成の問題点

1. **`/features` ページが中途半端**
   - プラン一覧はあるが、個別プランページ（`/features/[slug]`）がない
   - プラン詳細（料金、日程、含まれるもの）の表示がない
   - 予約導線がない

2. **温泉ガイドの情報量**
   - 基本的な情報（泉質、効能、アクセス）は揃っている
   - しかし「本当に使えるガイド」として必要な情報が不足：
     - 各温泉地の宿泊施設一覧（複数）
     - 料金帯の比較
     - 予約サイトへのリンク
     - 周辺観光スポットの詳細

3. **特集記事の充実度**
   - 現在3記事のみ（マナー、効能、季節）
   - 実際のユーザーが求める情報（「箱根で泊まるならここ」「日帰り温泉ランキング」など）がない

## 3. コンポーネント構成の現状

### 3.1 使えるコンポーネント

| コンポーネント | 場所 | 状態 | 用途 |
|--------------|------|------|------|
| `CinematicHero` | `app/components/home/` | ✅ 完成度高 | マルチスライド対応、スワイプ対応 |
| `GridGallery` | `app/components/home/` | ✅ 実装済み | エリア・テーマ選択に使用 |
| `Testimonials` | `app/components/home/` | ✅ 実装済み | 旅行者の声 |
| `Steps` | `app/components/home/` | ✅ 実装済み | 選び方ガイド |
| `CtaFullscreen` | `app/components/home/` | ✅ 実装済み | CTAセクション |
| `Header` | `app/components/navigation/` | ✅ 実装済み | ハンバーガーメニュー対応 |
| `Footer` | `app/components/layouts/` | ✅ 実装済み | 基本構造 |
| `MarkdownRenderer` | `app/components/ui/` | ✅ 実装済み | マークダウン表示 |
| `GoogleMap` | `app/components/ui/` | ✅ 実装済み | 地図表示 |
| `ImageCredit` | `app/components/ui/` | ✅ 実装済み | 画像クレジット表示 |

### 3.2 不足しているコンポーネント

1. **予約・問い合わせ導線**
   - 予約ボタンコンポーネント（外部リンク）
   - 問い合わせフォームの改善（現在は基本フォームのみ）

2. **プラン詳細表示**
   - プランカード（料金、日程、含まれるもの）
   - プラン比較テーブル

3. **温泉地の詳細情報表示**
   - 宿泊施設一覧カード
   - 料金比較コンポーネント
   - 周辺観光スポット一覧

4. **検索・絞り込み機能**
   - エリア検索
   - 泉質フィルタ
   - 日帰り/宿泊フィルタ

## 4. JSON構造の現状

### 4.1 `themes/onsen-kanto/content.json`

**使える構造:**
- `site`: サイト基本情報 ✅
- `navigation`: ナビゲーション構造 ✅
- `pages.home`: ホームページセクション ✅
- `pages.docs`: 温泉ガイドデータ ✅（18件の温泉地データ）
- `pages.blog`: ブログ記事 ✅（3記事）
- `pages.features`: プランデータ ⚠️（基本構造のみ、詳細不足）
- `pages.contact`: お問い合わせ情報 ✅

**不足している構造:**
- `pages.features.items[].details`: プラン詳細（料金、日程、含まれるもの）
- `pages.docs[].onsen.accommodation.ryokan[]`: 複数の旅館情報（現在は1件のみ）
- `pages.docs[].onsen.nearbySpots[]`: 周辺観光スポット
- `pages.docs[].onsen.bookingLinks[]`: 予約サイトへのリンク

### 4.2 `themes/onsen-kanto/texts.json`

**使える構造:**
- `nav`: ナビゲーションラベル ✅
- `footer`: フッターラベル ✅
- `pages`: ページタイトル・説明 ✅
- `buttons`: ボタンラベル ✅
- `form`: フォームラベル ✅
- `messages`: エラーメッセージ ✅
- `ui`: UIラベル ✅

**不足しているラベル:**
- `booking`: 予約関連ラベル（「予約する」「空室を確認」「料金を見る」など）
- `plans`: プラン関連ラベル（「料金」「日程」「含まれるもの」など）
- `accommodation`: 宿泊施設関連ラベル（「旅館一覧」「料金帯」「設備」など）
- `filters`: 検索・絞り込みラベル（「エリアで絞る」「泉質で絞る」など）

## 5. 画像まわりの現状

### 5.1 画像管理システム

**使える仕組み:**
- `app/lib/images.ts`: 画像キー→URL解決 ✅
- `data/wikimedia-images.json`: 画像データキャッシュ ✅
- `ImageCredit` コンポーネント: クレジット表示 ✅
- Wikimedia Commonsからの画像取得 ✅

**問題点:**
- 一部の温泉地で画像が重複（同じ画像を使い回している）
- 画像の品質が不統一（解像度、アスペクト比）
- プラン・ブログ記事の画像が不足

### 5.2 画像の使い方

**現状:**
- Hero: 4種類のスライド画像（星空、雪、紅葉、新緑）✅
- 温泉地: 各温泉地に1枚のメイン画像 ✅
- ブログ: 各記事に1枚の画像 ✅

**不足:**
- 温泉地のギャラリー（複数画像）
- プランの画像
- 宿泊施設の画像

## 6. デザイン・UIの現状

### 6.1 デザインシステム

**使える要素:**
- Tailwind CSS ✅
- ダークテーマ（`dark-950`, `dark-900`など）✅
- プライマリカラー（`primary-500`など）✅
- Glass morphism効果（`card-glass`）✅
- Framer Motionアニメーション ✅

**問題点:**
- デザイントークンが散在（`app/lib/design-tokens.ts`とTailwind設定の二重管理）
- レスポンシブデザインは基本対応済みだが、細かい調整が必要

### 6.2 UI/UXの問題点

1. **予約導線がない**
   - 温泉詳細ページに「予約する」ボタンがない
   - プランページに予約導線がない

2. **検索・絞り込み機能がない**
   - エリア検索
   - 泉質フィルタ
   - 日帰り/宿泊フィルタ

3. **情報の階層が浅い**
   - 温泉地の詳細情報が1ページに集約されているが、情報量が多い
   - タブやアコーディオンで情報を整理する必要がある

## 7. 技術スタックの現状

### 7.1 使える技術

- Next.js 15 (App Router) ✅
- TypeScript ✅
- Tailwind CSS ✅
- Framer Motion ✅
- JSON First アーキテクチャ ✅
- 静的エクスポート（GitHub Pages対応）✅

### 7.2 技術的な問題点

1. **型安全性**
   - `onsen-types.ts`と`theme-types.ts`が分離されているが、統合が必要な箇所がある
   - `content.json`の型定義が完全ではない（`features.items[].details`など）

2. **パフォーマンス**
   - 画像最適化が未実装（`unoptimized: true`）
   - コード分割の最適化が必要

## 8. まとめ：何を捨てるか／何を使うか

### 8.1 使うべきもの（完成度が高い）

1. **ページ構成の基本構造**
   - `/`, `/docs`, `/docs/[slug]`, `/blog`, `/blog/[slug]`, `/contact` はそのまま使う

2. **コンポーネント**
   - `CinematicHero`, `GridGallery`, `Testimonials`, `Steps`, `CtaFullscreen` はそのまま使う
   - `Header`, `Footer`, `MarkdownRenderer`, `GoogleMap`, `ImageCredit` はそのまま使う

3. **JSON構造**
   - `content.json`の基本構造はそのまま使う
   - `texts.json`の基本構造はそのまま使う

4. **画像管理システム**
   - `app/lib/images.ts`の仕組みはそのまま使う
   - `ImageCredit`コンポーネントはそのまま使う

### 8.2 改善が必要なもの（中途半端）

1. **`/features` ページ**
   - プラン詳細ページ（`/features/[slug]`）を追加
   - プラン詳細情報（料金、日程、含まれるもの）を追加
   - 予約導線を追加

2. **温泉ガイドの情報量**
   - 宿泊施設一覧を複数追加
   - 予約サイトへのリンクを追加
   - 周辺観光スポットの詳細を追加

3. **検索・絞り込み機能**
   - エリア検索
   - 泉質フィルタ
   - 日帰り/宿泊フィルタ

4. **JSON構造の拡張**
   - `pages.features.items[].details` を追加
   - `pages.docs[].onsen.accommodation.ryokan[]` を複数追加
   - `pages.docs[].onsen.nearbySpots[]` を追加
   - `pages.docs[].onsen.bookingLinks[]` を追加

5. **`texts.json`の拡張**
   - `booking`, `plans`, `accommodation`, `filters` セクションを追加

### 8.3 捨てるべきもの（不要・未使用）

1. **未使用コンポーネント**
   - `app/components/labs/` 配下のコンポーネント（実験的なもの）
   - `app/components/GenericPage.tsx`（使用されていない）

2. **重複コード**
   - `app/lib/design-tokens.ts`とTailwind設定の二重管理を統合

3. **不要なドキュメント**
   - `docs/reports/` 配下の古いレポート（アーカイブ化）

## 9. 次のステップ

1. **ベンチマークサイト調査**
   - 和倉温泉 あえの風 公式サイトを調査
   - 情報設計、画像の使い方、モーション、予約導線を分析

2. **設計書作成**
   - `docs/UI_DESIGN_V3.md` を作成
   - サイトマップ、セクション構成、コンポーネント構成、JSONスキーマ案をまとめる

3. **実装計画作成**
   - `docs/IMPLEMENTATION_PLAN_V3.md` を作成
   - フェーズごとの実装ステップを定義
