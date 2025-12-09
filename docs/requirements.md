# website_v2 要件定義（Onsen Kanto テーマ＋テンプレエンジン）

## 📋 現在の方針（2025年12月10日）

### ベンチマークサイトを目指す大改造

- **既存サイトを忘れる**: 大改造のため、既存の実装は参考程度に
- **ベンチマークサイトを目指す**: 「あえの風」レベルの世界観・クオリティ
- **画像メイン**: 高品質な実写画像を大胆に使用
- **JSON First**: すべてのコンテンツとUIテキストをJSONで管理（維持）
- **テンプレート化**: テーマ切替可能な設計を維持

詳細は [design/DESIGN_V5_MASTER.md](./design/DESIGN_V5_MASTER.md) を参照してください。

---

## 1. プロジェクト概要

### 1.1 目的

1. **温泉LPとして “ちゃんと見られるサイト” を完成させること（MVP）。**  
2. **コンテンツを JSON で差し替えるだけで、別テーマのサイトを量産できるエンジンにすること。**  
3. **将来、画像収集・差し替え・ファクトチェックなどを「サブエージェント」で自動化できる土台を作ること。**

### 1.2 技術スタック（現状）

- **Next.js App Router**（TypeScript）
- **Tailwind CSS**
- **JSON First アーキテクチャ**
  - `themes/<theme>/content.json`
  - `themes/<theme>/texts.json`
- デプロイ: GitHub Pages（静的エクスポート）

---

## 2. スコープとフェーズ

### フェーズ1：温泉LPの完成 (現在〜)

- Onsen Kanto テーマを「1つの完成サイト」として仕上げる  
- ページ構成・UI・導線・画像・フォームなど、普通に公開できるレベルまで引き上げる

### フェーズ2：テーマ量産エンジン化

- `themes/_template` を軸に、  
  - JSON スキーマ統一
  - ACTIVE_THEME で簡単切替
- 温泉以外テーマ（例：旅館、アウトドア、学習塾 etc.）も作れるようにする

### フェーズ3：画像サブエージェント & オーケストラ構想（将来）

- 画像収集・ライセンスチェック・差し替えを自動化するサブエージェント群
- Gemini 3.0 / 他エージェントを組み合わせた「画像担当」「ファクトチェック担当」「スクレイピング担当」など

---

## 3. システム全体像

### 3.1 論理構造

- `app/` : ルーティング & ページコンポーネント
- `app/components/` : UIコンポーネント
- `app/lib/theme-types.ts` : 共通スキーマ
- `app/lib/onsen-types.ts` : 温泉特化モデル
- `app/lib/content.ts` : JSON ローディング & 解決
- `app/lib/images.ts` : 画像キー → URL 解決
- `themes/<theme>/` : 各テーマの JSON
- `docs/*.md` : スキーマ & ルール説明

### 3.2 JSON First のルール

1. **ユーザーに見えるテキストはすべて JSON 管理**
   - 固有文言 → `texts.json`
   - 構造やコンテンツ → `content.json`
2. **React コンポーネントは「型に従って描画するだけ」**
   - ロジックは `content.ts` / `theme-types.ts` に寄せる

---

## 4. ルーティング & ページ機能要件

### 4.1 ルート一覧（MVP）

- `/` : ホーム（LP）
- `/docs` : 温泉ガイド一覧
- `/docs/[slug]` : 温泉詳細ページ
- `/blog` : 特集記事一覧
- `/blog/[slug]` : 記事詳細
- `/features` : おすすめプラン
- `/contact` : お問い合わせ
- `/sitemap.xml` : サイトマップ
- `/robots.txt` : Robots
- `/not-found` (app/not-found.tsx) : カスタム404

### 4.2 共通UI要件

- **ヘッダー**
  - ロゴ
  - グローバルナビ（ホーム / 温泉ガイド / 特集記事 / プラン / お問い合わせ）
  - モバイル: ハンバーガーメニュー
- **フッター**
  - サイト名・タグライン
  - ナビリンク
  - コピーライト
- **パンくず（将来）**
  - `/docs/[slug]` / `/blog/[slug]` で設置

---

## 5. ホームLPの要件

### 5.1 セクション構成（6セクション）

1. **S1: Hero（シネマティック温泉スライダー）**
   - フルスクリーン背景（実写温泉）
   - マルチスライド（星空 / 雪見 / 紅葉 / 新緑）
   - テキストは固定（タイトル・説明・バッジ）
   - 自動スライド（2〜3秒）＋ユーザー操作
     - PC: ドットクリック
     - モバイル: スワイプ
   - `content.json` → `pages.home.hero`
2. **S2: エリアから探す（GridGallery）**
   - 関東の主要温泉地（箱根 / 草津 / 鬼怒川 / 伊香保 / 那須 / 水上）
   - `/docs/[slug]` への導線
3. **S3: テーマから選ぶ（GridGallery）**
   - 日帰り / カップル / 家族 / 絶景
   - 将来フィルタ連動予定（今は `/docs` への導線）
4. **S4: 旅行者の声（Testimonials）**
   - 実際の滞在レビュー
   - 2–4件を目標
5. **S5: 温泉の選び方（Steps）**
   - 3ステップ（エリア → 絞り込み → 比較）
6. **S6: フルスクリーンCTA**
   - 「今週末、どの温泉に浸かりますか？」などの問いかけ
   - /docs への強い導線

### 5.2 Hero 画像要件

- **すべて「明確に温泉と分かる実写」**
- 4バリエーション：
  - 星空＋露天風呂
  - 雪見露天
  - 紅葉の露天
  - 新緑の露天
- **できれば関東の温泉（箱根 / 草津 / 塩原 / 那須など）**
- ライセンス：
  - CC BY / CC BY-SA を原則（Wikimedia Commons など）
  - URL・作者名・ライセンス表記を `images.ts` にメモ

---

## 6. コンテンツ & データモデル要件

### 6.1 content.json / texts.json スキーマ

- 仕様は `docs/theme-schema.md` に準拠
- 主な構造：
  - `site` : サイト設定（タイトル、説明、OG画像候補）
  - `navigation` : メニュー構造
  - `pages.home` : 上記6セクション（Hero / GridGallery / Steps / CTA…）
  - `pages.docs` : 一覧設定
  - `pages.blog` : ブログメタ
  - `pages.features` : プラン情報
  - `pages.contact` : お問い合わせ文面
- texts.json
  - nav, footer, buttons, form, messages, ui … などラベル系

### 6.2 温泉データモデル（OnsenSpot）

- `onsen-types.ts` に定義済みのフィールドを尊重：
  - 地域（都道府県、エリア）
  - 泉質・pH・温度・効能
  - アクセス（東京からの時間、最寄駅）
  - 宿泊情報（日帰り可否、旅館一覧）
  - 季節の魅力
- 要件：
  - `/docs/[slug]` で **「これだけ見ればその温泉に行ける」レベル** の情報は揃える
  - 画像 (`main`, `gallery[]`) は実写を基本とする

---

## 7. テーマ切替 & テンプレート要件

### 7.1 ACTIVE_THEME

- `app/lib/content.ts` もしくは `app/config/theme.ts` 的な1ファイルに
  - `const ACTIVE_THEME = 'onsen-kanto' as const;`
- 将来：
  - `process.env.NEXT_PUBLIC_ACTIVE_THEME`
  - URL プレフィックス（`/onsen`, `/camp`, `/school`）などで切替可能に

### 7.2 テンプレートディレクトリ

- `themes/_template/`
  - `content.json`
  - `texts.json`
- 要件：
  - Onsen 依存フィールドを持たない抽象スキーマ
  - `images.ts` 側も `_template` 用の枠だけ用意
  - 「この2ファイルをコピーして埋めれば新テーマ完成」という状態

---

## 8. 非機能要件

### 8.1 パフォーマンス / SEO

- 静的エクスポート（`output: 'export'`）
- 画像最適化（将来）
- メタタグ：
  - `title / description`
  - OG / Twitter Card（優先度 P1）
  - 将来 JSON-LD（Place, Article）

### 8.2 アクセシビリティ

- `prefers-reduced-motion` 対応（Hero スライダーなど）
- alt テキスト必須
- キーボードナビゲーション配慮（モーダル等導入時）

---

## 9. 画像取得・管理ポリシー

### 9.1 現状（Manual）

- 画像選定は **人間が Wikimedia 等から選ぶ**
- `app/lib/images.ts` に URL / 作者 / ライセンスを手入力
- エージェントは「候補提示」役に留める

### 9.2 近未来（半自動）

- Cursor / Gemini 3.0 が
  - 検索クエリ提案（例：`site:commons.wikimedia.org 露天風呂 紅葉 日本`）
  - 候補リンク一覧を出す
- 最終決定と `images.ts` への反映は人間

### 9.3 将来（画像サブエージェント）

**画像サブエージェントの責務要件：**

- 入力：
  - テーマ（例：`onsen-kanto`）
  - 用途（`hero.starry_night`, `hero.snow` などキー名）
- 処理：
  - Web 検索（Wikimedia 等）
  - 温泉であることの確認（湯船・露天が写っている）
  - 作者・ライセンス抽出
  - 候補リストを JSON で返す
- 出力：
  - `data/hero_image_candidates.json` に `{ key, url, author, license, source }[]`
- GitHub 連携：
  - 将来は GitHub Actions / スクリプトで `images.ts` を部分的に書き換える

---

## 10. エージェント構成の要件（構想）

### 10.1 メインエージェント（設計・統括）

- 要件：
  - 要件定義・仕様策定・レビュー
  - Cursor / Codex / Gemini などへのプロンプト作成
  - 各エージェントのログを読んで判断する

### 10.2 実装エージェント（Cursor）

- Next.js / TypeScript / Tailwind の実装
- ルール：
  - `cursor-rules.md` を必ず読む
  - main 直 push 禁止
  - 作業ログ（`WORK_LOG.md` 他）を更新

### 10.3 画像エージェント（将来は Gemini 3.0 など）

- 役割：
  - 画像候補検索
  - ライセンス確認
  - 必要なら生成（ただしテンプレとしては「検索優先」）

### 10.4 ファクトチェック / スクレイピングエージェント（将来）

- 温泉情報（泉質・効能・アクセス）の二重チェック
- 公式サイト・観光協会サイトを参照

---

## 11. md ファイル運用ルール

### 11.1 配置方針

- `docs/` 配下に集約するもの：
  - 仕様・ルール・設計ドキュメント
    - `docs/requirements.md`（この文書）
    - `docs/theme-schema.md`
    - `docs/cursor-rules.md`（後述）
    - 各種 *_REPORT.md（画像、Hero/CTA などのレポート）
- リポジトリ直下に残すもの：
  - `WORK_LOG.md`（作業ログ専用）
- それ以外の md が散らばっている場合：
  - レポート/仕様系は `docs/` に移動
  - README 系・テンプレ案などは、必要なら `docs/` にサブフォルダで整理（例：`docs/reports/`, `docs/archive/`）

### 11.2 cursor-rules.md の一本化

- もし複数の「ルール／ポリシー」系 md がある場合：
  - 内容をマージして `docs/cursor-rules.md` に統合
- 最低限、以下を含める：
  - JSON First の原則
  - 型安全性（`npm run lint` / `npm run build` が常に通ること）
  - main 直 push 禁止（編集・commit までは可）
  - WORK_LOG.md を更新するルール
  - 画像は可能な限り「温泉実写」を使うこと（Wikimedia 等 / ライセンス表記）

---

ここまでを **「website_v2 の単一の要件定義」** として採用する。
