# 🎨 完全再設計: ベンチマークサイト風 UI/UX

**作成日**: 2025年12月21日  
**目的**: 既存デザインを破棄し、「あえの風」レベルのベンチマークサイトを完全再現

---

## 🚨 完全再設計の方針

### 過去のサイトは忘れる
- ❌ `_legacy` コンポーネントは使わない
- ❌ 暗いカラーパレットは捨てる
- ❌ 小さな画像配置は捨てる
- ✅ **完全にゼロから設計し直す**

---

## 🎯 ベンチマークサイト（あえの風）の特徴

### 1. ビジュアル面
- **超大型の画像使用**: 画面全体を覆う（100vh+）
- **青と白の爽やかな配色**: 海と空を想起させる
- **余白を贅沢に使う**: セクション間は py-48〜py-64
- **高品質な写真**: 2400px以上、プロレベルの撮影

### 2. レイアウト
- **シングルカラム中心**: モバイルファースト
- **スプリットレイアウト**: 左右に画像とテキストを配置
- **固定ヘッダー**: 常にナビゲーションが見える
- **スムーズスクロール**: セクション間のアニメーション

### 3. ナビゲーション
- **シンプルなメニュー**: 5項目以内
- **大きなCTAボタン**: 予約・お問い合わせが目立つ
- **パンくずリスト**: サイト階層が分かりやすい

### 4. タイポグラフィ
- **超大型の見出し**: text-8xl〜text-9xl
- **日本語フォント**: Noto Serif JP（明朝体）
- **文字間隔広め**: tracking-wider
- **行間広め**: leading-relaxed

---

## 📋 実装する新コンポーネント

### 1. 完全新規Heroコンポーネント
**`app/components/modern/Hero/OceanViewHero.tsx`**

```tsx
特徴:
- 画面全体（100vh）を覆う背景画像
- 中央に大きなタイトル（text-9xl）
- 下にスクロールを促すアニメーション
- 青と白のグラデーションオーバーレイ
```

### 2. 完全新規ナビゲーション
**`app/components/modern/Navigation/PremiumNav.tsx`**

```tsx
特徴:
- 固定ヘッダー（sticky top-0）
- 背景はガラスモーフィズム（backdrop-blur）
- ロゴは左、メニューは右
- 予約ボタンは金色で目立つ
```

### 3. 完全新規カードコンポーネント
**`app/components/modern/Cards/PremiumCard.tsx`**

```tsx
特徴:
- 高さ 600px〜800px（超大型）
- 画像が全面、テキストは下部に白い背景で重ねる
- ホバー時に画像がズーム
- 影は subtle（控えめ）
```

### 4. 完全新規セクションレイアウト
**`app/components/modern/Sections/SplitSection.tsx`**

```tsx
特徴:
- 左に画像、右にテキスト（またはその逆）
- 画像とテキストが50:50
- 画像は object-cover で全面
- テキストは中央寄せ、余白たっぷり
```

---

## 🎨 新カラーパレット（完全刷新）

### 海と空の配色
```css
/* Primary - Ocean Blue */
--color-ocean-blue: #1e40af;
--color-ocean-light: #60a5fa;
--color-ocean-dark: #1e3a8a;

/* Secondary - Sky & Cloud */
--color-sky-blue: #38bdf8;
--color-cloud-white: #f8fafc;
--color-mist: #e0f2fe;

/* Accent - Sunset Gold */
--color-gold: #fbbf24;
--color-gold-light: #fcd34d;

/* Neutral */
--color-white: #ffffff;
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-900: #111827;

/* Text */
--color-text-primary: #1f2937;
--color-text-secondary: #6b7280;
--color-text-inverse: #ffffff;
```

### 背景グラデーション
```css
.bg-ocean-gradient {
  background: linear-gradient(135deg, #1e40af 0%, #38bdf8 100%);
}

.bg-sky-gradient {
  background: linear-gradient(180deg, #e0f2fe 0%, #ffffff 100%);
}

.bg-sunset-gradient {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}
```

---

## 🏗️ 新ファイル構造

```
app/
├── components/
│   ├── modern/              ← 完全新規（ベンチマーク風）
│   │   ├── Hero/
│   │   │   ├── OceanViewHero.tsx
│   │   │   └── ParallaxHero.tsx
│   │   ├── Navigation/
│   │   │   ├── PremiumNav.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── Cards/
│   │   │   ├── PremiumCard.tsx
│   │   │   └── FeatureCard.tsx
│   │   ├── Sections/
│   │   │   ├── SplitSection.tsx
│   │   │   ├── FullWidthSection.tsx
│   │   │   └── GridSection.tsx
│   │   └── Footer/
│   │       └── PremiumFooter.tsx
│   └── _legacy/             ← 既存（使わない）
└── ...
```

---

## 📐 レイアウト設計

### Heroセクション
```
+----------------------------------+
|                                  |
|        [超大型画像背景]          |
|                                  |
|     大タイトル（text-9xl）       |
|     サブタイトル                 |
|     [予約ボタン]                |
|                                  |
|     ↓ スクロールアイコン         |
+----------------------------------+
100vh
```

### スプリットセクション
```
+----------------------------------+
| [画像]    |  テキストエリア      |
| 50%       |  - タイトル          |
|           |  - 説明文            |
|           |  - [詳細ボタン]      |
+----------------------------------+
600px
```

### グリッドセクション（3カラム）
```
+----------------------------------+
|  [カード]  [カード]  [カード]   |
|   画像     画像     画像         |
|   タイトル  タイトル  タイトル    |
|   説明     説明     説明         |
+----------------------------------+
800px
```

---

## ⚡ アニメーション

### Hero エントランス
```tsx
// 画像: ゆっくりズームアウト
scale: 1.1 → 1.0 (3s)

// タイトル: フェードイン + 上昇
opacity: 0 → 1
y: 30 → 0
(1.2s, delay: 0.3s)

// ボタン: バウンス
scale: 0.9 → 1.0 → 0.95 → 1.0
(0.6s, delay: 0.8s)
```

### スクロール連動
```tsx
// セクションが表示されたら
opacity: 0 → 1
y: 50 → 0
(0.8s)

// 画像は遅れてズーム
scale: 1.05 → 1.0
(1.2s, delay: 0.2s)
```

### ホバーエフェクト
```tsx
// カード
scale: 1.0 → 1.03
y: 0 → -8
shadow: sm → xl
(0.3s)

// 画像
scale: 1.0 → 1.1
(0.5s)
```

---

## 🎬 実装手順

### Phase 1: 基盤の構築（Day 1）
- [x] 新カラーパレットをglobals.cssに定義
- [ ] PremiumNav コンポーネント作成
- [ ] PremiumFooter コンポーネント作成
- [ ] 新レイアウト（`app/components/modern/Layout.tsx`）作成

### Phase 2: Hero完全再設計（Day 2）
- [ ] OceanViewHero コンポーネント作成
- [ ] 高品質な背景画像を設定
- [ ] アニメーション実装
- [ ] 動作確認

### Phase 3: コンテンツセクション（Day 3-4）
- [ ] SplitSection コンポーネント作成
- [ ] PremiumCard コンポーネント作成
- [ ] GridSection コンポーネント作成
- [ ] 全セクション実装

### Phase 4: 最適化とテスト（Day 5）
- [ ] パフォーマンステスト
- [ ] モバイル最適化
- [ ] ブラウザ互換性確認
- [ ] 最終調整

---

## ✅ 完成基準

### ビジュアル
- [ ] 「あえの風」と見間違えるレベル
- [ ] 画像が大きく、インパクトがある
- [ ] 配色が爽やかで上品

### 機能
- [ ] ナビゲーションが直感的
- [ ] スクロールが滑らか
- [ ] ホバーエフェクトが洗練されている

### パフォーマンス
- [ ] LCP < 2.0s
- [ ] CLS < 0.1
- [ ] Lighthouse Performance > 90

---

**このドキュメントに基づき、完全再設計を実行します。**
