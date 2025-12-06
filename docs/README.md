# ドキュメント一覧

このディレクトリには、プロジェクトの設計、開発、デプロイに関するドキュメントが整理されています。

## 🧭 まず読むべきファイル
- `requirements.md` — プロジェクト全体の要件定義（単一ソース）
- `cursor-rules.md` — エージェント向けの運用ルール
- `START_HERE.md` — 作業開始のチェックリスト

## 📁 ディレクトリ構成

### `/docs/architecture/` - アーキテクチャ設計
- `ARCHITECTURE_ANALYSIS.md` - アーキテクチャ分析と問題点
- `ARCHITECTURE_DESIGN.md` - アーキテクチャ設計書
- `COMPLETE_ARCHITECTURE.md` - 完全なアーキテクチャ設計書
- `REPOSITORY_STRUCTURE.md` - リポジトリ構造設計書

### `/docs/development/` - 開発ドキュメント
- `REFACTORING_PLAN.md` - リファクタリング計画書
- `REFACTORING_SUMMARY.md` - リファクタリング完了サマリー
- `STEP1_COMPLETION.md` - ステップ1完了報告
- `STEP2_COMPLETION.md` - ステップ2完了報告
- `STRUCTURE_REVIEW.md` - 構成レビュー報告書

### `/docs/deployment/` - デプロイ関連
- `DEPLOYMENT_SUMMARY.md` - デプロイ完了サマリー
- `PRE_DEPLOYMENT_CHECKLIST.md` - デプロイ前チェックリスト
- `FINAL_FIXES_REPORT.md` - 最終修正報告書
- `FINAL_REVIEW_REPORT.md` - 最終レビュー報告書
- `FINAL_COMPREHENSIVE_REPORT.md` - 最終包括的報告書
- `FIXES_SUMMARY.md` - 修正内容サマリー
- `COMPREHENSIVE_REPORT.md` - 包括的報告書
- `IMAGE_URLS.md` - 画像URLの説明

### `/docs/reports/` - レポート・分析系ドキュメント
- `IMAGE_AUDIT_REPORT.md` / `HERO_CTA_MOTION_REPORT.md` など画像・モーション関連レポート
- `COMPLETE_TEST_SUMMARY.md` / `UI_BREAKAGE_ANALYSIS.md` など検証・テストレポート
- `NAV_TEXTS_MIGRATION_SUMMARY.md` など移行・改善サマリー

## 🎯 各エージェント向けガイド

### コンテンツ編集者（非エンジニア）
**見るべきファイル**: 
- `/themes/onsen-kanto/content.json` - すべてのコンテンツを編集するファイル

**編集方法**: 
- `content.json`を編集するだけで、サイト全体のコンテンツが変更されます
- 詳細は `COMPLETE_ARCHITECTURE.md` を参照

### 開発者
**見るべきファイル**:
- `/docs/architecture/COMPLETE_ARCHITECTURE.md` - 完全なアーキテクチャ設計
- `/app/lib/content.ts` - コンテンツ読み込みロジック
- `/themes/onsen-kanto/content.json` - コンテンツ定義

### デプロイ担当者
**見るべきファイル**:
- `/docs/deployment/PRE_DEPLOYMENT_CHECKLIST.md` - デプロイ前チェックリスト
- `/.github/workflows/pages.yml` - デプロイワークフロー

## 📖 クイックリファレンス

### サイトのコンテンツを変更したい場合
→ `/themes/onsen-kanto/content.json` を編集

### コードの構造を理解したい場合
→ `/docs/architecture/COMPLETE_ARCHITECTURE.md` を参照

### デプロイ前に確認したい場合
→ `/docs/deployment/PRE_DEPLOYMENT_CHECKLIST.md` を参照
