# 🏗️ リポジトリ整備計画 - 大改造への下準備

**作成日**: 2025年12月22日  
**目的**: リポジトリを整理し、どのエージェントも同じルール・同じルートで作業できる状態にする

---

## 📋 現状の問題点

### 発見された問題

1. **ドキュメントの散乱** (24個のMDファイル)
   - 重複する内容
   - 古い情報
   - 優先順位が不明確

2. **コンポーネントの混在**
   - `_legacy` コンポーネントが現役で使用中
   - `modern` コンポーネントが未使用
   - `_archive` の用途が不明確

3. **進捗の過大評価**
   - Phase 1「完了」だが実装は15-20%
   - ドキュメントと実態の乖離

4. **エージェントの混乱**
   - どのドキュメントを見るべきか不明確
   - ルールが分散している

---

## 🎯 整備の目標

### 達成すべき状態

1. **ドキュメントの一元化**
   - 最優先ドキュメントを明確化
   - 古いドキュメントをアーカイブ
   - 参照順序を明示

2. **コンポーネントの整理**
   - 使用するコンポーネントを明確化
   - 削除・移動すべきファイルの特定
   - 移行計画の明確化

3. **ルールの統一**
   - 全エージェント共通のルール定義
   - 作業フローの標準化
   - チェックリストの統一

4. **現実的な進捗管理**
   - 実態に即した進捗記載
   - 「完了」の基準を明確化
   - 手戻りの可視化

---

## 📊 整備計画（5ステップ）

### Step 1: ドキュメント整理

#### 1.1 最優先ドキュメントの定義

**必読ドキュメント（3つのみ）**:
1. `docs/START_HERE.md` - 全エージェントの開始点
2. `docs/CURRENT_STATE.md` - 現在の状態（実態ベース）
3. `docs/REPOSITORY_GUIDE.md` - リポジトリ構造と作業ルール（新規作成）

**アーカイブ対象**:
- 古いレポート類（REPOSITORY_ANALYSIS_REPORT.md等）
- 重複するガイド（AGENT_MASTER_GUIDE.md等）
- 分析レポート（ROOT_CAUSE_ANALYSIS.md等）

#### 1.2 ドキュメント階層

```
docs/
├── START_HERE.md          ← 最優先（必読）
├── CURRENT_STATE.md       ← 現状確認（必読）
├── REPOSITORY_GUIDE.md    ← 作業ルール（必読・新規）
├── SECURITY_REQUIREMENTS.md
├── UI_REDESIGN_URGENT.md
└── archive/               ← 参考資料
    ├── analysis/          ← 分析レポート
    ├── guides/            ← 旧ガイド
    └── reports/           ← 調査結果
```

### Step 2: コンポーネント整理

#### 2.1 現状の確認

**現在使用中**:
- `app/components/_legacy/` - 実際に使用されている
- `app/components/modern/` - 作成済みだが未使用

**整理方針**:
1. `_legacy` → 当面はそのまま（Phase 2で順次移行）
2. `modern` → Phase 2の実装対象として明確化
3. `_archive` → 削除または docs/archive へ移動

#### 2.2 コンポーネント移行計画

```markdown
Phase 2: コンポーネント移行（優先順位順）

1. Navigation
   - _legacy/navigation/Header.tsx → modern/Navigation/PremiumNav.tsx

2. Hero
   - _legacy/home/FullscreenHero.tsx → modern/Hero/OceanViewHero.tsx
   - _legacy/home/CinematicHero.tsx → modern/Hero/OceanViewHero.tsx

3. Cards
   - _legacy/home/RecommendedOnsen.tsx → modern/Cards/PremiumCard.tsx 使用
   - _legacy/home/OnsenList.tsx → modern/Cards/PremiumCard.tsx 使用

4. Sections（新規作成必要）
   - _legacy/home/SplitFeature.tsx → modern/Sections/SplitSection.tsx
   - _legacy/home/GridGallery.tsx → modern/Sections/GridSection.tsx

5. Footer
   - _legacy/layouts/Footer.tsx → modern/Footer/PremiumFooter.tsx（新規作成）
```

### Step 3: ルールの統一

#### 3.1 共通ルールファイルの作成

**`.github/AGENT_RULES.md`** (新規作成):
- 全エージェント共通のルール
- 作業フローの標準化
- チェックリストテンプレート
- 完了基準の定義

#### 3.2 タスク定義テンプレート

```markdown
## タスクテンプレート

### タスク名: [具体的な機能名]

**目的**: [何を達成するか]

**完了条件**:
- [ ] コード作成
- [ ] インポート・統合
- [ ] ビルド成功（`npm run build`）
- [ ] ローカル確認（`npm run dev`）
- [ ] スクリーンショット添付
- [ ] デプロイ確認

**根拠**:
- コミット: [ハッシュ]
- スクリーンショット: [URL]
- 確認日時: [日時]
```

### Step 4: 現実的な進捗管理

#### 4.1 CURRENT_STATE.md の修正

**修正方針**:
- 楽観的な「完了」を削除
- 実態ベースの進捗に修正
- 手戻りタスクを明示

**現在の状態（修正後）**:
```markdown
### UI/UX完全再設計

#### Phase 1: 基盤構築（部分完了）
- [x] カラーパレット設計
- [x] グローバルスタイル更新
- [x] プレミアムコンポーネント作成（ファイルのみ）
- [ ] プレミアムコンポーネントの実装（未着手）

**進捗率**: 50%（作成のみ完了、実装は未完了）

#### Phase 2: ページ実装（未着手）
- [ ] app/page.tsx の書き換え
- [ ] ナビゲーションの置き換え
- [ ] Heroセクションの置き換え
- [ ] セクションコンポーネントの作成・配置
- [ ] フッターの作成・配置

**進捗率**: 0%

#### 実質的な大改造進捗率: 約15-20%
```

### Step 5: 検証システムの構築

#### 5.1 自動検証スクリプト

**`scripts/verify-repository-state.sh`** (新規作成):
```bash
#!/bin/bash
echo "🔍 リポジトリ状態検証"
echo ""

# 1. ビルドチェック
echo "📦 ビルドチェック..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ ビルド成功"
else
  echo "❌ ビルド失敗"
fi

# 2. 新コンポーネント使用状況
echo ""
echo "🔎 新コンポーネント使用状況..."
if grep -r "from './components/modern" app/page.tsx > /dev/null 2>&1; then
  echo "✅ 新コンポーネントが使用されています"
else
  echo "⚠️  新コンポーネントが使用されていません"
fi

# 3. レガシーコンポーネント残存確認
echo ""
echo "🔎 レガシーコンポーネント残存確認..."
legacy_count=$(grep -r "from './components/_legacy" app/page.tsx | wc -l)
echo "⚠️  レガシーコンポーネント: ${legacy_count}個"

# 4. ドキュメント整合性
echo ""
echo "📄 ドキュメント整合性..."
if [ -f "docs/REPOSITORY_GUIDE.md" ]; then
  echo "✅ REPOSITORY_GUIDE.md 存在"
else
  echo "❌ REPOSITORY_GUIDE.md 未作成"
fi

echo ""
echo "検証完了"
```

---

## 📝 実装計画（優先順位順）

### 最優先: ドキュメント整備

1. **`docs/REPOSITORY_GUIDE.md` 作成**
   - リポジトリ構造の説明
   - 作業ルールの明確化
   - コンポーネント使用ガイド
   - タスク定義テンプレート

2. **`docs/START_HERE.md` 更新**
   - 最新の参照先に更新
   - 3つの必読ドキュメントを明示

3. **`docs/CURRENT_STATE.md` 修正**
   - 楽観的な記載を修正
   - 実態ベースの進捗に変更
   - 手戻りタスクを明示

4. **古いドキュメントのアーカイブ**
   - `docs/archive/` ディレクトリ作成
   - 分析レポート類を移動
   - README で参照順序を明示

### 次に優先: ルール統一

1. **`.github/AGENT_RULES.md` 作成**
   - 全エージェント共通ルール
   - タスク定義テンプレート
   - 完了基準

2. **`.github/copilot-instructions.md` 更新**
   - REPOSITORY_GUIDE.md への参照追加
   - AGENT_RULES.md への参照追加

### 最後: 検証システム

1. **`scripts/verify-repository-state.sh` 作成**
   - 自動検証スクリプト

2. **`.github/workflows/verify-state.yml` 作成**
   - CI/CDでの自動検証

---

## ✅ 完了基準

### この整備が完了した状態

1. **ドキュメント**
   - 必読ドキュメントが3つに絞られている
   - 古いドキュメントがアーカイブされている
   - 参照順序が明確

2. **コンポーネント**
   - 使用するコンポーネントが明確
   - 移行計画が文書化されている
   - Phase 2の作業内容が具体的

3. **ルール**
   - 全エージェント共通のルールが定義されている
   - タスク定義テンプレートが整備されている
   - 完了基準が明確

4. **進捗管理**
   - 実態ベースの進捗記載
   - 手戻りタスクが可視化されている
   - 過大評価が修正されている

5. **検証**
   - 自動検証スクリプトが動作する
   - リポジトリの状態が客観的に確認できる

---

**計画作成日**: 2025年12月22日  
**実装開始**: この計画承認後
**推定所要時間**: 2-3時間
