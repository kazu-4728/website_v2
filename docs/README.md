# ドキュメントディレクトリ

このディレクトリには、プロジェクトに関するすべてのドキュメントが含まれています。

## 📚 ディレクトリ構造

### エージェント向け（AIエージェントが使用）

- **[`agent/`](./agent/)** - エージェント向けドキュメント
  - `AGENT_GUIDE.md` - ⭐ **エージェント向けガイド（必読）**
  - `START_HERE.md` - 作業開始時の必須確認事項
  - `README.md` - エージェント向けドキュメントの概要

### ユーザー向け（人間が使用）

- **[`user-guide/`](./user-guide/)** - ユーザー向けガイド
  - `README.md` - ユーザー向けドキュメントの概要

### 設計ドキュメント

- **[`design/`](./design/)** - 設計ドキュメント
  - `DESIGN_CONCEPTION_V4.md` - 設計構想（最新版）
  - `DESIGN_CONCEPTION_SUMMARY.md` - 設計構想サマリー
  - `UI_DESIGN_V3.md` - UI設計書
  - `REVIEW_SITE_CURRENT.md` - 現状分析レポート

### 画像システム

- **[`images/`](./images/)** - 画像システムドキュメント
  - `MULTI_API_IMAGE_FETCH.md` - 画像取得システムガイド
  - `IMAGE_FETCH_RECOMMENDATIONS.md` - 画像取得推奨事項
  - `README.md` - 画像システムドキュメントの概要

### アーキテクチャ

- **[`architecture/`](./architecture/)** - アーキテクチャドキュメント
  - `MASTER_ARCHITECTURE.md` - アーキテクチャの詳細

### レポート

- **[`reports/`](./reports/)** - 各種レポート
  - 過去の作業レポート、分析レポートなど

### その他

- `FUTURE_TASKS.md` - 今後の課題一覧
- `requirements.md` - 要件定義
- `cursor-rules.md` - 開発ルール

## 🚀 クイックスタート

### エージェントの場合

1. [`agent/AGENT_GUIDE.md`](./agent/AGENT_GUIDE.md)を読む
2. [`agent/START_HERE.md`](./agent/START_HERE.md)を読む
3. [`FUTURE_TASKS.md`](./FUTURE_TASKS.md)で課題を確認
4. 作業開始

### ユーザーの場合

1. [`user-guide/README.md`](./user-guide/README.md)を読む
2. [`design/DESIGN_CONCEPTION_SUMMARY.md`](./design/DESIGN_CONCEPTION_SUMMARY.md)で設計構想を確認
3. [`images/MULTI_API_IMAGE_FETCH.md`](./images/MULTI_API_IMAGE_FETCH.md)で画像システムを理解

## 📝 重要な原則

### 画像の取得と使用

- **画像は自動的にサイトに反映されません**
- 取得した画像はユーザーが確認してから使用します
- 詳細は [`agent/AGENT_GUIDE.md`](./agent/AGENT_GUIDE.md) を参照

### JSON Firstアーキテクチャ

- すべてのユーザー向けテキストは`themes/onsen-kanto/texts.json`で管理
- コンテンツ構造は`themes/onsen-kanto/content.json`で管理
