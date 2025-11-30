# リファクタリング計画書

## 1. 現状調査：JSON起点 vs ハードコーディング部分

### ✅ JSON起点（`themes/onsen-kanto/content.json`から読み込まれている）

#### サイト基本情報
- `site.name`: "関東温泉紀行"
- `site.tagline`: "Kanto Onsen Journey"
- `site.description`: サイト説明文
- `site.logo.text`: "温泉紀行"
- `site.logo.icon`: "flame"（ただし、実際には使用されていない）

#### ナビゲーション
- `navigation`: 配列で定義されているが、**Header.tsxでは使用されていない**

#### ホームページ
- `pages.home.hero`: タイトル、サブタイトル、説明、背景画像、アクションボタン
- `pages.home.sections`: セクション配列（split-feature, grid-gallery, testimonials, cta-fullscreen）

#### ドキュメントページ
- `pages.docs`: 配列で各温泉地の情報を定義

#### ブログ・フィーチャー・コンタクト
- `pages.blog`: ブログ投稿一覧
- `pages.features`: フィーチャーページ情報
- `pages.contact`: コンタクト情報

### ❌ ハードコーディング部分

#### ヘッダー（`app/components/navigation/Header.tsx`）
- **ナビゲーション項目**: `navigation`配列がハードコーディング（13-26行目）
  - "Home", "Journey", "Blog", "Showcase"など
  - サブメニューもハードコーディング
- **ロゴ**: `RocketIcon`と"Code Voyage"がハードコーディング（50-53行目）
- **CTAボタン**: "Join Us"がハードコーディング（91-95行目）

#### レイアウト（`app/layout.tsx`）
- **メタデータ**: "GitHub Docs 完全マニュアル"がハードコーディング（2-4行目）

#### アイコン
- `app/components/icons/index.tsx`: すべてのアイコンがハードコーディング
- `RocketIcon`が使用されているが、JSONの`logo.icon: "flame"`は未使用

#### その他
- `config/site.config.ts`: 別途設定ファイルがあるが、実際には使用されていない
- テーマ切り替え機能: `app/lib/content.ts`に実装されているが、現状は不要

---

## 2. JSON-first構造案

### ターゲット構造

```
themes/onsen-kanto/content.json
├── site
│   ├── name: サイト名
│   ├── tagline: タグライン
│   ├── description: 説明
│   ├── logo
│   │   ├── text: ロゴテキスト
│   │   ├── icon: アイコン名（"flame"など）
│   │   └── image: 画像パス（オプション）
│   └── metadata
│       ├── title: HTMLタイトル
│       └── description: メタ説明
├── navigation: ナビゲーション配列（既存）
├── pages
│   ├── home: ホームページ（既存）
│   ├── docs: ドキュメント（既存）
│   ├── blog: ブログ（既存）
│   ├── features: フィーチャー（既存）
│   └── contact: コンタクト（既存）
```

### 設計方針

1. **単一JSONファイル**: `themes/onsen-kanto/content.json`を唯一の情報源とする
2. **型安全性**: TypeScript型定義でJSONスキーマを保証
3. **アイコンマッピング**: アイコン名から実際のコンポーネントへのマッピング関数を作成
4. **サーバーコンポーネント優先**: 可能な限りサーバーコンポーネントでJSONを読み込み、クライアントコンポーネントにpropsで渡す

### 実装ステップ

#### ステップ1: ヘッダーの完全JSON制御
- `content.json`の`navigation`を実際に使用
- `site.logo`からロゴとアイコンを表示
- メタデータもJSONから読み込み

#### ステップ2: トップページのキービジュアルとセクション
- 既にJSON起点だが、確認と最適化
- 画像パスの管理方法を明確化

---

## 3. ステップ1実装計画：ヘッダーのJSON制御

### 変更ファイル
1. `themes/onsen-kanto/content.json`: `site.metadata`を追加
2. `app/lib/content.ts`: 型定義を更新
3. `app/components/navigation/Header.tsx`: JSONからデータを読み込むように変更
4. `app/layout.tsx`: メタデータをJSONから読み込むように変更
5. `app/components/icons/index.tsx`: アイコンマッピング関数を追加

### Before/After

#### Before
- ヘッダーのナビゲーションがハードコーディング
- ロゴが"Code Voyage"固定
- メタデータが"GitHub Docs 完全マニュアル"固定

#### After
- すべてのヘッダー要素がJSONから制御可能
- `content.json`の`navigation`配列をそのまま使用
- `site.logo`からロゴテキストとアイコンを表示
- `site.metadata`からメタデータを読み込み

### JSON編集ガイド（ステップ1後）
- **ナビゲーション変更**: `content.json`の`navigation`配列を編集
- **ロゴ変更**: `content.json`の`site.logo.text`と`site.logo.icon`を編集
- **サイトタイトル変更**: `content.json`の`site.metadata.title`を編集

---

## 4. ステップ2実装計画：トップページの最適化

### 変更ファイル
1. `themes/onsen-kanto/content.json`: 必要に応じて構造を調整
2. `app/page.tsx`: 既にJSON起点だが、確認と最適化

### Before/After

#### Before
- 既にJSON起点だが、画像パスが外部URL（Unsplash）
- セクション構成はJSONで制御されている

#### After
- 画像パスの管理方法を明確化（`public/images/`へのパスもサポート）
- セクション構成は引き続きJSONで制御

### JSON編集ガイド（ステップ2後）
- **ヒーロー画像変更**: `content.json`の`pages.home.hero.bgImage`を編集
- **セクション追加/削除**: `content.json`の`pages.home.sections`配列を編集
- **セクション内容変更**: 各セクションオブジェクトのプロパティを編集
