# MASTER_BLUEPRINT_V1.md

作成日: 2025-12-11

## 目的
- 本プロジェクトを「関東温泉紹介サイト（多拠点紹介・特集・プラン・アクセス）」として、**実利用に耐える完成度**へ一気通貫で仕上げるための設計図。
- 世界観・品質は Reference Design（和モダン/没入型の旅館サイト）を参考にしつつ、**内容は温泉ガイドとして再構成**する。
- 実装は **JSON First + 型安全 + `lint/build` 常時パス**を前提とする。

---

## 0. 前提（リポジトリ現状）
- JSON First: `themes/onsen-kanto/{content,texts}.json` を `app/lib/content.ts` が読み込み、画像キーをURLへ解決して `content` を提供。
- ルーティング: 温泉詳細は `/<slug>`（`app/[slug]/page.tsx`）で配信、一覧は `/docs`。
- UI資産: `app/components/_legacy/` にコアUIが集中（FullscreenHero, Header, OnsenList, etc）。

---

## 1. ベンチマーク要約（Reference Design / 主要ページ観察）
※外部ページのHTML取得結果からの要約（2025-12-11時点）。

### 1.1 情報設計（メニュー構造・ページ種別）
- **ヘッダーが二段構え**
  - 上段: 施設の魅力/イベント/日帰り/周辺観光/交通案内など“目的別の入口”
  - 下段: 客室/温泉/料理/館内施設/過ごし方/宿泊プランなど“主要カテゴリ”
- **全画面MENU（サイトマップ型）**
  - 予約導線（プラン/カレンダー）を最上段に固定し、その下にカテゴリと下層リンクを並べる。
- **共通で表示される強い導線**
  - 日付検索（チェックイン/アウト＋人数＋部屋数）
  - プラン一覧/空室カレンダー/予約確認・変更・キャンセルなど“予約の運用”

### 1.2 画像の使い方
- **ヒーローはビジュアル主導**: 大型スライダー（full bleed）+ キャッチコピー（画像/タイポ）+ 前後ナビ。
- **セクションも画像で分割**
  - 大画像タイル（ポイント/魅力の一覧）
  - “過ごし方”はシーン別カード（画像＋短文）
  - “おすすめプラン”はカテゴリ/タブで切り替えつつ、画像とCTAで押す

### 1.3 モーション・アニメーション
- Slick/vegas等で
  - **フェード系スライド**（自動再生、ドット/矢印）
  - **スクロール連動の出現**（`animation` クラス）
  - hoverでの強調（カード/画像）

### 1.4 予約／問い合わせ導線
- 予約導線は「ページ内の一要素」ではなく、**情報設計の主役**
  - 日付検索フォームがページ上部に常設
  - 予約関連のボタン群（プラン一覧/空室カレンダー/予約確認など）を近接配置
- フッターにも **問い合わせ・電話** を強く配置

---

## 2. 本サイトへの読み替え方針（旅館→温泉ガイド）

### 2.1 本サイトで“予約導線”をどう扱うか
本サイトは自前の予約エンジンを持たない前提（外部予約/公式サイト等へ誘導）。
- **主導線**: 「温泉を探す」「宿を探す（外部）」「旅の計画を立てる（プラン）」
- **副導線**: 「日帰り施設を見る」「アクセスを見る」「問い合わせ」

### 2.2 参考サイトのIAを“ガイド”へ変換
- 客室/料理/館内施設 → **温泉地の魅力（見どころ）/泉質/食/周辺/宿**
- 宿泊プラン → **旅行プラン（行程）** + **外部予約リンク集**
- 交通案内 → **東京からのアクセス比較** + 各温泉の詳細アクセス

---

## 3. サイトマップ（全ページ一覧・URLパス）

### 3.1 実装スコープ（V1で必須）
- `/` ホーム
- `/docs` 温泉一覧（検索・絞り込み・ランキング的並び替え）
- `/<onsenSlug>` 温泉詳細（ガイド本体）
- `/features` 旅行プラン一覧（シーン別）
- `/blog` 特集一覧
- `/blog/[slug]` 特集詳細
- `/contact` お問い合わせ

### 3.2 将来拡張（V2以降）
- `/plans`（`/features` を移行して整理）
- `/areas/[areaSlug]`（エリアページ：箱根/草津…）
- `/themes/[themeSlug]`（テーマページ：日帰り/絶景/家族…）
- `/map`（地図で探す）

### 3.3 重要な分岐（URL設計）
- **案A（現状維持）**: 温泉詳細 = `/<slug>`
  - 速い。既存のsitemap/リンクと整合。
  - ただし将来ルート衝突の可能性あり。
- **案B（整理）**: 温泉詳細 = `/onsen/[slug]`
  - IAが明快、将来拡張に強い。
  - ただし既存リンク/sitemapの移行が必要。

---

## 4. 各ページのセクション構成（V1）

### 4.1 Home `/`
- **Hero（Fullscreen slider）**: 季節×エリアのスライド + 主要CTA（温泉を探す/プランを見る）
- **AreaSelection**: エリアから探す（大画像カード）
- **RecommendedOnsen**: 推し温泉（ギャラリー）
- **OnsenList（抜粋 or フル）**: 検索/絞り込みへの入口
- **How to choose（Steps）**: 初見ユーザー向けの選び方
- **CTA（Fullscreen）**: 週末導線（温泉一覧へ）

### 4.2 Onsen Index `/docs`
- **PageHero（短め）**: “関東温泉ガイド”の説明 + CTA（エリア/テーマ）
- **Search + Filters**: 名前/エリア/泉質/効能/日帰り/アクセス（東京から）
- **Result list**: カード一覧（画像＋タグ＋所要時間の要約）
- **Compare affordance（軽量）**: 「候補に追加」→ 3件まで比較（V1.5）

### 4.3 Onsen Detail `/<slug>`
- **Hero**: 1枚ではなく“短いギャラリー”（2〜5枚）＋キャッチ＋主要CTA
- **Overview**: 30秒で分かる要約（ハイライト/タグ）
- **Onsen Data**: 泉質・効能・温度/pH・特徴（カード）
- **Access**: 東京から（電車/車/バス）＋最寄り＋駐車場
- **Day trip & Stay**:
  - 日帰り: 施設名/営業時間/料金（あれば）
  - 宿: 代表＋“おすすめ5件” + 外部予約リンク
- **Nearby**: 観光/食/アクティビティ（カード）
- **Map**: ピン＋周辺
- **Seasonal**: 春夏秋冬（テキスト＋可能なら画像）
- **Next/Prev**: 回遊

### 4.4 Plans `/features`
- **Hero**: 目的別（カップル/家族/日帰り…）
- **Plan cards**: “所要日数/移動の目安/対象エリア/予算感”
- **各プラン詳細（V2）**: `/features/[slug]` を追加して行程・持ち物・予約リンク集を載せる

### 4.5 Articles `/blog`
- **Featured** + **Grid** は現状踏襲
- カテゴリ/タグで絞り込み（V1.5）

### 4.6 Contact `/contact`
- フォーム + 目的別（取材/掲載/相談）選択（V2）

---

## 5. コンポーネント構成（Next.js / React）

### 5.1 目標の分割レイヤ
- `app/components/core/`: Button, Badge, Tabs, Accordion, Section, Typography など（依存を持たない）
- `app/components/modules/`: SearchFilters, OnsenCardGrid, BookingLinks, OnsenDataGrid など（coreを組み合わせる）
- `app/components/templates/`: ページテンプレ（OnsenDetailTemplate, IndexTemplate）
- `app/components/_legacy/`: 既存資産（当面は温存しつつ段階的に移行）

### 5.2 V1で必要な新規（または整理）コンポーネント
- **予約/外部導線（ガイド用）**
  - `BookingLinks`（Rakuten/Jalan/一休/公式…をボタン群で）
  - `StickyCta`（スクロール時に “宿を探す/アクセス/地図” を固定表示）
- **温泉詳細の情報整理**
  - `OnsenHighlights`
  - `OnsenDataGrid`
  - `AccessSummary`
  - `RyokanList` / `RyokanCard`
  - `NearbySpotList` / `NearbySpotCard`
  - `ImageGallery`（LightboxはV1.5）
- **一覧/検索UX**
  - `OnsenSearchBar`（既存 `OnsenList` が担っている可能性あり → 機能を抽出して整理）
  - `OnsenFilterPanel`
  - `OnsenResultMeta`（件数/並び替え）

---

## 6. JSON First: 必要なスキーマ案（content/texts）

### 6.1 `content.json`（主要追加/整理）
- `pages.docs[]`（温泉詳細データ）を“ガイド仕様”に寄せる
  - `onsen.images.gallery: string[]`（2〜5枚）
  - `onsen.accommodation.ryokans: RyokanDetails[]`（5件程度、外部リンク含む）
  - `onsen.nearbySpots: NearbySpot[]`（カテゴリ付き）
  - `onsen.bookingLinks`（温泉地全体の外部導線）※`RyokanDetails.links` とは別に
- `pages.features.items[]` に `slug` と `details`（行程/予算/対象温泉）を追加（V2で詳細ページ化）
- `taxonomies`（推奨）
  - `areas`, `springTypes`, `effects`, `tags` を正規化し、フィルタUIの母集団を安定させる

### 6.2 `texts.json`（追加案）
- `booking`: 外部予約導線ラベル（例: 予約する/空室を見る/公式サイト…）
- `onsen`: 温泉詳細の見出し（温泉データ/アクセス/宿/周辺/地図/季節…）
- `filters`: 一覧の絞り込みラベル（エリア/泉質/効能/日帰り/アクセス…）
- `plans`: プランの見出し（所要/予算/行程/おすすめ…）
- `a11y`: UI部品のaria-label（メニュー/スライダー/次へ前へ）

### 6.3 スコープ問題（関東の定義）
- `content.json` に静岡（伊豆）が含まれているため、どちらかを決める必要がある。
  - **案A**: 関東1都6県に限定してデータ整理
  - **案B**: “関東近郊”へ言い換え、静岡も含める

---

## 7. 実装に入る前に確定すべきこと（OK確認ポイント）
1. **URL設計**: 温泉詳細を `/<slug>` のまま行くか、`/onsen/[slug]` に寄せるか
2. **スコープ**: 「関東のみ」か「関東＋近郊」か
3. **予約導線の定義**: “宿の予約”をどの粒度で扱うか（温泉地→宿候補→外部リンク）
4. **宿データスキーマ**: `representativeRyokan` を残しつつ `ryokans[]` に統一するか

---

## 付録: 参考として観察できたReference Designの主要パス例
- `/guestroom/`（客室）
- `/spa/`（温泉）
- `/dishes/`（料理）
- `/pavilion/`（館内施設）
- `/family/`（過ごし方）
- `/packages/`（宿泊プラン）
- `/access/`（交通案内）
- `/sightseeing/`（周辺観光）
- `/contact/`（問い合わせ）
