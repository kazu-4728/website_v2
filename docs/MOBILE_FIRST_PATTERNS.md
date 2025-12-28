# モバイルファーストパターンガイド

**作成日**: 2025年12月23日  
**目的**: 新規コンポーネント開発時のモバイルファースト最適化パターンを標準化

---

## 基本原則

### モバイルファーストの考え方

モバイルファーストアプローチでは、**モバイルデバイスを基準にデザインを構築**し、段階的に大きな画面サイズに対応していきます。

- **モバイル（<768px）**: 基準となるサイズ
- **タブレット（≥768px）**: `md:` ブレークポイント
- **デスクトップ（≥1024px）**: `lg:` ブレークポイント
- **大型デスクトップ（≥1280px）**: `xl:` ブレークポイント
- **超大型デスクトップ（≥1536px）**: `2xl:` ブレークポイント

### Tailwind CSS のブレークポイント

| ブレークポイント | 最小幅 | 用途 |
|:---|:---|:---|
| `sm:` | 640px | 小型タブレット |
| `md:` | 768px | タブレット |
| `lg:` | 1024px | デスクトップ |
| `xl:` | 1280px | 大型デスクトップ |
| `2xl:` | 1536px | 超大型デスクトップ |

---

## テキストサイズのパターン

### 本文テキスト

```tsx
// 標準的な本文
<p className="text-base md:text-lg lg:text-xl">
  コンテンツテキスト
</p>

// 小さな本文
<p className="text-sm md:text-base lg:text-lg">
  補助的なテキスト
</p>
```

**推奨パターン**:
- モバイル: `text-base` (16px) - 最適な読みやすさ
- タブレット: `text-lg` (18px)
- デスクトップ: `text-xl` (20px)

### サブタイトル

```tsx
<p className="text-xs md:text-sm lg:text-base font-bold tracking-[0.2em]">
  サブタイトル
</p>
```

**推奨パターン**:
- モバイル: `text-xs` (12px)
- タブレット: `text-sm` (14px)
- デスクトップ: `text-base` (16px)

### タイトル（小）

```tsx
<h3 className="text-lg md:text-xl lg:text-2xl font-bold">
  小見出し
</h3>
```

### タイトル（中）

```tsx
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  中見出し
</h2>
```

### タイトル（大）

```tsx
<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
  大見出し
</h1>
```

### タイトル（特大）

```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">
  特大見出し
</h1>
```

---

## 余白のパターン

### セクション余白

```tsx
<section className="py-16 md:py-24 lg:py-32">
  セクションコンテンツ
</section>
```

**推奨パターン**:
- モバイル: `py-16` (64px) - 画面スペースを有効活用
- タブレット: `py-24` (96px)
- デスクトップ: `py-32` (128px)

### コンテナ余白

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
  コンテナコンテンツ
</div>
```

**推奨パターン**:
- モバイル: `px-4` (16px)
- 小型タブレット: `px-6` (24px)
- タブレット以上: `px-8` (32px)

### カード内余白

```tsx
<div className="p-4 sm:p-6 md:p-8">
  カードコンテンツ
</div>
```

**推奨パターン**:
- モバイル: `p-4` (16px)
- タブレット: `p-6` (24px)
- デスクトップ: `p-8` (32px)

### グリッドギャップ

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
  グリッドアイテム
</div>
```

**推奨パターン**:
- モバイル: `gap-4` (16px)
- タブレット: `gap-6` (24px)
- デスクトップ: `gap-8` (32px)

---

## タッチターゲットのパターン

### リンクとボタン

すべてのインタラクティブ要素は、**最低44×44px**のタッチターゲットサイズを確保する必要があります。

```tsx
// リンク
<Link href="/path" className="min-h-[44px] min-w-[44px]">
  リンクテキスト
</Link>

// ボタン
<button className="px-6 md:px-8 py-3 md:py-4 min-h-[44px]">
  ボタンテキスト
</button>
```

**推奨パターン**:
- モバイル: `px-6 py-3` + `min-h-[44px]`
- デスクトップ: `px-8 py-4` + `min-h-[44px]`

---

## パフォーマンス最適化のパターン

### backdrop-blur の最適化

`backdrop-blur` はモバイルデバイスでGPU負荷が高いため、**デスクトップのみ適用**します。

```tsx
// ❌ 悪い例（モバイルでも適用）
<div className="backdrop-blur-sm">
  コンテンツ
</div>

// ✅ 良い例（デスクトップのみ適用）
<div className="md:backdrop-blur-sm">
  コンテンツ
</div>
```

### 画像の最適化

```tsx
<Image
  src={imageUrl}
  alt="説明"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
  quality={85}
/>
```

---

## 実装例

### GridSection の実装例

```tsx
export function GridSection({ title, subtitle, description, cards }: Props) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          {subtitle && (
            <p className="text-xs md:text-sm lg:text-base font-bold tracking-[0.2em] mb-4">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-base md:text-lg lg:text-xl">
              {description}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### SplitSection の実装例

```tsx
export function SplitSection({ title, description, image, action }: Props) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]">
            <Image src={image} alt="説明" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              {title}
            </h2>
            <p className="text-base md:text-lg lg:text-xl mb-8">
              {description}
            </p>
            {action && (
              <Link href={action.href} className="min-h-[44px] min-w-[44px] inline-block">
                <button className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg">
                  {action.label}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### PremiumGridSection の実装例

```tsx
export function PremiumGridSection({ title, items }: Props) {
  return (
    <section className="py-16 md:py-24 lg:py-32 xl:py-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-12 md:mb-16 lg:mb-20">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {items.map((item) => (
            <Link key={item.id} href={item.link} className="min-h-[44px]">
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                <Image src={item.image} alt={item.title} fill />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 md:backdrop-blur-md">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-base md:text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## チェックリスト

新規コンポーネントを作成する際は、以下のチェックリストを確認してください：

### テキストサイズ
- [ ] モバイルで `text-base` (16px) 以上を使用しているか
- [ ] デスクトップで段階的にサイズを増やしているか（`md:`, `lg:`, `xl:`）

### 余白
- [ ] セクション余白が `py-16 md:py-24 lg:py-32` のパターンに従っているか
- [ ] コンテナ余白が `px-4 sm:px-6 md:px-8` のパターンに従っているか
- [ ] グリッドギャップが `gap-4 sm:gap-6 md:gap-8` のパターンに従っているか

### タッチターゲット
- [ ] すべてのリンクとボタンに `min-h-[44px]` が設定されているか
- [ ] ボタンのパディングが `px-6 md:px-8 py-3 md:py-4` のパターンに従っているか

### パフォーマンス
- [ ] `backdrop-blur` が `md:backdrop-blur-*` のようにデスクトップのみ適用されているか
- [ ] 画像に適切な `sizes` 属性が設定されているか

---

## 参考資料

- [Tailwind CSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.1 - Target Size (Level AAA)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Web.dev - Mobile-first responsive design](https://web.dev/responsive-web-design-basics/)

---

**最終更新**: 2025年12月23日  
**次回更新**: パターンの追加・変更時

