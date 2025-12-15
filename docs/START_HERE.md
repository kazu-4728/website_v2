# 🚀 START HERE - エージェント向けクイックガイド

**このドキュメントは AI エージェントが最初に読むべき簡潔なガイドです。**

---

## ⚡ 即座に実行すべきこと（Day 1）

### 1. セキュリティ脆弱性の解消（30分）⚠️

```bash
cp package-lock.json package-lock.json.backup
npm install next@latest
npm audit fix
npm run build
```

**理由**: Next.js 15.5.6 に Critical 1件、High 3件の CVE が存在

---

## 📚 ドキュメント構成（簡潔版）

### 必読ドキュメント（小サイズ）

1. **このファイル（START_HERE.md）** - あなたが今読んでいるファイル
2. **ACCELERATED_ROADMAP.md** - 2週間実装プラン（エージェント別タスク）
3. **README.md** - ドキュメント索引

### 参照用ドキュメント（大サイズ、必要な時のみ開く）

- **BEST_PRACTICES_RECOMMENDATIONS.md** (28KB) - 詳細な技術提案
- **IMPLEMENTATION_GUIDE.md** (19KB) - コードサンプル集
- **IMAGE_OPTIMIZATION_GUIDE.md** (16KB) - 画像最適化の詳細

**重要**: 大きなドキュメントは `.aiignore` / `.cursorignore` でコンテキストから除外済み。必要な時のみ開いてください。

---

## 🎯 エージェント別の開始地点

### エージェント A: パフォーマンス担当
**読むべき**: ACCELERATED_ROADMAP.md の「エージェントA」セクション  
**初日タスク**: クイックウィン実装（2時間）

### エージェント B: TypeScript/セキュリティ担当
**読むべき**: ACCELERATED_ROADMAP.md の「エージェントB」セクション  
**初日タスク**: セキュリティ対応（2時間）

### エージェント C: SEO/メタデータ担当
**読むべき**: ACCELERATED_ROADMAP.md の「エージェントC」セクション  
**初日タスク**: バンドルサイズ削減（6時間、Day 2-3）

### エージェント D: アクセシビリティ担当
**読むべき**: ACCELERATED_ROADMAP.md の「エージェントD」セクション  
**初日タスク**: 依存関係更新（4時間、Day 2-3）

### エージェント E: テスト/CI担当
**読むべき**: ACCELERATED_ROADMAP.md の「エージェントE」セクション  
**初日タスク**: TypeScript基盤（2時間）

---

## 📊 プロジェクト現状（要約）

| 指標 | 現状 | 目標（2週間後） |
|------|------|----------------|
| セキュリティ | ⚠️ 65/100 | ✅ 95/100 |
| パフォーマンス | 🟡 75/100 | ✅ 92/100 |
| SEO | 🟡 80/100 | ✅ 100/100 |
| アクセシビリティ | 🟡 70/100 | ✅ 96/100 |

---

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript（現在 strict: false → 目標 strict: true）
- **スタイリング**: Tailwind CSS 4.0
- **デプロイ**: GitHub Pages (静的エクスポート)

---

## ⚠️ 重要な制約

1. **画像最適化**: `unoptimized: true`（GitHub Pages制約）→ ビルド時最適化で対応
2. **TypeScript strict mode**: 現在無効 → 段階的に有効化が必要
3. **バンドルサイズ**: 102KB → 78KB 以下が目標

---

## 💡 作業の進め方

1. **自分の担当セクション**を ACCELERATED_ROADMAP.md で確認
2. **Day 1 のタスク**から開始
3. **完了したらチェックボックスにチェック**を入れる
4. **コミット**して次のタスクへ
5. **1日の終わりに進捗を共有**

---

## 🔗 リンク

- **詳細ロードマップ**: [`ACCELERATED_ROADMAP.md`](./ACCELERATED_ROADMAP.md)
- **ドキュメント一覧**: [`README.md`](./README.md)
- **分析サマリー**: [`ANALYSIS_SUMMARY.md`](./ANALYSIS_SUMMARY.md)

---

**次のアクション**: `ACCELERATED_ROADMAP.md` を開いて、あなたの担当タスクを確認してください。
