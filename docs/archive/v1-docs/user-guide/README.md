# ユーザー向けガイド

このディレクトリには、ユーザー（人間）がこのリポジトリを理解・使用する際のガイドが含まれています。

## 📚 ドキュメント一覧

### 設計・計画
- `../design/DESIGN_CONCEPTION_V4.md` - 設計構想（詳細版）
- `../design/DESIGN_CONCEPTION_SUMMARY.md` - 設計構想サマリー
- `../design/UI_DESIGN_V3.md` - UI設計書

### 画像システム
- `../images/MULTI_API_IMAGE_FETCH.md` - 画像取得システムの使い方
- `../images/IMAGE_FETCH_RECOMMENDATIONS.md` - 画像取得の推奨事項
- `../../data/wikimedia-images.json` - 取得した画像のリスト（確認・承認用）

### アーキテクチャ
- `../architecture/MASTER_ARCHITECTURE.md` - アーキテクチャの詳細

## 🖼️ 画像の確認と承認

### 画像取得のワークフロー

1. **エージェントが画像を取得**
   - `scripts/fetch-onsen-images-multi-api.js`を実行
   - 取得した画像は`data/wikimedia-images.json`に保存

2. **ユーザーが画像を確認**
   - 取得した画像のURLを確認
   - 品質・適切性を評価
   - 使用する画像を選択

3. **承認**
   - 使用する画像をエージェントに伝える
   - エージェントがサイトに反映

### 画像の確認方法

`data/wikimedia-images.json`ファイルを開いて、取得した画像のURLを確認できます。

各画像には以下の情報が含まれています：
- `url`: 画像のURL
- `author`: 作者名
- `license`: ライセンス情報
- `title`: 画像のタイトル

## 📝 コンテンツの編集

### テキストの編集
- `themes/onsen-kanto/texts.json`を編集
- すべてのユーザー向けテキストがここで管理されています

### コンテンツ構造の編集
- `themes/onsen-kanto/content.json`を編集
- ページ構成、セクション、コンテンツがここで管理されています

## 🔧 開発環境のセットアップ

詳細は`../START_HERE.md`を参照してください。
