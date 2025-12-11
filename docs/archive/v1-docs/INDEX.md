# ドキュメントインデックス

このリポジトリのすべてのドキュメントへのナビゲーションです。

## 🎯 クイックアクセス

### コンテンツ編集者（非エンジニア）向け
- **[クイックスタートガイド](./QUICK_START.md)** - このファイルから始める
- **[マスターアーキテクチャ](./architecture/MASTER_ARCHITECTURE.md)** - 全体構造の理解

**編集するファイル**: `/themes/onsen-kanto/content.json`

### 開発者向け
- **[マスターアーキテクチャ](./architecture/MASTER_ARCHITECTURE.md)** - 完全なアーキテクチャ設計
- **[アーキテクチャ分析](./architecture/ARCHITECTURE_ANALYSIS.md)** - 問題点と解決策
- **[リポジトリ構造](./architecture/REPOSITORY_STRUCTURE.md)** - ファイル構成の詳細

### デプロイ担当者向け
- **[デプロイ前チェックリスト](./deployment/PRE_DEPLOYMENT_CHECKLIST.md)** - デプロイ前の確認事項
- **[デプロイ完了サマリー](./deployment/DEPLOYMENT_SUMMARY.md)** - デプロイ手順

## 📁 ディレクトリ構成

### `/docs/architecture/` - アーキテクチャ設計
- `MASTER_ARCHITECTURE.md` ⭐ - 完全なアーキテクチャ設計（最重要）
- `ARCHITECTURE_ANALYSIS.md` - アーキテクチャ分析と問題点
- `ARCHITECTURE_DESIGN.md` - アーキテクチャ設計書
- `COMPLETE_ARCHITECTURE.md` - 完全なアーキテクチャ設計書（詳細版）
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

## 🔍 ファイル検索ガイド

### コンテンツを編集したい
→ `/themes/onsen-kanto/content.json`

### コードの構造を理解したい
→ `/docs/architecture/MASTER_ARCHITECTURE.md`

### デプロイ前に確認したい
→ `/docs/deployment/PRE_DEPLOYMENT_CHECKLIST.md`

### 問題が発生した場合
→ `/docs/deployment/FINAL_FIXES_REPORT.md`

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
