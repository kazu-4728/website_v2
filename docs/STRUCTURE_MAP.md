# 📊 リポジトリ構造マップ（2025年12月21日版）

> **このドキュメントは、リポジトリの全体構造を視覚的に示します**

---

## 🗺️ ドキュメント構造（整理後）

```
docs/
│
├── 🟢 CURRENT_STATE.md           ★★★ 【最初に読む】現在の開発状態
│                                  └─ 完了/進行中/未着手タスク
│                                  └─ 次にすべきこと（3オプション）
│
├── 🤖 AGENT_MASTER_GUIDE.md      ★★  エージェント向けマスターガイド
│                                  └─ 役割別タスク
│                                  └─ API設定、セキュリティ
│
├── ⚡ QUICK_START.md             ★   最速スタートガイド（1-8分）
│                                  └─ 3ステップガイド
│                                  └─ よくある間違い
│
├── 📋 README.md                       ドキュメント索引
│                                  └─ 3ステップガイド
│                                  └─ 役割別おすすめ
│
├── 🎯 ACCELERATED_ROADMAP.md          2週間実装プラン
│                                  └─ 日次タスク
│                                  └─ チェックリスト
│
├── 🔒 SECURITY_REQUIREMENTS.md        セキュリティ要件
│                                  └─ バージョン管理
│                                  └─ 脆弱性対応
│
├── 🎨 UI_REDESIGN_URGENT.md           UI緊急対応計画
│                                  └─ あえの風レベル達成
│
├── 🏗️ ARCHITECTURE.md                アーキテクチャ全体像
├── 🖼️ IMAGE_OPTIMIZATION_GUIDE.md    画像最適化詳細
├── 💻 IMPLEMENTATION_GUIDE.md         実装コードサンプル
├── 🔍 CODEQL_ANALYSIS_REPORT.md       セキュリティ分析
├── 📚 BEST_PRACTICES_RECOMMENDATIONS.md  ベストプラクティス
│
├── design/
│   └── MASTER_BLUEPRINT_V1.md         設計ブループリント
│
├── reports/
│   └── REVIEW_SITE_CURRENT.md         サイトレビュー
│
└── archive/
    └── CLEANUP_SUMMARY.md             クリーンアップ履歴
```

---

## 🚀 エージェントの作業フロー

```
START
  │
  ▼
┌─────────────────────────┐
│ 1. CURRENT_STATE.md     │ ← 【必読】現状把握（3分）
│    を読む               │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 2. AGENT_MASTER_GUIDE.md│ ← 方法確認（5分）
│    を読む               │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 3. タスク選択           │
│                         │
│ オプション1: 技術的負債 │
│ オプション2: UI/UX対応  │
│ オプション3: 並行実施   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 4. 環境準備             │
│  $ npm install          │
│  $ npm run dev          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 5. 作業実施             │
│  - 編集                 │
│  - テスト               │
│  - コミット             │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 6. 次のタスクへ         │
└─────────────────────────┘
```

---

## 📁 ディレクトリ構造（全体）

```
website_v2/
│
├── .cursorrules                  ← エージェント向けルール
├── .github/
│   ├── copilot-instructions.md  ← Copilot設定
│   └── workflows/               ← CI/CD設定
│
├── app/                          ← Next.js App Router
│   ├── page.tsx                 ← ホームページ
│   ├── layout.tsx               ← レイアウト
│   ├── error.tsx                ← エラーページ ✅
│   ├── not-found.tsx            ← 404ページ ✅
│   ├── loading.tsx              ← ローディング ✅
│   ├── robots.ts                ← robots.txt ✅
│   ├── sitemap.ts               ← サイトマップ
│   ├── lib/                     ← ライブラリ
│   │   ├── content.ts           ← コンテンツ管理
│   │   ├── images.ts            ← 画像管理
│   │   └── theme-types.ts       ← 型定義
│   ├── components/              ← コンポーネント
│   │   └── _legacy/             ← レガシーコンポーネント
│   ├── [slug]/                  ← 動的ルート
│   ├── blog/                    ← ブログ
│   ├── docs/                    ← ドキュメント
│   ├── features/                ← 機能紹介
│   └── contact/                 ← お問い合わせ
│
├── data/
│   └── wikimedia-images.json    ← 画像データ
│
├── docs/                         ← ドキュメント（整理済み）
│   ├── CURRENT_STATE.md         ← ★ 最初に読む
│   ├── AGENT_MASTER_GUIDE.md    ← ★ 次に読む
│   ├── QUICK_START.md           ← ★ 困ったら読む
│   ├── README.md                ← 索引
│   └── ...（その他ドキュメント）
│
├── public/
│   └── images/                  ← 静的画像
│
├── scripts/                     ← スクリプト
│   ├── fetch-wikimedia-images.js    ← 画像取得
│   ├── check-images.js              ← 画像確認
│   └── ...（その他スクリプト）
│
├── tests/                       ← テスト
│   ├── lib/                     ← ライブラリテスト
│   └── integration/             ← 統合テスト
│
├── themes/                      ← テーマ
│   ├── onsen-kanto/             ← 関東温泉テーマ
│   │   ├── content.json         ← コンテンツ設定
│   │   └── texts.json           ← テキスト管理
│   └── _template/               ← テンプレート
│
├── package.json                 ← 依存関係
├── tsconfig.json                ← TypeScript設定
├── next.config.mjs              ← Next.js設定
├── tailwind.config.ts           ← Tailwind設定
└── vitest.config.ts             ← テスト設定
```

---

## 🎯 タスク別ファイルマップ

### UI/UX改善タスク
```
docs/UI_REDESIGN_URGENT.md              ← 計画
  ↓
app/components/home/CinematicHero.tsx   ← Hero実装
app/components/home/GridGallery.tsx     ← ギャラリー実装
app/page.tsx                            ← ホーム統合
  ↓
npm run build                           ← ビルド確認
```

### TypeScript完全化タスク
```
docs/ACCELERATED_ROADMAP.md             ← 計画（Phase 2）
  ↓
app/lib/content.ts                      ← 型エラー修正
app/lib/images.ts                       ← 型エラー修正
tsconfig.json                           ← strict: true 有効化
  ↓
npx tsc --noEmit                        ← 型チェック
```

### 画像最適化タスク
```
docs/IMAGE_OPTIMIZATION_GUIDE.md        ← 詳細ガイド
  ↓
scripts/optimize-images.js              ← 作成
app/components/OptimizedImage.tsx       ← 作成
  ↓
app/page.tsx                            ← 画像置き換え
npm run optimize:images                 ← 最適化実行
```

### SEO実装タスク
```
docs/ACCELERATED_ROADMAP.md             ← 計画（Phase 3）
  ↓
app/lib/metadata.ts                     ← 作成
app/layout.tsx                          ← メタデータ追加
app/[slug]/page.tsx                     ← generateMetadata実装
  ↓
npm run build                           ← 確認
```

---

## 📊 完了状況（一目で分かる）

### ✅ 完了済み（緑）
```
✅ Next.js 16.0.10          セキュリティ対応
✅ noImplicitAny: true      型安全性（部分）
✅ エラーページ実装         UX向上
✅ robots.txt強化           SEO基盤
```

### 🔄 進行中（黄）
```
🔄 TypeScript Strict Mode   70%完了
🔄 画像最適化システム       0%（未着手）
```

### 📋 未着手（赤）
```
📋 UI/UX緊急対応           高優先度
📋 バンドルサイズ削減       中優先度
📋 SEO完全実装             中優先度
📋 アクセシビリティ向上     低優先度
📋 CI/CD強化               低優先度
```

---

## 🔍 ファイル検索ガイド

### 困った時の検索キーワード

| 知りたいこと | 検索キーワード | 該当ファイル |
|-------------|---------------|-------------|
| 現在の状態 | `CURRENT_STATE` | docs/CURRENT_STATE.md |
| 作業方法 | `AGENT_MASTER` | docs/AGENT_MASTER_GUIDE.md |
| クイックスタート | `QUICK_START` | docs/QUICK_START.md |
| UI改善 | `UI_REDESIGN` | docs/UI_REDESIGN_URGENT.md |
| 画像最適化 | `IMAGE_OPTIMIZATION` | docs/IMAGE_OPTIMIZATION_GUIDE.md |
| セキュリティ | `SECURITY_REQUIREMENTS` | docs/SECURITY_REQUIREMENTS.md |
| 2週間計画 | `ACCELERATED` | docs/ACCELERATED_ROADMAP.md |

---

## ⚠️ 削除済みファイル（読まないでください）

以下のファイルは **存在しません**。参照しようとするとエラーになります：

```
❌ docs/ANALYSIS_SUMMARY.md           → CURRENT_STATE.mdに統合
❌ docs/PHASE_TRANSITION_REPORT.md    → ACCELERATED_ROADMAP.mdに統合
❌ docs/IMPLEMENTATION_PLAN_V3.md     → ACCELERATED_ROADMAP.mdに統合
❌ docs/REQUIREMENTS.md               → AGENT_MASTER_GUIDE.mdに統合
❌ docs/RULES.md                      → AGENT_MASTER_GUIDE.mdに統合
❌ docs/FUTURE_TASKS.md               → CURRENT_STATE.mdに統合
❌ docs/agent/AGENT_GUIDE.md          → 存在しないディレクトリ
❌ docs/agent/START_HERE.md           → 存在しないディレクトリ
```

**代わりに**: `docs/CURRENT_STATE.md` を読んでください

---

## 💡 このマップの使い方

### 初めての場合
1. このファイル全体をざっと読む（5分）
2. `docs/CURRENT_STATE.md`を読む（3分）
3. `docs/AGENT_MASTER_GUIDE.md`を読む（5分）
4. 作業開始！

### 迷った場合
1. 「🔍 ファイル検索ガイド」で該当ファイルを探す
2. 「🎯 タスク別ファイルマップ」で関連ファイルを確認
3. 「🚀 エージェントの作業フロー」で手順を確認

### 急いでいる場合
1. `docs/QUICK_START.md`を読む（1分）
2. 3ステップガイドに従う
3. 作業開始！

---

**最終更新**: 2025年12月21日  
**次回更新**: 大きな構造変更時
