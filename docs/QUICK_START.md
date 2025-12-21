# ⚡ クイックスタート - エージェント向け

> **最速で作業開始するための3ステップガイド**

---

## 📍 あなたは今ここ

```
リポジトリをクローン ✅
  ↓
このファイルを読んでいる ← 📍 今ここ
  ↓
3ステップで作業開始
  ↓
タスク実行 🚀
```

---

## 🚀 3ステップで作業開始

### Step 1: 現状を知る（3分）⭐

**[`CURRENT_STATE.md`](./CURRENT_STATE.md)** を開いて以下を確認：

- ✅ **完了済み**: Next.js 16.0.10、noImplicitAny、エラーページ
- 🔄 **進行中**: TypeScript Strict Mode（70%）、画像最適化（0%）
- 📋 **未着手**: UI/UX緊急対応、バンドルサイズ削減、SEO実装
- 🎯 **次のアクション**: 3つのオプションから選択

**→ これで「何をすべきか」が明確になります**

---

### Step 2: 方法を知る（5分）

**[`AGENT_MASTER_GUIDE.md`](./AGENT_MASTER_GUIDE.md)** を開いて以下を確認：

- 🤖 エージェント別の役割（A: 画像、B: UI/UX、C: TypeScript、D: SEO）
- 📝 初日タスク（具体的な作業内容）
- 🔧 API設定（Wikimedia Commons、sharp）
- 🔒 セキュリティ要件（npm audit、バージョン確認）
- 📋 作業フロー（環境準備 → 実装 → テスト → コミット）

**→ これで「どうやるか」が明確になります**

---

### Step 3: 作業開始！🎯

#### 環境チェック
```bash
# セキュリティ確認（必須）
npm audit
# 期待結果: found 0 vulnerabilities ✅

# バージョン確認（必須）
npm list next eslint
# Next.js: 16.0.10+ ✅
# ESLint: 9.39.2+ ✅
```

#### 環境準備
```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

#### タスク選択
`CURRENT_STATE.md` の「推奨される次のアクション」から選択：

- **オプション1**: 技術的負債完了（堅実、4-6日）
- **オプション2**: UI/UX緊急対応（ビジュアル、2-3日）
- **オプション3**: 並行実施（複数エージェント、3日）

#### 作業開始
選択したタスクの初日タスクを `AGENT_MASTER_GUIDE.md` で確認して開始！

---

## 📊 作業フロー（標準）

```
1. タスク選択
   ↓
2. 該当ファイルを編集
   ↓
3. テスト実行
   npm run test:images
   npm run build
   ↓
4. コミット（日本語で）
   git add .
   git commit -m "feat: ○○機能を追加"
   ↓
5. 次のタスクへ
```

---

## 🎯 タスク別クイックリンク

### UI/UX を改善したい
→ [`UI_REDESIGN_URGENT.md`](./UI_REDESIGN_URGENT.md)

### TypeScript を完全にしたい
→ [`ACCELERATED_ROADMAP.md`](./ACCELERATED_ROADMAP.md) の Phase 2

### 画像を最適化したい
→ [`IMAGE_OPTIMIZATION_GUIDE.md`](./IMAGE_OPTIMIZATION_GUIDE.md)

### SEO を実装したい
→ [`ACCELERATED_ROADMAP.md`](./ACCELERATED_ROADMAP.md) の Phase 3

### セキュリティを確認したい
→ [`SECURITY_REQUIREMENTS.md`](./SECURITY_REQUIREMENTS.md)

---

## ⚠️ よくある間違い

### ❌ 間違い1: 削除済みファイルを読もうとする
以下のファイルは **存在しません**：
- `ANALYSIS_SUMMARY.md`
- `PHASE_TRANSITION_REPORT.md`
- `IMPLEMENTATION_PLAN_V3.md`
- `REQUIREMENTS.md`
- `RULES.md`

→ 代わりに `CURRENT_STATE.md` を読んでください

### ❌ 間違い2: どのドキュメントを読むか迷う
→ **`CURRENT_STATE.md` だけ** 読めば十分です

### ❌ 間違い3: 作業フローが分からない
→ このファイルの「3ステップで作業開始」を見てください

---

## 💡 時間がない場合

### 超特急（1分）
```bash
# 1. セキュリティ確認
npm audit

# 2. ビルド確認
SKIP_CHECK=true npm run build

# 3. 問題なければ作業開始
```

### 標準（8分）
1. `CURRENT_STATE.md` 読む（3分）
2. `AGENT_MASTER_GUIDE.md` 読む（5分）
3. 作業開始

### じっくり（18分）
1. `CURRENT_STATE.md` 読む（3分）
2. `AGENT_MASTER_GUIDE.md` 読む（5分）
3. `ACCELERATED_ROADMAP.md` 読む（10分）
4. 作業開始

---

## 📞 困ったら

### 問題: タスクが分からない
→ **解決**: `CURRENT_STATE.md` の「推奨される次のアクション」を見る

### 問題: 方法が分からない
→ **解決**: `AGENT_MASTER_GUIDE.md` の「初日タスク」を見る

### 問題: エラーが出る
→ **解決**: 
1. `npm audit` でセキュリティ確認
2. `npm list next eslint` でバージョン確認
3. `SKIP_CHECK=true npm run build` でビルド確認

### 問題: ドキュメントが多すぎる
→ **解決**: **`CURRENT_STATE.md` だけ** 読めば十分です

---

## ✅ チェックリスト

作業開始前に以下を確認してください：

- [ ] `npm audit` で脆弱性0件を確認
- [ ] `CURRENT_STATE.md` を読んだ
- [ ] 次にすべきタスクを決めた
- [ ] `AGENT_MASTER_GUIDE.md` で方法を確認した
- [ ] 環境準備（npm install）完了

**すべてチェックできたら作業開始！🚀**

---

**最終更新**: 2025年12月21日  
**所要時間**: 3-8分で作業開始可能
