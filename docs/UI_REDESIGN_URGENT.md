# 🎨 完全再設計: Ocean & Sky - ベンチマークサイト風UI実装

**更新日**: 2025年12月21日  
**優先度**: 🔴 **最優先・進行中**  
**ステータス**: Phase 1 完了、Phase 2 進行中  
**言語**: 🇯🇵 すべての対応は日本語で行ってください

---

## 🎯 完全再設計の方針

### 既存サイトを完全に破棄
- ❌ `_legacy` コンポーネントは使用しない
- ❌ 過去のデザインは引き継がない
- ✅ **完全にゼロから設計し直す**
- ✅ ベンチマークサイト（「あえの風」）レベルを目指す

---

## 🌊 デザインコンセプト

### 「Ocean & Sky - 海と空の温泉紀行」

**変更理由**: 「あえの風」はオーシャンビューが特徴

- 🌊 **オーシャンブルー** (#1e40af): 信頼感・清潔感
- ☁️ **スカイブルー** (#38bdf8): 爽やかさ・開放感
- 🌅 **サンセットゴールド** (#fbbf24): 温かみ・高級感
- ⛅ **クラウドホワイト** (#f8fafc): 純粋・上質

---

## ✅ Phase 1 完了: 基盤構築

### 1. カラーパレット完全刷新（3回目）
**Dark & Neon → Warm & Natural → Ocean & Sky**

```css
/* 最新（Ocean & Sky） */
--color-ocean-blue: #1e40af (メインカラー)
--color-sky-blue: #38bdf8 (アクセント)
--color-gold: #fbbf24 (ボタン・強調)
--color-cloud-white: #f8fafc (背景)
```

### 2. グローバルスタイル完全刷新
**app/globals.css**:
- body背景: 空から雲へのグラデーション
- タイポグラフィ: Noto Serif JP（明朝体）+ Noto Sans JP
- 新しいボタン: `.btn-premium`, `.btn-accent`
- 新しいテキストグラデーション: `.text-gradient-ocean`, `.text-gradient-gold`

### 3. 完全新規プレミアムコンポーネント作成

**app/components/modern/** ディレクトリを新設

#### PremiumNav (`Navigation/PremiumNav.tsx`)
- 固定ヘッダー（sticky top-0）
- ガラスモーフィズム（backdrop-blur-xl）
- スクロール連動で背景透明度変化
- モバイル対応ハンバーガーメニュー
- 予約ボタンは金色で目立つ

#### OceanViewHero (`Hero/OceanViewHero.tsx`)
- 画面全体（100vh）を覆う背景画像
- パララックス効果（背景がゆっくり動く）
- 超大型タイトル（text-9xl）
- 下に波のSVGアニメーション
- スクロールインジケーター

#### PremiumCard (`Cards/PremiumCard.tsx`)
- 高さ 600px〜800px（超大型）
- 画像が全面、テキストは下部
- ホバー時に画像がズーム（scale: 1.1）
- 金色のボーダーがホバー時に表示
- カテゴリバッジ付き

### 4. 新しいアニメーション
- `fadeIn`: シンプルなフェードイン
- `scaleIn`: ズームしながら表示
- `slideIn`: 横からスライド
- `wave`: 波のような動き
- 遅延クラス拡張（delay-100〜1000）

---

## 🔄 Phase 2 進行中: コンテンツセクション実装

### 実施予定タスク

#### SplitSection（左右レイアウト）
- [ ] `app/components/modern/Sections/SplitSection.tsx` 作成
- [ ] 左に画像、右にテキスト（またはその逆）
- [ ] 画像とテキストが50:50
- [ ] レスポンシブ対応

#### GridSection（3カラムグリッド）
- [ ] `app/components/modern/Sections/GridSection.tsx` 作成
- [ ] PremiumCard を使用したグリッドレイアウト
- [ ] 1列（モバイル） → 2列（タブレット） → 3列（デスクトップ）

#### PremiumFooter
- [ ] `app/components/modern/Footer/PremiumFooter.tsx` 作成
- [ ] 4カラムレイアウト（ロゴ、ナビゲーション、リンク、SNS）
- [ ] ニュースレター登録フォーム

#### 既存ページの完全置き換え
- [ ] `app/page.tsx` を新コンポーネントで再構築
- [ ] その他のページも順次対応

---

## 📋 Phase 3 予定: 画像収集と差し替え

### 実施予定タスク
- [ ] `scripts/fetch-premium-images.js` を実行
- [ ] Unsplash/Pexels/Wikimedia から高品質画像を収集
- [ ] 青と白基調の画像に統一
- [ ] `themes/onsen-kanto/content.json` の画像URLを更新
- [ ] 実際の温泉風景画像に差し替え

---

## 📋 Phase 4 予定: 最終調整

### 実施予定タスク
- [ ] パフォーマンステスト
- [ ] モバイル最適化
- [ ] アクセシビリティ確認
- [ ] クロスブラウザ検証
- [ ] 最終ビジュアル確認

---

## 🏗️ 新しいファイル構造

```
app/
├── components/
│   ├── modern/              ← 完全新規（ベンチマーク風）
│   │   ├── Navigation/
│   │   │   └── PremiumNav.tsx ✅
│   │   ├── Hero/
│   │   │   └── OceanViewHero.tsx ✅
│   │   ├── Cards/
│   │   │   └── PremiumCard.tsx ✅
│   │   ├── Sections/        ← Phase 2
│   │   │   ├── SplitSection.tsx
│   │   │   ├── GridSection.tsx
│   │   │   └── FullWidthSection.tsx
│   │   └── Footer/          ← Phase 2
│   │       └── PremiumFooter.tsx
│   └── _legacy/             ← 使わない
└── globals.css              ← 完全刷新済み ✅
```

---

## 🎬 アニメーション仕様

### Hero エントランス
```tsx
// 画像: ゆっくりズームアウト
initial: { scale: 1.1 }
animate: { scale: 1 }
transition: { duration: 1.5, ease: "easeOut" }

// タイトル: フェードイン + 上昇
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.8, delay: 0.3 }
```

### カードホバー
```tsx
whileHover={{ 
  scale: 1.08,
  y: -12,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
}}
transition={{ duration: 0.3, ease: "easeOut" }}
```

### スクロール連動
```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
```

---

## 🧪 検証結果（Phase 1）

- ✅ TypeScript型チェック: エラー0件
- ✅ ビルド: 33ページ生成成功
- ✅ npm audit: 0 vulnerabilities
- ✅ 3つの完全新規プレミアムコンポーネント作成
- ✅ カラーパレット完全刷新（Ocean & Sky）

---

## 📊 進捗管理

### 全体進捗
- ✅ Phase 1: 基盤構築（完了）
- 🔄 Phase 2: コンテンツセクション実装（進行中 0%）
- ⏳ Phase 3: 画像収集と差し替え（未着手）
- ⏳ Phase 4: 最終調整（未着手）

### チェックリスト

#### Phase 1: 基盤構築
- [x] カラーパレット完全刷新（Ocean & Sky）
- [x] グローバルスタイル完全刷新
- [x] PremiumNav 作成
- [x] OceanViewHero 作成
- [x] PremiumCard 作成
- [x] 新しいアニメーション実装
- [x] ビルド検証

#### Phase 2: コンテンツセクション
- [ ] SplitSection 作成
- [ ] GridSection 作成
- [ ] PremiumFooter 作成
- [ ] app/page.tsx を新コンポーネントで再構築
- [ ] ビルド検証
- [ ] スクリーンショット撮影

#### Phase 3: 画像収集
- [ ] 画像収集スクリプト実行
- [ ] content.json 更新
- [ ] 画像差し替え検証

#### Phase 4: 最終調整
- [ ] パフォーマンステスト
- [ ] モバイル最適化
- [ ] アクセシビリティ確認
- [ ] 最終ビジュアル確認

---

## ⚡ 次のアクション

### Phase 2 の開始手順

1. **SplitSection コンポーネントを作成**
   ```bash
   # ファイル作成
   touch app/components/modern/Sections/SplitSection.tsx
   ```

2. **GridSection コンポーネントを作成**
   ```bash
   # ファイル作成
   touch app/components/modern/Sections/GridSection.tsx
   ```

3. **PremiumFooter コンポーネントを作成**
   ```bash
   # ファイル作成
   touch app/components/modern/Footer/PremiumFooter.tsx
   ```

4. **app/page.tsx を新コンポーネントで再構築**
   - 既存の `_legacy` コンポーネントを削除
   - 新しい `modern` コンポーネントに置き換え

5. **ビルド検証**
   ```bash
   SKIP_CHECK=true npm run build
   ```

---

**担当エージェント**: すべてのエージェント対応可能  
**言語**: すべての対応・コメント・コミットメッセージは日本語で行ってください。

---

**最終更新**: 2025年12月21日  
**次回更新**: Phase 2 完了時

### 既存コンポーネントが変更されていない
- `app/components/_legacy/` 内のコンポーネントがそのまま使用されている
- ベンチマークサイト（「あえの風」）レベルのUIに到達していない
- 視覚的インパクトが不足している

### 具体的な課題
1. **Hero コンポーネント**: 画面全体を使い切れていない
2. **カードコンポーネント**: 高さが h-80 (320px) 程度と小さい
3. **画像使用**: 控えめで大胆さに欠ける
4. **アニメーション**: 基本的なホバーエフェクトのみ
5. **タイポグラフィ**: 見出しサイズが小さい

---

## 🎯 目標

### 「あえの風」レベルのビジュアルクオリティ達成

**参考サイト**: [あえの風](https://www.aenokaze.com/)

**達成基準**:
- ✅ Hero が画面全体（100vh）を使用
- ✅ カードの高さが h-96 (384px) 以上
- ✅ 大胆な画像使用（画面幅いっぱい）
- ✅ 洗練されたホバーエフェクト
- ✅ 大きなタイポグラフィ（見出し: text-5xl 以上）
- ✅ シネマティックなアニメーション

---

## 👤 推奨担当エージェント

### エージェントB: UI/UX担当 🎨 **（推奨）**

**理由**:
- ビジュアルデザインの専門性
- Framer Motion の知識
- Tailwind CSS の深い理解
- ベンチマークサイト分析の経験

**代替案**:
- 新規エージェント「エージェントE: デザインリニューアル専任」を立ち上げることも可能

---

## 📋 実施タスク（優先度順）

### Phase 1: Hero セクションの完全刷新 🔴 **（最優先）**

**対象ファイル**: 
- `app/components/_legacy/home/CinematicHero.tsx`
- `app/components/_legacy/home/FullscreenHero.tsx`

**必要な変更**:

1. **画面サイズの拡大**
```tsx
// Before
<section className="relative h-screen min-h-[600px]">

// After
<section className="relative h-screen w-full">
```

2. **タイポグラフィの強化**
```tsx
// Before
<h1 className="text-4xl md:text-6xl">

// After
<h1 className="text-6xl md:text-8xl lg:text-9xl">
```

3. **オーバーレイの洗練**
```tsx
// Before
className="absolute inset-0 bg-black/50"

// After
className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"
```

4. **パララックス効果の追加**
```tsx
// Framer Motion を使用
<motion.div
  initial={{ scale: 1.1 }}
  animate={{ scale: 1 }}
  transition={{ duration: 1.5, ease: "easeOut" }}
>
```

**期待される成果**:
- 画面全体を使った迫力のあるHero
- ユーザーを惹きつける第一印象
- 「あえの風」レベルのビジュアルインパクト

---

### Phase 2: カードコンポーネントの大胆化 🟡 **（高優先度）**

**対象ファイル**:
- `app/components/_legacy/home/GridGallery.tsx`
- `app/components/_legacy/home/AreaSelection.tsx`
- `app/components/_legacy/home/RecommendedOnsen.tsx`

**必要な変更**:

1. **カード高さの増加**
```tsx
// Before
<div className="h-80"> {/* 320px */}

// After
<div className="h-[500px] md:h-[600px]">
```

2. **ホバーエフェクトの強化**
```tsx
// Before
whileHover={{ scale: 1.05 }}

// After
whileHover={{ 
  scale: 1.08,
  y: -12,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
}}
transition={{ duration: 0.3, ease: "easeOut" }}
```

3. **セクション間余白の拡大**
```tsx
// Before
<section className="py-20">

// After
<section className="py-32 md:py-40">
```

4. **画像ズーム効果の追加**
```tsx
// 画像に対して
className="group-hover:scale-110 transition-transform duration-700 ease-out"
```

**期待される成果**:
- 画像が主役のレイアウト
- スクロール時の視覚的楽しさ
- 温泉の魅力が伝わるビジュアル

---

### Phase 3: タイポグラフィとスペーシングの改善 🟢 **（中優先度）**

**対象**: 全ページのセクションタイトル

**必要な変更**:

1. **セクションタイトルの拡大**
```tsx
// Before
<h2 className="text-4xl">

// After
<h2 className="text-5xl md:text-6xl lg:text-7xl">
```

2. **行間とトラッキングの最適化**
```tsx
className="leading-tight tracking-tight"
```

3. **段階的アニメーションの追加**
```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
```

**期待される成果**:
- 読みやすく、視覚的に印象的なタイポグラフィ
- セクション間の明確な階層構造
- プロフェッショナルな印象

---

## 🔧 技術要件

### 使用技術
- **フレームワーク**: Next.js 16
- **スタイリング**: Tailwind CSS 4.0
- **アニメーション**: Framer Motion 12
- **言語**: TypeScript (noImplicitAny: true)

### 設計原則
- **JSON First**: `content.json` からデータを取得
- **型安全性**: 明示的な型注釈
- **レスポンシブ**: モバイルファーストのアプローチ
- **パフォーマンス**: 60fps のスムーズなアニメーション

---

## 📊 進捗管理

### チェックリスト

#### Phase 1: Hero セクション
- [ ] `CinematicHero.tsx` - 画面サイズ拡大
- [ ] `CinematicHero.tsx` - タイポグラフィ強化
- [ ] `CinematicHero.tsx` - オーバーレイ改善
- [ ] `CinematicHero.tsx` - パララックス効果追加
- [ ] `FullscreenHero.tsx` - 同様の改善適用
- [ ] ビルド検証
- [ ] ビジュアル確認（スクリーンショット）

#### Phase 2: カードコンポーネント
- [ ] `GridGallery.tsx` - カード高さ増加
- [ ] `GridGallery.tsx` - ホバーエフェクト強化
- [ ] `AreaSelection.tsx` - 同様の改善適用
- [ ] `RecommendedOnsen.tsx` - 同様の改善適用
- [ ] セクション間余白拡大
- [ ] 画像ズーム効果追加
- [ ] ビルド検証
- [ ] ビジュアル確認（スクリーンショット）

#### Phase 3: タイポグラフィ
- [ ] 全ページのセクションタイトル拡大
- [ ] 行間・トラッキング最適化
- [ ] 段階的アニメーション追加
- [ ] ビルド検証
- [ ] 最終ビジュアル確認

---

## 🎬 アニメーション仕様

### Hero エントランスアニメーション
```typescript
const heroVariants = {
  initial: { 
    opacity: 0,
    scale: 1.1
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut"
    }
  }
};

const textVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: "easeOut"
    }
  }
};
```

### カードホバーアニメーション
```typescript
const cardHover = {
  scale: 1.08,
  y: -12,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] // cubic-bezier
  }
};
```

### スクロールトリガーアニメーション
```typescript
<motion.div
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
```

---

## 🎨 カラーパレット

### 既存のTailwind設定を活用
```typescript
// primary: 温泉のイメージ（温かみのあるオレンジ系）
primary-400, primary-500, primary-600

// dark: 背景と深みのあるコントラスト
dark-800, dark-900, dark-950

// グラデーション
from-dark-950 via-dark-900 to-dark-950
from-black/70 via-black/50 to-transparent
```

---

## 🧪 テスト・検証

### ビルドテスト
```bash
# 型チェック
npx tsc --noEmit

# ビルド
SKIP_CHECK=true npm run build

# 期待結果: 33ページすべて生成成功
```

### ビジュアル確認
- [ ] デスクトップ（1920px）
- [ ] タブレット（768px）
- [ ] モバイル（375px）
- [ ] ホバー/アニメーション動作確認
- [ ] スクロール連動確認

---

## 📸 成果物（スクリーンショット必須）

### 必須スクリーンショット
1. **Hero セクション** (Before/After)
2. **カードグリッド** (Before/After)
3. **モバイル表示** (After)
4. **ホバーエフェクト** (動画またはGIF)

---

## ⚡ 開始手順（エージェントB向け）

### 1. 環境確認
```bash
cd /home/runner/work/website_v2/website_v2
npm install
npm run dev
```

### 2. 対象ファイルを開く
```bash
# Hero コンポーネント
app/components/_legacy/home/CinematicHero.tsx
app/components/_legacy/home/FullscreenHero.tsx

# カードコンポーネント
app/components/_legacy/home/GridGallery.tsx
app/components/_legacy/home/AreaSelection.tsx
app/components/_legacy/home/RecommendedOnsen.tsx
```

### 3. Phase 1 から順次実施
- 小さな変更から始める
- 変更ごとにビルド確認
- スクリーンショット撮影
- コミット

---

## 🆘 困ったときは

### エラーが発生したら
1. `npx tsc --noEmit` で型エラー確認
2. `SKIP_CHECK=true npm run build` でビルドテスト
3. Framer Motion のバージョン確認: `npm list framer-motion`

### ビジュアルが想定と違う場合
1. 既存の `content.json` の画像を確認
2. Tailwind のブレークポイントを確認
3. ブラウザの開発者ツールで要素を検証

---

## 📝 レポート形式

### 各Phase完了時
```markdown
## Phase X 完了報告

### 変更したファイル
- ファイル名1
- ファイル名2

### 主な変更内容
- 変更1
- 変更2

### スクリーンショット
![Before](link)
![After](link)

### ビルド結果
✅ 型チェック: 成功
✅ ビルド: 33ページ生成成功

### コミットハッシュ
abc1234
```

---

**次のアクション**: エージェントBは Phase 1 (Hero セクション) から開始してください。変更ごとにコミットし、スクリーンショットを撮影してください。

**言語**: すべての対応・コメント・コミットメッセージは日本語で行ってください。
