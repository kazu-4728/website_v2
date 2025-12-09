# ドキュメント一覧

このディレクトリには、プロジェクトのドキュメントが含まれています。

## 📚 最新の設計ドキュメント（2025年12月10日）

### [design/DESIGN_V5_MASTER.md](./design/DESIGN_V5_MASTER.md) ⭐ **最新版**

**ベンチマークサイトを目指す大改造の設計構想**

- ベンチマーク: 和倉温泉 あえの風 公式サイト
- 目標: 画像メインの情報多彩な温泉紹介サイト
- 方針: 既存サイトを忘れ、ゼロから再設計
- JSON Firstアーキテクチャを維持
- テンプレートとして他サイトに流用可能な構成

### [design/IMPLEMENTATION_PLAN_V5.md](./design/IMPLEMENTATION_PLAN_V5.md)

**実装計画 V5**

- フェーズ別実装計画
- 新規コンポーネントの設計
- 既存コンポーネントの強化方針

### [design/BENCHMARK_ANALYSIS.md](./design/BENCHMARK_ANALYSIS.md)

**ベンチマークサイトの詳細分析**

- ベンチマークサイトの核心的な特徴
- 現在のサイトとの具体的な違い
- 改善案

## 📁 ディレクトリ構成

### [design/](./design/) - 設計ドキュメント

- `DESIGN_V5_MASTER.md` - 最新の設計構想（2025年12月10日）
- `IMPLEMENTATION_PLAN_V5.md` - 実装計画
- `BENCHMARK_ANALYSIS.md` - ベンチマーク分析
- `REVIEW_SITE_CURRENT.md` - 現状分析レポート
- `UI_DESIGN_V3.md` - UI設計書 V3（参考用）
- `DESIGN_HISTORY.md` - 設計履歴
- `archive/` - 過去の設計ドキュメント

### [images/](./images/) - 画像システム

- `API_KEY_SETUP_GUIDE.md` - APIキー設定ガイド
- `IMAGE_MANAGEMENT_SYSTEM.md` - 画像管理システム
- `MULTI_API_IMAGE_FETCH.md` - 複数API画像取得システム
- その他の画像関連ドキュメント

### [agent/](./agent/) - エージェント向けガイド

- `AGENT_GUIDE.md` - エージェント向け包括的なガイド
- `IMAGE_WORKFLOW.md` - 画像取得ワークフロー
- `README.md` - エージェント向けドキュメントのインデックス

### [user-guide/](./user-guide/) - ユーザー向けガイド

- `README.md` - ユーザー向けドキュメントのインデックス

### [architecture/](./architecture/) - アーキテクチャ

- `MASTER_ARCHITECTURE.md` - マスターアーキテクチャ
- その他のアーキテクチャ関連ドキュメント

### [scripts-guide/](./scripts-guide/) - スクリプトガイド

- `README.md` - スクリプトガイドのインデックス

### [archive/](./archive/) - 過去のドキュメント

- `old-designs/` - 過去の設計ドキュメント
- `old-reports/` - 過去のレポート

## 📝 重要なドキュメント

### 作業開始前に必ず読む

1. **[agent/AGENT_GUIDE.md](./agent/AGENT_GUIDE.md)** - エージェント向けガイド
2. **[design/DESIGN_V5_MASTER.md](./design/DESIGN_V5_MASTER.md)** - 最新の設計構想
3. **[requirements.md](./requirements.md)** - 要件定義
4. **[cursor-rules.md](./cursor-rules.md)** - 開発ルール

### 設計・実装時

1. **[design/DESIGN_V5_MASTER.md](./design/DESIGN_V5_MASTER.md)** - 最新の設計構想
2. **[design/IMPLEMENTATION_PLAN_V5.md](./design/IMPLEMENTATION_PLAN_V5.md)** - 実装計画
3. **[architecture/MASTER_ARCHITECTURE.md](./architecture/MASTER_ARCHITECTURE.md)** - アーキテクチャ

### 画像取得時

1. **[images/API_KEY_SETUP_GUIDE.md](./images/API_KEY_SETUP_GUIDE.md)** - APIキー設定
2. **[images/IMAGE_MANAGEMENT_SYSTEM.md](./images/IMAGE_MANAGEMENT_SYSTEM.md)** - 画像管理システム
3. **[agent/IMAGE_WORKFLOW.md](./agent/IMAGE_WORKFLOW.md)** - 画像取得ワークフロー

## 🎯 現在の方針（2025年12月10日）

- **既存サイトを忘れる**: 大改造のため、既存の実装は参考程度に
- **ベンチマークサイトを目指す**: 「あえの風」レベルの世界観・クオリティ
- **画像メイン**: 高品質な実写画像を大胆に使用
- **JSON First**: すべてのコンテンツとUIテキストをJSONで管理（維持）
- **テンプレート化**: テーマ切替可能な設計を維持

## 📚 過去の設計履歴

過去の設計ドキュメントは `design/DESIGN_HISTORY.md` を参照してください。

## ⚠️ 注意事項

- **最新の設計書を参照**: `design/DESIGN_V5_MASTER.md` を最優先で参照
- **既存サイトを忘れる**: 大改造のため、既存の実装は参考程度に
- **JSON Firstを維持**: すべてのコンテンツとUIテキストはJSONで管理
- **テンプレート化を考慮**: テーマ切替可能な設計を維持
