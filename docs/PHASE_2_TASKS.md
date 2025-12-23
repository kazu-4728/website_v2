# 🚀 Phase 2 タスク一覧

**作成日**: 2025年12月23日  
**目的**: Phase 1 完了後の残タスクと Phase 2 での実施事項を明確化

---

## ⚠️ 重要: Phase 1 の実際の完了状況

### Phase 1 で完了したこと
- ✅ カラーコントラスト改善（WCAG AA基準達成）
- ✅ ドキュメント整理・最新化
- ✅ プロジェクト方針の明確化（JSON First、ベンチマーク、画像選定）
- ✅ 21ページすべてへのスラッグ適用確認
- ✅ Google マップ等のデータ不足の原因特定

### Phase 1 で未完了のこと（Phase 2 へ移行）
- ❌ **スクリーンショットの追加**（視覚的な確認ができない）
- ❌ design-tokens.ts の作成と統合
- ❌ Header/MobileMenu/Footer の完全実装
- ❌ 100vh Hero の最終調整と LCP 対応
- ❌ Lighthouse/axe による品質検証
- ❌ トップページMVPセクションの完全実装

**結論**: Phase 1 は「基盤構築」として部分的に完了。視覚的要素の確認と実装の完成は Phase 2 で実施。

---

## 📋 Phase 2 タスク詳細

### 優先度1: 視覚的確認とスクリーンショット（必須）

#### タスク1.1: スクリーンショット撮影システムの構築
**目的**: PRに視覚的な変更を示すため

**実施内容**:
1. 開発サーバーを起動
2. デスクトップ（1920x1080）でスクリーンショット撮影
3. モバイル（375x812）でスクリーンショット撮影
4. Before/After の比較画像を作成
5. `screenshots/` ディレクトリに保存

**対象ページ**:
- トップページ（`/`）
- 箱根ページ（`/hakone`）
- ブログ一覧（`/blog`）
- お問い合わせ（`/contact`）

**成果物**:
- `screenshots/desktop-home-after.png`
- `screenshots/mobile-home-after.png`
- `screenshots/desktop-hakone-after.png`
- `screenshots/mobile-hakone-after.png`

---

### 優先度2: design-tokens の実装

#### タスク2.1: design-tokens.ts の作成
**ファイル**: `styles/design-tokens.ts` または `app/components/ui/design-tokens.ts`

**内容**:
```typescript
export const colors = {
  primary: {
    main: '#1e40af',      // Ocean Blue
    light: '#60a5fa',
    dark: '#1e3a8a',
  },
  secondary: {
    main: '#38bdf8',      // Sky Blue
    light: '#7dd3fc',
    dark: '#0284c7',
  },
  accent: {
    gold: '#fbbf24',      // Sunset Gold
    goldLight: '#fcd34d',
    goldDark: '#f59e0b',
  },
  background: {
    cloudWhite: '#f8fafc',
    mist: '#e0f2fe',
    ocean: '#0c4a6e',
  },
  text: {
    primary: '#1f2937',   // gray-900
    secondary: '#4b5563', // gray-600
    tertiary: '#6b7280',  // gray-500
    inverse: '#ffffff',
  },
} as const;

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

export const typography = {
  fontFamily: {
    heading: '"Noto Serif JP", serif',
    body: '"Noto Sans JP", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem',     // 128px
  },
} as const;
```

#### タスク2.2: 既存コンポーネントへの tokens 適用
**対象コンポーネント**:
- `SplitFeature.tsx`
- `GridGallery.tsx`
- `Steps.tsx`
- `Testimonials.tsx`
- `OceanViewHero.tsx`
- `PremiumCard.tsx`

**変更例**:
```tsx
// Before
<h2 className="text-gray-900">タイトル</h2>

// After
import { colors } from '@/styles/design-tokens';
<h2 style={{ color: colors.text.primary }}>タイトル</h2>
// または Tailwind CSS の設定に tokens を統合
```

---

### 優先度3: Header/MobileMenu/Footer の完全実装

#### タスク3.1: Header の改善
**ファイル**: `app/components/modern/Navigation/PremiumNav.tsx`

**要件**:
1. **透明ヘッダー**: Hero上では `backdrop-blur` で半透明
2. **スクロール連動**: スクロールで背景色を付与（sticky）
3. **アクセシビリティ**:
   - skip-to-content リンク
   - aria-label 属性
   - キーボードナビゲーション対応

**変更内容**:
```tsx
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

<header className={`
  fixed top-0 w-full z-50 transition-all duration-300
  ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent backdrop-blur-xl'}
`}>
```

#### タスク3.2: MobileMenu の実装
**ファイル**: `app/components/modern/Navigation/MobileMenu.tsx`（新規）

**要件**:
1. **フルスクリーン**: モバイルでは画面全体を覆う
2. **フォーカストラップ**: メニュー内でタブキーが循環
3. **Esc キーで閉じる**: キーボード操作対応
4. **aria 属性**:
   - `aria-expanded`
   - `aria-controls`
   - `aria-label`

**実装例**:
```tsx
import { useEffect, useRef } from 'react';

export function MobileMenu({ isOpen, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // フォーカストラップ
      const firstFocusable = menuRef.current?.querySelector('a, button');
      (firstFocusable as HTMLElement)?.focus();

      // Esc キーで閉じる
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  return (
    <div
      ref={menuRef}
      className={`fixed inset-0 z-50 bg-white ${isOpen ? 'block' : 'hidden'}`}
      aria-expanded={isOpen}
      aria-label="モバイルメニュー"
    >
      {/* メニュー内容 */}
    </div>
  );
}
```

#### タスク3.3: Footer の実装
**ファイル**: `app/components/modern/Layout/Footer.tsx`（新規）

**要件**:
1. サイトマップリンク
2. SNSリンク（オプション）
3. コピーライト表示
4. アクセシビリティ対応

---

### 優先度4: Hero の最終調整と LCP 対応

#### タスク4.1: OceanViewHero の最適化
**ファイル**: `app/components/modern/Hero/OceanViewHero.tsx`

**要件**:
1. **LCP 対応**:
   - `priority` 属性を使用
   - `srcset` と `sizes` の最適化
   - WebP/AVIF フォーマットの使用

2. **レスポンシブ対応**:
   - デスクトップ: 100vh
   - モバイル: 70vh〜80vh

**変更例**:
```tsx
<Image
  src="/images/hero-onsen.jpg"
  alt="温泉の風景"
  fill
  priority
  sizes="100vw"
  quality={90}
  className="object-cover"
/>
```

#### タスク4.2: オーバーレイによる可読性確保
**変更内容**:
```tsx
<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
```

---

### 優先度5: トップページMVPセクションの実装

#### タスク5.1: セクション構成
**ファイル**: `app/page.tsx`

**セクション**:
1. **Hero**: OceanViewHero（100vh）
2. **Featured**: 注目の温泉地（3-4枚の大型カード）
3. **Gallery**: 温泉写真ギャラリー（温泉写真のみ）
4. **Introduction**: サイトの簡易紹介
5. **CTA**: 「おすすめをみる」「エリアを探す」ボタン

#### タスク5.2: 既存コンポーネントの統合
**変更内容**:
- `SplitFeature` → tokens 準拠に更新
- `GridGallery` → 温泉写真のみ表示
- `Steps` → tokens 準拠に更新
- `Testimonials` → tokens 準拠に更新

---

### 優先度6: 品質・アクセシビリティ検証

#### タスク6.1: TypeScript ビルド
**コマンド**:
```bash
npm run build
npx tsc --noEmit
```

**基準**: エラー0件

#### タスク6.2: ESLint と Prettier
**コマンド**:
```bash
npm run lint
npx prettier --write .
```

**基準**: エラー・警告0件

#### タスク6.3: Lighthouse 検証
**対象**: トップページ（`/`）

**コマンド**:
```bash
# Chrome DevTools で実行
# または Lighthouse CI を使用する場合は別途設定が必要
```

**目標スコア**:
- Performance: >=80
- Accessibility: >=90
- Best Practices: >=90
- SEO: >=90

**保存**:
- `reports/lighthouse-report.json`
- `screenshots/lighthouse-scores.png`

#### タスク6.4: axe-core 検証
**インストール**:
```bash
npm install -D @axe-core/cli
```

**コマンド**:
```bash
npx axe http://localhost:3000 --save reports/axe-report.json
```

**基準**: クリティカル・重大問題0件

#### タスク6.5: カラーコントラスト再計測
**ツール**: WebAIM Contrast Checker または Lighthouse

**対象要素**:
- タイトル（text-gray-900 on cloud-white）
- 本文（text-gray-700 on cloud-white）
- 補助テキスト（text-gray-600 on cloud-white）
- ボタンテキスト（text-white on primary）

**基準**: すべて WCAG AA（>=4.5:1）

**報告形式**:
```markdown
| 要素 | 前景色 (hex) | 背景色 (hex) | コントラスト比 | 判定 |
|------|-------------|-------------|---------------|------|
| タイトル | #111827 | #f8fafc | 12:1 | ✅ WCAG AAA |
| 本文 | #374151 | #f8fafc | 7:1 | ✅ WCAG AA |
```

---

### 優先度7: PR 分割と出力

#### タスク7.1: PR 分割ルール
**ブランチ名例**:
- `feat/phase2/design-tokens`
- `feat/phase2/header-sticky`
- `feat/phase2/mobile-menu`
- `feat/phase2/hero-lcp`
- `feat/phase2/top-mvp`

#### タスク7.2: 各 PR に含めるもの
1. **変更ファイルリスト**（ファイルパスのみ）
2. **Desktop/Mobile スクリーンショット**
3. **Lighthouse/axe 要約**
4. **短い説明**（何を変更したか）

**PR テンプレート**:
```markdown
## 変更内容
- design-tokens.ts を追加
- 既存コンポーネントに tokens を適用

## Files Changed
- `styles/design-tokens.ts` (新規)
- `app/components/_legacy/home/SplitFeature.tsx`
- `app/components/_legacy/home/GridGallery.tsx`

## スクリーンショット
![Desktop](./screenshots/desktop-home.png)
![Mobile](./screenshots/mobile-home.png)

## 品質チェック
- TypeScript ビルド: ✅
- ESLint: ✅
- Lighthouse Accessibility: 92/100 ✅
- axe-core: クリティカル問題なし ✅
```

---

## 📊 Phase 2 完了チェックリスト

### 必須タスク
- [ ] design-tokens 定義済み
- [ ] Header がスクロール連動で背景色付与（sticky）
- [ ] MobileMenu でフォーカストラップと Esc 動作確認
- [ ] Footer を layout に組込済み
- [ ] Hero が 100vh で LCP 対応
- [ ] トップページMVPセクション完成
- [ ] コントラスト WCAG AA 達成（報告あり）
- [ ] Lighthouse/axe の結果を添付
- [ ] すべての PR にスクショと変更ファイルリストがある
- [ ] デスクトップ/モバイルのスクリーンショット撮影完了

### オプションタスク
- [ ] 温泉画像の収集（Phase 3 へ移行可）
- [ ] 21ページすべてに onsen データ追加（Phase 3 へ移行可）
- [ ] アニメーション最適化

---

## 🎯 Phase 2 完了の判定基準

**Phase 2 完了とみなす条件**:
1. ✅ すべての必須タスクが完了
2. ✅ ビルドエラー0件
3. ✅ Lighthouse Accessibility >=90
4. ✅ axe-core でクリティカル問題なし
5. ✅ すべての PR にスクリーンショットあり
6. ✅ カラーコントラスト WCAG AA 達成の証拠あり

**Phase 2 未完了とみなす条件**:
- ❌ ビルドエラーが残っている
- ❌ 重大なアクセシビリティ違反がある
- ❌ スクリーンショットが不足している
- ❌ カラーコントラストが基準未達

---

## 📝 Phase 3 への引継ぎ事項

### Phase 3 で実施するタスク
1. **温泉画像の収集**
   - Unsplash/Pexels/Wikimedia から収集
   - 各温泉地に適切な画像を割り当て

2. **onsen データの追加**
   - 21ページすべてに詳細データを追加
   - 草津、鬼怒川、伊香保から優先的に

3. **パフォーマンス最適化**
   - 画像の最適化（WebP/AVIF）
   - コード分割
   - Lazy Loading

4. **SEO 最適化**
   - メタタグの最適化
   - 構造化データの追加
   - sitemap.xml の更新

---

**作成者**: GitHub Copilot Agent  
**作成日**: 2025年12月23日  
**次回更新**: Phase 2 開始時
