# 📚 ドキュメント一覧

> **🤖 AI エージェント向けクイックスタート**  
> 1. **[`CURRENT_STATE.md`](./CURRENT_STATE.md)** で現在の状態を確認（必読）
> 2. **[`AGENT_MASTER_GUIDE.md`](./AGENT_MASTER_GUIDE.md)** で作業開始方法を確認  
> 3. **作業を開始！**

**⚠️ 重要**: すべての対応は **日本語** で行ってください。

---

## 🎯 迷わないための3ステップ

### Step 1: 現在の状態を知る 📊
**[`CURRENT_STATE.md`](./CURRENT_STATE.md)** - プロジェクトの最新状態

- ✅ 何が完了しているか
- 🔄 何が進行中か
- 📋 何が未着手か
- 🎯 次に何をすべきか

**読了時間**: 3分

---

### Step 2: 作業方法を学ぶ 🤖
**[`AGENT_MASTER_GUIDE.md`](./AGENT_MASTER_GUIDE.md)** - エージェント向けマスターガイド

- エージェント別の役割
- 初日タスク
- API設定
- セキュリティ要件
- 作業フロー

**読了時間**: 5分

---

### Step 3: 詳細計画を確認 ⚡
**[`ACCELERATED_ROADMAP.md`](./ACCELERATED_ROADMAP.md)** - 2週間実装プラン

- 日次タスク
- チェックリスト
- 並行作業の調整

**読了時間**: 10分

---

## 📖 ドキュメント分類

### 🟢 コア（必読）

| ドキュメント | 内容 | 読了時間 |
|-------------|------|---------|
| **[CURRENT_STATE.md](./CURRENT_STATE.md)** | **現在の開発状態** | 3分 |
| [AGENT_MASTER_GUIDE.md](./AGENT_MASTER_GUIDE.md) | エージェント向けガイド | 5分 |
| [ACCELERATED_ROADMAP.md](./ACCELERATED_ROADMAP.md) | 2週間実装プラン | 10分 |
| [SECURITY_REQUIREMENTS.md](./SECURITY_REQUIREMENTS.md) | セキュリティ要件 | 5分 |
| [UI_REDESIGN_URGENT.md](./UI_REDESIGN_URGENT.md) | 緊急UI対応計画 | 5分 |

---

### 🟡 技術リファレンス（参照用）

| ドキュメント | 内容 | 読了時間 |
|-------------|------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | アーキテクチャ全体像 | 10分 |
| [IMAGE_OPTIMIZATION_GUIDE.md](./IMAGE_OPTIMIZATION_GUIDE.md) | 画像最適化の詳細 | 20分 |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | 実装コードサンプル集 | 30分 |
| [CODEQL_ANALYSIS_REPORT.md](./CODEQL_ANALYSIS_REPORT.md) | セキュリティ分析結果 | 10分 |

---

### 🔵 参考情報（大きいファイル、必要時のみ）

| ドキュメント | 内容 | サイズ |
|-------------|------|--------|
| [BEST_PRACTICES_RECOMMENDATIONS.md](./BEST_PRACTICES_RECOMMENDATIONS.md) | ベストプラクティス集 | 28KB |
| [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) | クリーンアップ履歴 | 9.7KB |

---

## 🚀 作業開始フロー

### パターン1: 単独エージェント（推奨）
```
1. CURRENT_STATE.md で状況把握（3分）
2. AGENT_MASTER_GUIDE.md で方法確認（5分）
3. タスク開始！
```

### パターン2: 複数エージェント並行作業
```
1. CURRENT_STATE.md で状況把握（3分）
2. ACCELERATED_ROADMAP.md でタスク分担確認（10分）
3. 各エージェントが並行作業開始！
```

### パターン3: 技術詳細が必要な場合
```
1-2. 上記パターンで開始
3. 該当する技術リファレンスを参照
   - 画像 → IMAGE_OPTIMIZATION_GUIDE.md
   - アーキテクチャ → ARCHITECTURE.md
   - 実装例 → IMPLEMENTATION_GUIDE.md
```

---

## 🎓 役割別おすすめドキュメント

### 🤖 AI エージェント
1. **CURRENT_STATE.md** ← **ここから開始！**
2. AGENT_MASTER_GUIDE.md
3. ACCELERATED_ROADMAP.md

### 👨‍💼 プロジェクトマネージャー
1. CURRENT_STATE.md
2. ACCELERATED_ROADMAP.md
3. BEST_PRACTICES_RECOMMENDATIONS.md（参考）

### 👨‍💻 開発者
1. CURRENT_STATE.md
2. IMPLEMENTATION_GUIDE.md
3. 該当する技術リファレンス

### 🔒 セキュリティ担当
1. SECURITY_REQUIREMENTS.md
2. CODEQL_ANALYSIS_REPORT.md
3. CURRENT_STATE.md

---

## 🛠️ クイック検証コマンド

```bash
# セキュリティチェック
npm audit

# ビルド確認
SKIP_CHECK=true npm run build

# 型チェック
npx tsc --noEmit

# リント
npm run lint
```

---

## 📁 ディレクトリ構造

```
docs/
├── CURRENT_STATE.md           ★ 現在の状態（必読）
├── AGENT_MASTER_GUIDE.md      ★ エージェントガイド
├── ACCELERATED_ROADMAP.md     ★ 実装計画
├── SECURITY_REQUIREMENTS.md   ★ セキュリティ
├── UI_REDESIGN_URGENT.md      ★ 緊急UI対応
├── ARCHITECTURE.md            技術: アーキテクチャ
├── IMAGE_OPTIMIZATION_GUIDE.md 技術: 画像最適化
├── IMPLEMENTATION_GUIDE.md    技術: 実装ガイド
├── CODEQL_ANALYSIS_REPORT.md  技術: セキュリティ分析
├── BEST_PRACTICES_RECOMMENDATIONS.md  参考: ベストプラクティス
├── CLEANUP_SUMMARY.md         参考: クリーンアップ履歴
├── design/                    設計ドキュメント
│   └── MASTER_BLUEPRINT_V1.md
└── reports/                   レポート
    └── REVIEW_SITE_CURRENT.md
```

---

## ⚠️ 注意: 削除済みファイル

以下のファイルは **存在しません**（内容は他のファイルに統合済み）:

- ❌ `ANALYSIS_SUMMARY.md` → `CURRENT_STATE.md` に統合
- ❌ `PHASE_TRANSITION_REPORT.md` → `ACCELERATED_ROADMAP.md` に統合
- ❌ `IMPLEMENTATION_PLAN_V3.md` → `ACCELERATED_ROADMAP.md` に統合
- ❌ `REQUIREMENTS.md` → `AGENT_MASTER_GUIDE.md` に統合
- ❌ `RULES.md` → `AGENT_MASTER_GUIDE.md` に統合
- ❌ `START_HERE.md` → `AGENT_MASTER_GUIDE.md` に統合予定

---

## ❓ よくある質問

### Q: どこから読めばいいですか？
**A**: **[`CURRENT_STATE.md`](./CURRENT_STATE.md)** から読んでください。現在の状態と次にすべきことが明確に書かれています。

### Q: エージェントが複数いる場合は？
**A**: 全員が **CURRENT_STATE.md** を読んだ後、**ACCELERATED_ROADMAP.md** でタスク分担を確認してください。

### Q: 技術詳細はどこにありますか？
**A**: 「技術リファレンス」セクションの各ドキュメントを参照してください。目的別に整理されています。

### Q: 古いドキュメントを参照してしまいました
**A**: 「削除済みファイル」セクションを確認してください。どのファイルに統合されたかが記載されています。

---

## 📊 ドキュメント更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2025-12-21 | CURRENT_STATE.md 追加、README.md 完全リニューアル |
| 2025-12-15 | AGENT_MASTER_GUIDE.md、ACCELERATED_ROADMAP.md 作成 |

---

**最終更新**: 2025年12月21日  
**次回更新**: タスク完了時
