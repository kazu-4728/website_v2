# 📚 リポジトリガイド - 統一された作業ルール

**最終更新**: 2025年12月22日  
**対象**: すべてのAIエージェント  
**優先度**: 🔴 最優先・必読

---

## 🎯 このドキュメントの目的

**すべてのエージェントが同じルール・同じルートで作業できるようにする**

このガイドを読めば：
- どのドキュメントを参照すべきかわかる
- どのコンポーネントを使うべきかわかる
- タスクをどう定義すべきかわかる
- 「完了」の基準がわかる

---

## 📖 必読ドキュメント（この順番で読む）

### 1. START_HERE.md
- **内容**: プロジェクトの概要、開始手順
- **いつ読む**: 最初に必ず読む

### 2. CURRENT_STATE.md
- **内容**: 現在の開発状態（実態ベース）
- **いつ読む**: 作業前に現状確認

### 3. REPOSITORY_GUIDE.md（このファイル）
- **内容**: 作業ルール、コンポーネント使用ガイド
- **いつ読む**: 作業方法を確認したいとき

### 4. UI_REDESIGN_URGENT.md
- **内容**: UI再設計の詳細計画
- **いつ読む**: UI関連の作業をするとき

### 5. SECURITY_REQUIREMENTS.md
- **内容**: セキュリティ要件
- **いつ読む**: 依存関係を変更するとき

**その他のドキュメント**: `docs/archive/` に分類済み（参考資料）

---

## 🏗️ リポジトリ構造

### ディレクトリ構成

```
website_v2/
├── .github/
│   ├── copilot-instructions.md   ← GitHub Copilot Agent向け設定
│   ├── AGENT_RULES.md             ← 全エージェント共通ルール
│   └── workflows/                 ← CI/CD設定
│
├── app/
│   ├── page.tsx                   ← ホームページ
│   ├── globals.css                ← グローバルスタイル
│   ├── components/
│   │   ├── _legacy/               ← 旧コンポーネント（現在使用中）
│   │   │   ├── navigation/        ← Header等
│   │   │   ├── home/              ← Hero、Section等
│   │   │   ├── layouts/           ← Footer等
│   │   │   └── ui/                ← Button、Card等
│   │   │
│   │   └── modern/                ← 新コンポーネント（Phase 2で実装）
│   │       ├── Navigation/        ← PremiumNav
│   │       ├── Hero/              ← OceanViewHero
│   │       ├── Cards/             ← PremiumCard
│   │       ├── Sections/          ← 作成予定
│   │       └── Footer/            ← 作成予定
│   │
│   └── lib/                       ← ユーティリティ、型定義
│
├── docs/
│   ├── START_HERE.md              ← 必読1
│   ├── CURRENT_STATE.md           ← 必読2
│   ├── REPOSITORY_GUIDE.md        ← 必読3（このファイル）
│   ├── UI_REDESIGN_URGENT.md      ← UI再設計詳細
│   ├── SECURITY_REQUIREMENTS.md   ← セキュリティ要件
│   │
│   └── archive/                   ← 参考資料
│       ├── analysis/              ← 分析レポート
│       ├── guides/                ← 旧ガイド
│       └── reports/               ← 調査結果
│
├── themes/
│   └── onsen-kanto/
│       ├── content.json           ← コンテンツ設定
│       └── texts.json             ← UIテキスト
│
└── scripts/
    └── verify-repository-state.sh ← 状態検証スクリプト
```

---

## 🧩 コンポーネント使用ガイド

### 現在の状況（Phase 1完了、Phase 2準備中）

#### 使用中のコンポーネント（`_legacy`）

**現在、`app/page.tsx` で実際に使用されているコンポーネント**:

```tsx
// ナビゲーション - 使用中
import { Header } from './components/_legacy/navigation/Header';

// Hero - 使用中
import { FullscreenHero } from './components/_legacy/home/FullscreenHero';
import { CinematicHero } from './components/_legacy/home/CinematicHero';

// セクション - 使用中
import { SplitFeature } from './components/_legacy/home/SplitFeature';
import { GridGallery } from './components/_legacy/home/GridGallery';
import { Testimonials } from './components/_legacy/home/Testimonials';
import { Steps } from './components/_legacy/home/Steps';
import { AreaSelection } from './components/_legacy/home/AreaSelection';
import { RecommendedOnsen } from './components/_legacy/home/RecommendedOnsen';
import { OnsenList } from './components/_legacy/home/OnsenList';
import { CtaFullscreen } from './components/_legacy/home/CtaFullscreen';

// フッター - 使用中
import { Footer } from './components/_legacy/layouts/Footer';
```

**ルール**: **Phase 2まで、これらのコンポーネントは変更しない**

#### 作成済みの新コンポーネント（`modern`）

**Phase 1で作成されたが、まだ使用されていないコンポーネント**:

```tsx
// ナビゲーション - 作成済み、未使用
import { PremiumNav } from './components/modern/Navigation/PremiumNav';

// Hero - 作成済み、未使用
import { OceanViewHero } from './components/modern/Hero/OceanViewHero';

// カード - 作成済み、未使用
import { PremiumCard } from './components/modern/Cards/PremiumCard';
```

**ルール**: **Phase 2で、これらのコンポーネントを実装する**

#### Phase 2で作成が必要なコンポーネント

```tsx
// セクション - 未作成
import { SplitSection } from './components/modern/Sections/SplitSection';
import { GridSection } from './components/modern/Sections/GridSection';

// フッター - 未作成
import { PremiumFooter } from './components/modern/Footer/PremiumFooter';
```

**ルール**: **Phase 2の初めに、これらのコンポーネントを作成する**

---

## 📋 作業ルール

### ルール1: タスク定義を明確にする

**悪い例**:
```markdown
- [ ] ホームページを新しくする
```

**良い例**:
```markdown
### タスク: ホームページのHeroセクションをOceanViewHeroに置き換え

**目的**: ユーザーが見るホームページのHeroを新デザインにする

**完了条件**:
- [ ] app/page.tsx の import を変更
- [ ] FullscreenHero/CinematicHero を OceanViewHero に置き換え
- [ ] ビルド成功（`npm run build`）
- [ ] ローカル確認（`npm run dev`）
- [ ] スクリーンショット添付（Before/After）
- [ ] デプロイ確認（GitHub Pages）

**根拠**:
- コミット: [コミット後に記入]
- スクリーンショット: [添付]
- 確認日時: [記入]

**進捗**: 未着手
```

### ルール2: 4段階チェックリストを使用する

すべてのタスクは、4段階で完了させる：

#### 🟦 レベル1: コード作成
- [ ] ファイル作成
- [ ] 構文チェック（ESLint）
- [ ] 型チェック（TypeScript）
- [ ] コミット

#### 🟨 レベル2: 統合
- [ ] ページファイルへのインポート
- [ ] 既存コンポーネントの置き換え
- [ ] ビルド成功（`npm run build`）
- [ ] コミット

#### 🟩 レベル3: 動作確認（必須）
- [ ] ローカル起動（`npm run dev`）
- [ ] ブラウザで表示確認
- [ ] スクリーンショット撮影・添付
- [ ] 期待通りの表示を確認
- [ ] コミット

#### 🟪 レベル4: デプロイ
- [ ] 静的エクスポート成功
- [ ] GitHub Pages デプロイ
- [ ] 本番環境で表示確認
- [ ] URL記録

**重要**: **レベル3まで完了して初めて「完了」とする**

### ルール3: スクリーンショットを必須化する

**視覚的な変更を伴うタスクは、スクリーンショット必須**

```markdown
### タスク: Heroセクションの置き換え

**Before**:
![旧Hero](./screenshots/before-hero-20251222.png)
- FullscreenHero/CinematicHero を使用
- ダーク基調

**After**:
![新Hero](./screenshots/after-hero-20251222.png)
- OceanViewHero を使用
- Ocean & Sky カラーパレット
- パララックス効果

**確認日時**: 2025-12-22 15:00 UTC
**確認環境**: ローカル開発サーバー（localhost:3000）
```

### ルール4: ドキュメントと実装を同期させる

**間違い**:
1. ドキュメントに「完了」と記載
2. 実装は未完了

**正しい**:
1. 実装を完了させる
2. ブラウザで確認する
3. スクリーンショットを撮る
4. すべて完了後にドキュメントにチェックマーク

### ルール5: 「完了」の基準を守る

**「完了」の定義**:

| 段階 | 条件 | 完了? |
|------|------|------|
| ファイル作成 | .tsxファイルが存在 | ❌ 未完了 |
| インポート | ページファイルにインポート | ❌ 未完了 |
| ビルド成功 | `npm run build` 成功 | ❌ 未完了 |
| ローカル確認 | `npm run dev` で表示確認 | ✅ 完了 |
| スクリーンショット | Before/After 添付 | ✅ 完了 |

**「ファイル作成」≠「完了」**

---

## 🔄 Phase 2 実装ガイド

### Phase 2の目的

**「ユーザーが見るサイトを新デザインに変更する」**

### 実装順序（優先順位順）

#### 1. セクションコンポーネントの作成

**必要なコンポーネント**:
1. `SplitSection.tsx` - 左右レイアウト
2. `GridSection.tsx` - 3カラムグリッド
3. `PremiumFooter.tsx` - フッター

**作業内容**:
- 3つのファイルを作成
- PremiumCard を活用
- レスポンシブ対応

#### 2. ホームページの書き換え

**`app/page.tsx` の修正**:

```tsx
// Before (現在)
import { FullscreenHero } from './components/_legacy/home/FullscreenHero';

// After (Phase 2)
import { OceanViewHero } from './components/modern/Hero/OceanViewHero';
```

**置き換え対象**:
1. Header → PremiumNav
2. FullscreenHero/CinematicHero → OceanViewHero
3. SplitFeature → SplitSection
4. GridGallery → GridSection
5. 各種カード表示 → PremiumCard 使用
6. Footer → PremiumFooter

#### 3. 動作確認

**各置き換え後に必ず実行**:
1. `npm run build` でビルド確認
2. `npm run dev` で表示確認
3. スクリーンショット撮影
4. コミット

---

## 🚫 やってはいけないこと

### NG 1: ファイル作成だけで「完了」と判断
```markdown
❌ - [x] PremiumNav 作成（完了）
```

### NG 2: ドキュメントを先行させる
```markdown
❌ Phase 1 完了！（実装は未完了）
```

### NG 3: 動作確認をスキップ
```markdown
❌ ビルドが通ったから「完了」
```

### NG 4: スクリーンショットなしで報告
```markdown
❌ 「新デザインに変更しました」（証拠なし）
```

### NG 5: レガシーコンポーネントを削除
```markdown
❌ _legacy フォルダを削除（まだ使用中！）
```

---

## ✅ 検証方法

### 自動検証スクリプト

```bash
# リポジトリの状態を確認
bash scripts/verify-repository-state.sh

# 出力例:
# 🔍 リポジトリ状態検証
# 
# ✅ ビルド成功
# ⚠️  新コンポーネントが使用されていません
# ⚠️  レガシーコンポーネント: 10個
# ✅ REPOSITORY_GUIDE.md 存在
```

### 手動確認

```bash
# 1. ビルド確認
npm run build

# 2. ローカル確認
npm run dev
# ブラウザで http://localhost:3000 を開く

# 3. コンポーネント使用確認
grep -r "from './components/modern" app/page.tsx

# 4. レガシー残存確認
grep -r "from './components/_legacy" app/page.tsx
```

---

## 📞 困ったときは

### Q1: どのドキュメントを見ればいいかわからない

**A**: この順番で読む
1. START_HERE.md
2. CURRENT_STATE.md
3. REPOSITORY_GUIDE.md（このファイル）

### Q2: コンポーネントはどれを使えばいい？

**A**: Phase 2まで `_legacy` を使う。Phase 2で `modern` に移行。

### Q3: 「完了」の基準がわからない

**A**: レベル3（ローカル確認・スクリーンショット）まで完了して「完了」

### Q4: Phase 2はいつ開始？

**A**: このリポジトリ整備が完了してから開始

### Q5: タスクの書き方がわからない

**A**: このガイドの「タスク定義テンプレート」を使う

---

## 🎯 まとめ

### すべてのエージェントへ

1. **必読ドキュメントは3つ**（START_HERE、CURRENT_STATE、REPOSITORY_GUIDE）
2. **コンポーネントはPhase 2まで `_legacy` を使う**
3. **タスク定義は明確に**（完了条件を具体的に）
4. **4段階チェックリスト**（レベル3まで完了して「完了」）
5. **スクリーンショット必須**（視覚的な変更には証拠を）

### Phase 2開始の合図

**「Phase 2を開始してください」と明示的に指示があるまで、Phase 2は開始しない**

---

**ガイド作成日**: 2025年12月22日  
**最終更新**: 2025年12月22日  
**次回更新**: Phase 2開始時
