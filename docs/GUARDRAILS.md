# ガードレール（禁止事項・検証手順）

このドキュメントは、website_v2プロジェクトの技術的制約と検証手順を定義します。

## 禁止事項

### 1. 外部URLの使用禁止（Stockデータ）

**禁止**: `data/onsen-catalog.json`の`images`フィールドに`http://`または`https://`で始まるURLを含めること

**理由**: GitHub Pagesの静的exportでは外部リソースへの依存を避ける必要がある

**検証**: `npm run verify:assets-policy`で自動検出

**例外**: なし（すべてローカルパス `/images/...` を使用）

### 2. 握りつぶし禁止

以下のような「エラーを隠す」実装は禁止：

- `ignoreBuildErrors: true`（next.config.mjs）
- `|| true`（コマンドの強制成功）
- try-catchでのエラー丸飲み（ログも出さずに握りつぶす）
- ESLint/TypeScriptの無効化（`@ts-ignore`, `eslint-disable`の乱用）

**理由**: ビルドエラーを隠すと、本番環境で予期しない問題が発生する

**検証**: コードレビュー、ビルドログの確認

### 3. UIコンポーネント内でのファイルシステムアクセス禁止

**禁止**: UIコンポーネント（`src/ui/`配下）から`fs`モジュールを直接インポート・使用すること

**理由**: UI層は純粋な表示ロジックに徹し、データ取得はRepository層（server-only）に委譲する

**検証**: `grep -r "import.*fs" src/ui/`で検出

### 4. JSON-First原則違反

**禁止**: ページコンポーネント内でデータを直書きすること

**必須**: すべての表示データは`data/onsen-catalog.json`（SSOT）から読み込む

**理由**: データの一元管理と保守性の向上

**検証**: コードレビュー

## 検証コマンド

### ビルド前検証（自動実行）

```bash
npm run prebuild
```

以下の検証を実行：
1. `detect-hardcoded-urls.js`: ハードコードされた外部URLの検出
2. `verify-assets-policy.mjs`: アセットポリシー違反の検出

### 手動検証コマンド

#### アセットポリシー検証

```bash
npm run verify:assets-policy
```

検証内容：
- `onsen-catalog.json`の`images`フィールドに外部URLがないか
- 参照されている画像ファイルが存在するか
- スロット規約（hero/onsen/rooms/cuisine/gallery-01..04）に準拠しているか
- 疑似画像（126バイト等のHTML保存）が混入していないか

#### ハードコードURL検出

```bash
npm run lint:hardcode
```

`app/`, `components/`, `themes/`配下のコードから外部URLを検出

#### 画像存在確認

```bash
npm run verify:assets-exist
```

参照されている画像ファイルの存在確認

### ビルド検証

```bash
npm run build
```

静的exportの成功確認

```bash
npm run export
```

`out/`ディレクトリの生成確認

### ローカル開発サーバー

```bash
npm run dev
```

開発サーバー起動（`http://localhost:3000`）

## アーキテクチャ原則

### JSON-First / "JSONfast" アーキテクチャ

```
[SSOT(JSON)] → [Domain(型/正規化/検証)] → [Query(検索/フィルタ)] → [UI(ページ/コンポーネント)]
```

1. **SSOT**: `data/onsen-catalog.json`が唯一の真実の源
2. **Domain層**: 型定義・正規化・検証ロジック
3. **Features層**: ユースケース・クエリ（Repositoryはserver-only）
4. **UI層**: 純粋な表示ロジック（副作用・IOを持たない）

### 責務分離

- **Domain層** (`src/domain/onsen/`): データ構造の定義・検証・正規化
- **Features層** (`src/features/onsen/`): ビジネスロジック・データ取得（server-only）
- **UI層** (`src/ui/`): 表示コンポーネント（純粋関数）

### basePath管理

- **開発環境**: `NEXT_PUBLIC_BASE_PATH=''`（.env.local）
- **本番環境**: `NEXT_PUBLIC_BASE_PATH='/website_v2'`（GitHub Pages用）

設定は`next.config.mjs`で環境変数から読み取る（一元管理）

## トラブルシューティング

### ビルドエラー: "External URL detected"

**原因**: `onsen-catalog.json`の`images`フィールドに外部URLが含まれている

**解決策**: 
1. 外部URLを削除
2. ローカル画像パス（`/images/onsen/{slug}/{slot}.jpg`）に置き換え
3. 画像ファイルを`public/images/onsen/{slug}/`に配置

### ビルドエラー: "File does not exist"

**原因**: `onsen-catalog.json`で参照されている画像ファイルが存在しない

**解決策**:
1. 画像ファイルを配置する
2. または、プレースホルダ画像（`/images/placeholders/{slot}.jpg`）を使用

### 404エラー（GitHub Pages）

**原因**: basePath設定の不一致

**解決策**:
1. `.env.production`に`NEXT_PUBLIC_BASE_PATH='/website_v2'`を設定
2. `next.config.mjs`が環境変数を正しく読み取っているか確認
3. `app/lib/base-path.ts`の`withBasePath()`関数が正しく動作しているか確認

## 関連ドキュメント

- [IMAGE_ATTRIBUTION.md](./IMAGE_ATTRIBUTION.md): 画像の帰属情報
- [SINGLE_TRUTH.md](./SINGLE_TRUTH.md): SSOT原則の詳細
