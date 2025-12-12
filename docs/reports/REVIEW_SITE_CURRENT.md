# REVIEW_SITE_CURRENT.md

作成日: 2025-12-11

## 目的
このレポートは、本リポジトリを「関東温泉紹介サイト」として“実際にユーザーが使える完成度”まで仕上げるために、現状の構造を短時間で俯瞰し、**何を使うか／何を捨てるか／何が中途半端か**を整理する。

---

## 1. 現状のサマリー（結論）
- **強い土台は既にある**: JSON First（`themes/onsen-kanto/{content,texts}.json`）と型定義（`app/lib/theme-types.ts` + `app/lib/onsen-types.ts`）は概ね整っており、ホーム/温泉詳細/記事/プラン/問い合わせのページも揃っている。
- **完成度が「温泉ガイド」としては未達**: 予約導線、温泉地の“比較可能な情報”、宿・周辺/アクセスの深さ、検索UX、そして「関東」スコープ整合が不足し、ユーザーが計画に使うには情報が足りない。
- **アーキ・ドキュメントの置き場が分裂**: 実質的な設計書・ガイドは `docs/archive/v1-docs/` に集約されており、現行 `docs/` は薄い。新しい設計・計画は「他エージェントが迷わない」場所に再構成が必要。

---

## 2. ルーティング / ページ構成の現状

### 実装されている主要ルート
- **`/`**: Home（フルスクリーンHero + セクション合成）
- **`/docs`**: 温泉ガイド一覧（カード一覧）
- **`/[slug]`**: 温泉ガイド詳細（`content.pages.docs[]` の `slug` を直下ルートで配信）
- **`/blog`**, **`/blog/[slug]`**: 特集記事一覧・詳細
- **`/features`**: おすすめプラン（現状は“プラン概念の入口”）
- **`/contact`**: お問い合わせ
- **`/sitemap.xml`**: `app/sitemap.ts` が生成（静的 + 温泉詳細 + ブログ）

### ルーティングの“ねじれ”（中途半端ポイント）
- **温泉詳細が `/docs/[slug]` ではなく `/<slug>`** になっている。
  - `docs` 一覧は `/docs` に存在するため、UX的には成立しているが、URL設計としては直感性が弱い（SEO/拡張時に衝突リスク）。
  - `Footer` は `/docs` を指す一方、詳細は `/<slug>`。

---

## 3. コンポーネント構成の現状

### 使える（残すべき）
- **世界観の核**
  - `app/components/_legacy/home/FullscreenHero.tsx`（フルスクリーン・スライド）
  - `app/components/_legacy/home/AreaSelection.tsx` / `RecommendedOnsen.tsx` / `OnsenList.tsx`
- **基本UI資産**
  - `app/components/_legacy/navigation/Header.tsx`（透過→スクロール変化、モバイルメニュー）
  - `app/components/_legacy/layouts/Footer.tsx`
  - `MarkdownRenderer`, `TableOfContents`, `GoogleMap`, `ImageCredit`

### 捨てる/隔離して扱うべき
- `app/components/_legacy/labs/`（実験要素）
- `app/components/_legacy/GenericPage.tsx`（用途が曖昧で、今のページ構成では中核に不要）

### “構造として中途半端”
- 本来の方針（`core/modules/templates`）が `RULES.md` / `REQUIREMENTS.md` にある一方、実装は `_legacy` に寄っている。
  - すぐ全移動はコストが高いので、**新設計に合わせて新コンポーネントは `core/modules/templates` に置き、既存 `_legacy` は段階的に置換**が現実的。

---

## 4. JSON First（content/texts）と型安全

### 現状の強み（使える）
- `themes/onsen-kanto/content.json` がホームのセクション構成/温泉データ/ブログ/プラン/問い合わせを持つ。
- `themes/onsen-kanto/texts.json` がナビ/ボタン/フォーム等のUIテキストを集中管理。
- `app/lib/content.ts` が `content.json` を読み込み、画像キーをURLへ解決して `content` を提供。

### 中途半端/不足
- **温泉詳細ページ内にハードコード文字列が残っている**（例: 温泉データの見出しが固定日本語）。JSON Firstに反する箇所がある。
- **Onsen宿データが二重スキーマ**
  - `onsen-types.ts` は `ryokans?: RyokanDetails[]` を持つが、実データは `representativeRyokan`（旧）中心。
  - 今後の“宿5件/予約リンク/画像/特徴”を載せるには、`ryokans[]` 側に統一した方が良い。
- **「関東」スコープの揺れ**
  - `content.json` に静岡（熱海/伊東/修善寺/下田など）が含まれており、サイト名・目的と齟齬。

---

## 5. 画像システムの現状

### 使える仕組み
- `app/lib/images.ts` のテーマ別画像マッピング + `ImageCredit` によるクレジット表示。
- `data/wikimedia-images.json` キャッシュ（ただし登録数は少ない）。

### 中途半端/リスク
- `images.ts` の「温泉ごとの画像」が、実際には**同一画像の流用**や、温泉そのものではない可能性が残る（品質の一貫性が弱い）。
- `REQUIREMENTS.md` と `docs/archive/v1-docs/agent/AGENT_GUIDE.md` で、
  - 画像は「自動反映してOK」
  - 画像は「承認後に反映」
 というルールが**矛盾**している。
  - 運用としては後者（承認制）を採用しないと、品質と権利表記の担保が難しい。

---

## 6. docs / md 構成の現状
- 有用な設計/運用ドキュメントが **`docs/archive/v1-docs/` に集中**（V5設計、実装計画、ベンチマーク分析、エージェントガイド等）。
- 現行 `docs/` は `REQUIREMENTS.md` / `RULES.md` が中心で、**「今どれを正とするか」迷いやすい**。

---

## 7. 何が使えるか／何を捨てるか／どこが中途半端か（短く）

### 使える
- **世界観の骨格**: フルスクリーンHero、ダーク基調、カード/ガラス表現、モバイルメニュー。
- **JSON First基盤**: `content.json` と `texts.json` + `loadContent()`。
- **温泉データの基礎**: `OnsenSpot` モデル（region/onsen/access/accommodation/content/images/metadata）。

### 捨てる（または隔離）
- labs系・用途不明コンポーネント。
- “プランページのデモっぽいUI”（現状の `/features` の後半など）は、温泉ガイド用途に合わせて再設計が必要。

### 中途半端
- URL設計（`/docs` と `/<slug>` の混在）。
- 宿/予約/周辺/アクセスの情報量が「ガイドとして不足」。
- JSON Firstの徹底不足（ページ内の固定文言）。
- 画像運用ルールのドキュメント矛盾。
- ドキュメントの正本が `archive` に偏在。

---

## 8. 重要な分岐（方針変更が必要な可能性）

### A/B案: 「関東」スコープ
- **案A（厳密に関東）**: 静岡（伊豆）を除外し、関東1都6県に限定。サイト名と整合。
- **案B（関東＋近郊）**: 現状データを活かし、サイトの表現を「関東近郊」へ変更（例: 伊豆含む）。

### A/B案: 温泉詳細URL
- **案A（現状維持）**: `/<slug>` を維持（導線は既に成立）。
- **案B（情報設計優先）**: 温泉詳細を `/onsen/[slug]` へ寄せ、将来のルート衝突を回避。

---

## 9. 次アクション（このレポートの外）
- ベンチマーク（あえの風）から、**IA/導線/モーション/画像運用**を抽出。
- 本サイト用に「温泉ガイドとしてのページ体系（多拠点紹介・特集・プラン・アクセス）」へ再構成し、JSONスキーマとコンポーネント分割を設計書に落とす。
