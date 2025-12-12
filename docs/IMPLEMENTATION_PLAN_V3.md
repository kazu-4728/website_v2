# IMPLEMENTATION_PLAN_V3.md

作成日: 2025-12-11

前提ドキュメント:
- `docs/REQUIREMENTS.md`
- `docs/RULES.md`
- `docs/reports/REVIEW_SITE_CURRENT.md`
- `docs/design/MASTER_BLUEPRINT_V1.md`
- （参考）`docs/archive/v1-docs/design/DESIGN_V5_MASTER.md`

## 目的
- 「関東温泉紹介サイト」を、ユーザーが旅行計画に使える完成度へ。
- UI/世界観は V5 方針（没入感・大画像・滑らかなモーション・強い導線）を前提。
- JSON First と型安全（`npm run lint` + `npm run build`）を常時維持。

---

## フェーズ0: 仕様確定（実装前ゲート）

- **目的**: 実装中の手戻り（ループ）を防ぐため、設計上の分岐を先に確定する。
- **変更範囲（ファイル）**: ドキュメントのみ
  - `docs/design/MASTER_BLUEPRINT_V1.md`
  - `docs/reports/REVIEW_SITE_CURRENT.md`
- **完了条件**:
  - URL設計（温泉詳細 `/<slug>` 維持 or `/onsen/[slug]`）が確定
  - “関東”スコープ（関東のみ or 近郊含む）が確定
  - 予約導線（外部リンクの種類・優先順位）が確定

---

## フェーズ1: JSONスキーマ確定と型整備（最優先）

- **目的**: 「ガイドとして必要な情報」を `content.json` に載せ、型で担保する。
- **変更範囲（ファイル）**:
  - `themes/onsen-kanto/content.json`
  - `themes/onsen-kanto/texts.json`
  - `app/lib/theme-types.ts`
  - `app/lib/onsen-types.ts`
  - `app/lib/content.ts`（画像解決/型整合の最小修正）
- **作業内容（TODO）**:
  - 温泉詳細に必要なキー追加
    - `onsen.images.gallery`（2〜5枚）
    - `onsen.accommodation.ryokans[]`（5件程度、外部予約リンク含む）
    - `onsen.nearbySpots[]`（カテゴリ付き）
    - `onsen.bookingLinks[]`（温泉地全体の外部導線）
  - `texts.json` に見出し・導線ラベルを追加
    - `booking`, `onsen`, `filters`, `plans`, `a11y`
  - 型定義を追加し `any` 依存を減らす
- **完了条件**:
  - `content.json` と型定義が整合し、`npm run build` が通る
  - 温泉詳細に「宿/周辺/予約導線」がJSONで表現できる

---

## フェーズ2: コンポーネントのレイヤ分割（core/modules/templates）

- **目的**: V5のUIを“繰り返し作れる形”にし、ページ実装を加速する。
- **変更範囲（ファイル）**:
  - `app/components/core/**`
  - `app/components/modules/**`
  - `app/components/templates/**`
  - （移行元）`app/components/_legacy/**`
- **作業内容（TODO）**:
  - `core`: Section, Heading, Tabs/Accordion, Card primitives, CTA button variants
  - `modules`: BookingLinks, OnsenDataGrid, AccessSummary, RyokanCard/List, NearbySpotCard/List, ImageGallery
  - `templates`: OnsenDetailTemplate, OnsenIndexTemplate（V1で最低限）
  - 既存 `_legacy` は「使うものはラップして置換」し、段階的に移行
- **完了条件**:
  - 温泉詳細で必要なUIが modules/templates に揃う
  - ページ側は JSON を渡すだけで組み立てられる

---

## フェーズ3: 温泉詳細ページを“ガイドとして完成”させる

- **目的**: 温泉詳細 `/<slug>` を、比較・計画に使える情報密度と導線にする。
- **変更範囲（ファイル）**:
  - `app/[slug]/page.tsx`
  - `app/components/templates/OnsenDetailTemplate.tsx`（新規/移行）
  - `themes/onsen-kanto/content.json`
  - `themes/onsen-kanto/texts.json`
- **作業内容（TODO）**:
  - Heroをギャラリー化（2〜5枚）
  - Overview（30秒要約）+ ハイライト/タグ
  - 温泉データ/アクセス/宿/周辺/地図/季節 を“見出し＋カード”で整理
  - 外部予約導線（StickyCta or セクションCTA）を明確化
  - 既存のハードコード見出しを `texts.json` 化
- **完了条件**:
  - 1ページで「行く判断→宿を選ぶ→アクセスが分かる」まで完結
  - JSON First違反（固定文言）が主要領域から排除される

---

## フェーズ4: 温泉一覧（検索/絞り込み）を実用レベルへ

- **目的**: “探せる”体験を完成させ、回遊の起点にする。
- **変更範囲（ファイル）**:
  - `app/docs/page.tsx`
  - `app/components/_legacy/home/OnsenList.tsx`（機能抽出/移行）
  - `app/components/modules/OnsenFilters/**`（新規）
  - `themes/onsen-kanto/texts.json`
- **作業内容（TODO）**:
  - フィルタの母集団を安定化（taxonomies導入 or 一覧から導出）
  - 並び替え（人気/優先度/東京からの所要）
  - 結果の要約表示（件数、条件、クリア）
- **完了条件**:
  - ユーザーが「条件指定→候補を絞る」を迷わず完了できる

---

## フェーズ5: プラン（/features）を“旅行計画”として成立させる

- **目的**: シーン別の旅行プランを、実際に使える粒度へ。
- **変更範囲（ファイル）**:
  - `app/features/page.tsx`
  - （追加）`app/features/[slug]/page.tsx`
  - `themes/onsen-kanto/content.json`
  - `themes/onsen-kanto/texts.json`
- **作業内容（TODO）**:
  - `features.items[]` に `slug` と `details`（行程/目安予算/対象温泉/予約リンク集）を追加
  - 詳細ページで行程を表示し、温泉詳細へ導線を張る
- **完了条件**:
  - “週末プラン”として具体的な行動がイメージできる

---

## フェーズ6: 特集（/blog）を“集客と理解”の資産へ

- **目的**: 体験価値の言語化・SEO・回遊を強化。
- **変更範囲（ファイル）**:
  - `app/blog/page.tsx`
  - `app/blog/[slug]/page.tsx`
  - `themes/onsen-kanto/content.json`
- **作業内容（TODO）**:
  - 関連記事/関連温泉への導線
  - カテゴリ/タグの整理
- **完了条件**:
  - 特集→温泉詳細→プラン の回遊が成立

---

## フェーズ7: 仕上げ（品質/SEO/アクセシビリティ/画像）

- **目的**: “完成品”としての信頼性を担保する。
- **変更範囲（ファイル）**:
  - `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`
  - `tests/**`
  - `app/components/**`（aria/キーボード）
  - `data/wikimedia-images.json`（画像承認フローに従って更新）
- **作業内容（TODO）**:
  - メタ情報（OG/description）の整理
  - パンくず/構造化データ（JSON-LD）（静的エクスポート制約内）
  - a11y（メニュー・スライダー・ボタンのaria）
  - 画像品質レビュー運用（承認→反映）
- **完了条件**:
  - `npm run lint` と `npm run build` が安定
  - 主要ページで致命的なUX欠陥がない

---

## 備考（他エージェント向け）
- 現状の設計・実装資料は `docs/archive/v1-docs/` に散在しているため、作業時は必ず `docs/REQUIREMENTS.md` / `docs/RULES.md` / 本ドキュメントを正として参照する。
- 画像運用は、品質担保のため「ユーザー承認後に反映」を基本とする（矛盾ドキュメントが存在する点は要注意）。
