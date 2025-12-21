# ドキュメント一覧

> **🚀 AI エージェント向け**: [`AGENT_MASTER_GUIDE.md`](./AGENT_MASTER_GUIDE.md) を読んでください（1つのファイルで完結）

**⚠️ 重要**: すべての対応は **日本語** で行ってください。

---

## 📚 整理後のドキュメント構造

### 🟢 必読（エージェントはこれだけでOK）

#### 🤖 [AGENT_MASTER_GUIDE.md](./AGENT_MASTER_GUIDE.md) ⭐ **エージェントマスターガイド**
**読了時間**: 5分

**このファイルだけ読めば作業開始できます。以下がすべて含まれています**：
- プロジェクトの最優先目標（画像収集、ベンチマークサイト風UI）
- エージェント別の役割と初日タスク
- API設定（Wikimedia Commons、sharp）
- セキュリティ要件
- 作業フロー
- 現在の進捗状況

---

#### ⚡ [ACCELERATED_ROADMAP.md](./ACCELERATED_ROADMAP.md)
**読了時間**: 10分

2週間実装プラン。日次タスクとチェックリスト。

---

#### 🔒 [SECURITY_REQUIREMENTS.md](./SECURITY_REQUIREMENTS.md)
**読了時間**: 5分

セキュリティ要件とバージョン管理。

---

### 🟡 参照用（必要に応じて）

#### 🖼️ [IMAGE_OPTIMIZATION_GUIDE.md](./IMAGE_OPTIMIZATION_GUIDE.md)
画像最適化の詳細手順（sharp、ビルド時最適化）。

#### 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)
アーキテクチャ全体像（JSON First、ディレクトリ構造）。

#### 💻 [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
実装コードサンプル集。

---

### 🔴 廃止済み（削除完了）

以下のファイルは削除されました（内容は他のファイルに統合済み）：

- ~~`ANALYSIS_SUMMARY.md`~~ → `AGENT_MASTER_GUIDE.md` に統合（削除済み）
- ~~`PHASE_TRANSITION_REPORT.md`~~ → `ACCELERATED_ROADMAP.md` に統合（削除済み）
- ~~`IMPLEMENTATION_PLAN_V3.md`~~ → `ACCELERATED_ROADMAP.md` に統合（削除済み）
- ~~`REQUIREMENTS.md`~~ → `AGENT_MASTER_GUIDE.md` に統合（削除済み）
- ~~`RULES.md`~~ → `AGENT_MASTER_GUIDE.md` に統合（削除済み）

### 🟡 保留中（今後判断）

- `START_HERE.md` → `AGENT_MASTER_GUIDE.md` に統合済みだが一部独自内容あり
- `BEST_PRACTICES_RECOMMENDATIONS.md` → 必要な部分は他に統合済みだが参考情報あり

---

## 🎯 作業開始方法

1. **[`AGENT_MASTER_GUIDE.md`](./AGENT_MASTER_GUIDE.md) を読む**（5分）
2. **自分の役割を確認**（エージェントA-D）
3. **初日タスクを開始**

**それだけです！**  
**用途**: 実装手順の詳細とコードサンプル集

---

#### 📸 [IMAGE_OPTIMIZATION_GUIDE.md](./IMAGE_OPTIMIZATION_GUIDE.md)
**サイズ**: 16KB（中）  
**用途**: 画像最適化の詳細実装ガイド

---

### 📋 [BEST_PRACTICES_RECOMMENDATIONS.md](./BEST_PRACTICES_RECOMMENDATIONS.md)
**読むべき人**: プロジェクトマネージャー、技術リーダー

ベンチマークサイトに近づけるための包括的な提案と、優先順位付きの改善計画。

**内容**:
- セキュリティ改善（Next.js脆弱性対応）
- パフォーマンス最適化（バンドルサイズ、画像、フォント）
- SEO強化（メタデータ、構造化データ）
- アクセシビリティ向上（ARIA、キーボード対応）
- リポジトリ構造改善
- CI/CDパイプライン強化

**読了時間**: 30分

---

### 🛠️ [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
**読むべき人**: 開発者、実装担当者

即座に実装可能な具体的な手順とコード例を提供する実践ガイド。

**内容**:
- **クイックウィン**（1-2時間で完了）
  - Next.js セキュリティ更新
  - フォント最適化
  - robots.txt 強化
  - エラーページ改善
- **中期的実装**（1-2週間）
  - SEO完全実装
  - 構造化データ（JSON-LD）
  - アクセシビリティ改善
  - 画像最適化
- 継続的改善チェックリスト
- 効果測定方法

**読了時間**: 45分

---

### 📸 [IMAGE_OPTIMIZATION_GUIDE.md](./IMAGE_OPTIMIZATION_GUIDE.md)
**読むべき人**: フロントエンド開発者

GitHub Pages環境での画像最適化の実践的なガイド。

**内容**:
- ビルド時最適化の実装（sharp使用）
- レスポンシブ画像コンポーネント
- AVIF/WebP対応
- ブラーアップ、アート・ディレクション
- Lazy Loading の最適化
- パフォーマンス目標
- トラブルシューティング

**読了時間**: 30分

---

## 🚀 クイックスタートガイド

### 読むべき順序（作業形態別）

#### 🔥 複数エージェント並行作業の場合（推奨）

1. **ACCELERATED_ROADMAP.md** ← **必読！2週間で完了**
2. **ANALYSIS_SUMMARY.md** - 現状分析を確認
3. **IMPLEMENTATION_GUIDE.md** - 具体的な実装方法を参照
4. **IMAGE_OPTIMIZATION_GUIDE.md** - 画像担当者は必読

**実装開始**: 即座に Day 1 タスクを分担して開始

#### 📚 単独または順次作業の場合

1. **ANALYSIS_SUMMARY.md** - 全体像を把握
2. **IMPLEMENTATION_GUIDE.md** - 実装方法を理解
3. **関連ドキュメント** - 必要に応じて参照

**実装開始**: フェーズ1から順次進める

---

### クイック検証

```bash
# セキュリティチェック
npm audit

# ビルド確認
SKIP_CHECK=true npm run build
```

---

## 📊 優先度マトリクス

### 作業の優先度

詳細は `ACCELERATED_ROADMAP.md` を参照してください。

---

## 🎯 期待される効果（サマリー）

詳細は `ACCELERATED_ROADMAP.md` および `AGENT_MASTER_GUIDE.md` を参照してください。

---

## 📁 その他のドキュメント

### アーキテクチャ・設計

- [ARCHITECTURE.md](./ARCHITECTURE.md) - アーキテクチャ設計書
- [REQUIREMENTS.md](./REQUIREMENTS.md) - 要件定義
- [RULES.md](./RULES.md) - 開発ルール

### レポート

- [reports/](./reports/) - 各種分析レポート

### アーカイブ

- [archive/v1-docs/](./archive/v1-docs/) - 旧バージョンのドキュメント

---

## 💡 ドキュメントの使い方

### プロジェクトマネージャー向け

1. **ANALYSIS_SUMMARY.md** でプロジェクトの現状を把握
2. **BEST_PRACTICES_RECOMMENDATIONS.md** で改善提案を確認
3. チームと実装計画を策定

### 開発者向け

1. **IMPLEMENTATION_GUIDE.md** で実装方法を学習
2. **IMAGE_OPTIMIZATION_GUIDE.md** で画像最適化を実装
3. コードサンプルをコピー＆カスタマイズ

### 技術リーダー向け

1. **ANALYSIS_SUMMARY.md** で技術的な課題を把握
2. **BEST_PRACTICES_RECOMMENDATIONS.md** で全体設計を確認
3. 優先順位を調整し、ロードマップを策定

---

## 🔄 継続的な改善

このドキュメントは、プロジェクトの進化に合わせて更新されます。

### 毎週
- 実装状況の確認
- 新たな課題の特定

### 毎月
- パフォーマンス指標の計測
- ドキュメントの更新

### 四半期ごと
- 目標の見直し
- 新しいベストプラクティスの適用

---

## ❓ よくある質問

### Q: すべての改善を一度に実装する必要がありますか？
**A**: いいえ。優先度の高いもの（セキュリティ、TypeScript strict）から始めて、段階的に実装することを推奨します。

### Q: 実装にはどのくらいの時間がかかりますか？
**A**: フェーズ1（緊急対応）は1週間、全体で約3ヶ月を想定しています。

### Q: どのドキュメントから読めばいいですか？
**A**: まず **ANALYSIS_SUMMARY.md** を読んで全体像を把握し、次に **IMPLEMENTATION_GUIDE.md** で具体的な実装方法を確認してください。

### Q: GitHub Pages の制約下でも画像最適化は可能ですか？
**A**: はい。ビルド時に画像を最適化することで、GitHub Pages でも高度な最適化が可能です。詳細は **IMAGE_OPTIMIZATION_GUIDE.md** を参照してください。

---

## 📞 サポート

ドキュメントに関する質問や不明点がある場合：

1. 関連ドキュメントをもう一度確認
2. コードサンプルを参考に実装
3. Issue を作成して質問

---

**最終更新**: 2025年12月15日  
**バージョン**: 1.0.0
