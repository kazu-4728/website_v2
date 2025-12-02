# コンポーネント・ページルート分類レポート

## 調査概要

リポジトリ内のコンポーネントとページルートを、現在の温泉テーマ（onsen-kanto）での使用状況に基づいて分類しました。

**分類基準**:
- **A**: 現在の温泉テーマで実際に使われているもの
- **B**: 現在は未使用だが、他のテーマでも再利用しやすそうな「汎用テンプレ候補」
- **C**: 古いブランド・実験コードなど、テンプレとしても再利用しにくいもの（削除候補）

---

## 📄 ページルート分類

### A: 現在使用中

| ファイルパス | 役割 | 備考 |
|------------|------|------|
| `app/page.tsx` | ホームページ | content.jsonの`pages.home`を表示 |
| `app/docs/page.tsx` | ドキュメント一覧ページ | content.jsonの`pages.docs`を一覧表示 |
| `app/docs/[slug]/page.tsx` | 個別ドキュメントページ | 動的ルート、content.jsonから該当docを取得 |
| `app/blog/page.tsx` | ブログ一覧ページ | content.jsonの`pages.blog.posts`を一覧表示 |
| `app/blog/[slug]/page.tsx` | 個別ブログ記事ページ | 動的ルート、content.jsonから該当postを取得 |
| `app/features/page.tsx` | おすすめプランページ | content.jsonの`pages.features`を表示 |
| `app/contact/page.tsx` | お問い合わせページ | content.jsonの`pages.contact`を表示 |

### C: 削除候補（sitemapに記載されているが実体がない）

| ファイルパス | 役割 | 削除候補と判断した理由 |
|------------|------|----------------------|
| `/about` | アバウトページ | `app/sitemap.ts`に記載されているが、実際のページファイルが存在しない |
| `/pricing` | 価格ページ | `app/sitemap.ts`に記載されているが、実際のページファイルが存在しない |
| `/faq` | FAQページ | `app/sitemap.ts`に記載されているが、実際のページファイルが存在しない |

---

## 🧩 コンポーネント分類

### A: 現在使用中

#### ナビゲーション
| ファイルパス | 役割 | 使用箇所 |
|------------|------|---------|
| `app/components/navigation/Header.tsx` | サイトヘッダー・ナビゲーション | `app/layout.tsx` |

#### ホームページ専用コンポーネント
| ファイルパス | 役割 | 使用箇所 |
|------------|------|---------|
| `app/components/home/CinematicHero.tsx` | シネマティックヒーローセクション | `app/page.tsx` |
| `app/components/home/SplitFeature.tsx` | 左右分割型フィーチャーセクション | `app/page.tsx` |
| `app/components/home/GridGallery.tsx` | グリッドギャラリーセクション | `app/page.tsx` |
| `app/components/home/Testimonials.tsx` | お客様の声セクション | `app/page.tsx` |
| `app/components/home/CtaFullscreen.tsx` | フルスクリーンCTAセクション | `app/page.tsx` |

#### UIコンポーネント
| ファイルパス | 役割 | 使用箇所 |
|------------|------|---------|
| `app/components/ui/Button.tsx` | ボタンコンポーネント | 複数のページ（features, contact, docs等） |
| `app/components/ui/MarkdownRenderer.tsx` | Markdownレンダラー | `app/docs/[slug]/page.tsx`, `app/blog/[slug]/page.tsx` |
| `app/components/ui/TableOfContents.tsx` | 目次コンポーネント | `app/docs/[slug]/page.tsx` |
| `app/components/ui/ImageCredit.tsx` | 画像クレジット表示 | `app/docs/[slug]/page.tsx`, `app/components/home/SplitFeature.tsx` |
| `app/components/CodeBlock.tsx` | コードブロック表示 | `app/components/ui/MarkdownRenderer.tsx`から使用 |

#### アイコン
| ファイルパス | 役割 | 使用箇所 |
|------------|------|---------|
| `app/components/icons/index.tsx` | アイコンコンポーネント | 複数のページで使用 |

---

### B: 汎用テンプレ候補（未使用だが再利用可能）

#### カードコンポーネント
| ファイルパス | 役割 | 判断理由 |
|------------|------|---------|
| `app/components/cards/ContentCard.tsx` | 汎用コンテンツカード | 画像・タイトル・説明・バッジ・メタ情報を持つ汎用的なカードコンポーネント。他のテーマでも再利用可能 |
| `app/components/cards/FeatureCard.tsx` | フィーチャーカード | アイコン・タイトル・説明を持つ汎用的なカードコンポーネント。他のテーマでも再利用可能 |
| `app/components/cards/StatCard.tsx` | 統計カード | 数値・ラベル・アイコン・変化量を表示する汎用的なカードコンポーネント。他のテーマでも再利用可能 |
| `app/components/cards/TestimonialCard.tsx` | お客様の声カード | 引用・著者・役割・アバター・評価を表示する汎用的なカードコンポーネント。現在は`Testimonials`コンポーネント内で直接実装されているが、将来的に再利用可能 |

#### レイアウトコンポーネント
| ファイルパス | 役割 | 判断理由 |
|------------|------|---------|
| `app/components/layouts/HeroSection.tsx` | ヒーローセクション | 汎用的なヒーローセクションコンポーネント。現在は`CinematicHero`を使用しているが、他のテーマで再利用可能 |
| `app/components/layouts/ContentSection.tsx` | コンテンツセクション | 汎用的なコンテンツセクションコンポーネント。他のテーマで再利用可能 |
| `app/components/ui/Container.tsx` | コンテナコンポーネント | `PageHeader`, `HeroSection`, `ContentSection`から使用されているが、これらが未使用のため間接的に未使用。ただし、汎用的なコンテナコンポーネントとして他のテーマで再利用可能 |
| `app/components/ui/PageHeader.tsx` | ページヘッダー | 汎用的なページヘッダーコンポーネント。他のテーマで再利用可能 |
| `app/components/ui/Grid.tsx` | グリッドレイアウト | 汎用的なグリッドレイアウトコンポーネント。他のテーマで再利用可能 |
| `app/components/ui/GlassCard.tsx` | ガラスモーフィズムカード | 汎用的なガラスモーフィズムスタイルのカードコンポーネント。他のテーマで再利用可能 |
| `app/components/ui/Badge.tsx` | バッジコンポーネント | `ContentCard`から使用されているが、`ContentCard`自体が未使用のため間接的に未使用。ただし、汎用的なバッジコンポーネントとして他のテーマで再利用可能 |

#### 汎用ページコンポーネント
| ファイルパス | 役割 | 判断理由 |
|------------|------|---------|
| `app/components/GenericPage.tsx` | 汎用ページコンポーネント | タイトル・説明を持つ汎用的なページコンポーネント。他のテーマで再利用可能 |

---

### C: 削除候補（古いブランド・実験コード）

#### Stripeテーマ関連（未使用）
| ファイルパス | 役割 | 削除候補と判断した理由 |
|------------|------|----------------------|
| `app/components/stripe/AnimatedBackground.tsx` | Stripe風アニメーション背景 | Stripeテーマ用のコンポーネント。`app/config/theme.config.ts`にStripeテーマの定義はあるが、実際には使用されていない。温泉テーマには不要 |
| `app/components/stripe/InteractiveCard.tsx` | Stripe風インタラクティブカード | Stripeテーマ用のコンポーネント。実際には使用されていない。温泉テーマには不要 |
| `app/components/stripe/StatCounter.tsx` | Stripe風統計カウンター | Stripeテーマ用のコンポーネント。実際には使用されていない。温泉テーマには不要 |

#### テンプレート生成ユーティリティ（未使用）
| ファイルパス | 役割 | 削除候補と判断した理由 |
|------------|------|----------------------|
| `app/templates/page-templates.tsx` | ページテンプレート定義 | ページ構造のテンプレート定義ファイル。実際のページ生成には使用されていない。現在の実装では`content.json`から直接ページを生成しているため不要 |
| `app/templates/generate-page.ts` | ページ自動生成ユーティリティ | ページ構造を自動生成するユーティリティ。実際には使用されていない。現在の実装では`content.json`から直接ページを生成しているため不要 |

#### テーマ設定ファイル（未使用）
| ファイルパス | 役割 | 削除候補と判断した理由 |
|------------|------|----------------------|
| `app/config/theme.config.ts` | テーマ設定ファイル | GitHub DocsテーマとStripeテーマの設定を定義しているが、実際には使用されていない。現在の実装では`themes/onsen-kanto/`配下のJSONファイルでテーマを管理しているため不要 |

---

## 📊 統計サマリー

### ページルート
- **A（使用中）**: 7件
- **B（汎用候補）**: 0件
- **C（削除候補）**: 3件（sitemapに記載されているが実体がない）

### コンポーネント
- **A（使用中）**: 12件
- **B（汎用候補）**: 12件
- **C（削除候補）**: 6件

---

## 🎯 次のステップ提案

### フェーズA-1: 削除候補（C分類）の整理

1. **sitemap.tsの修正**
   - `/about`, `/pricing`, `/faq`のエントリを削除

2. **Stripeテーマ関連コンポーネントの削除**
   - `app/components/stripe/`ディレクトリごと削除

3. **テンプレート生成ユーティリティの削除**
   - `app/templates/`ディレクトリごと削除

4. **テーマ設定ファイルの削除**
   - `app/config/theme.config.ts`を削除

### フェーズA-2: 汎用テンプレ候補（B分類）の整理

1. **ドキュメント化**
   - B分類のコンポーネントを`docs/COMPONENT_LIBRARY.md`などにドキュメント化
   - 他のテーマで使用する際のガイドラインを作成

2. **使用状況の再確認**
   - 他のテーマ（`themes/github-docs/`, `themes/portfolio/`）で使用されているか確認
   - 使用されていない場合は、C分類に移動するか、ドキュメント化して保持

---

**作成日**: 2025-12-02  
**調査者**: Composer (Cursor AI)
