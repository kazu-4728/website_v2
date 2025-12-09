# スクリプトガイド

このディレクトリには、各種スクリプトの使用方法に関するドキュメントが含まれています。

## 画像取得スクリプト

詳細は [`../images/README.md`](../images/README.md) を参照してください。

### 推奨スクリプト

- **`fetch-onsen-images-multi-api.js`** - 複数の無料画像APIを統合した画像取得スクリプト
  - Wikimedia Commons（APIキー不要）
  - Pixabay（APIキー必要）
  - Pexels（APIキー必要）
  - Unsplash（APIキー必要）

### 使用方法

```bash
# 環境変数を設定（オプション）
export PIXABAY_API_KEY=your_api_key
export PEXELS_API_KEY=your_api_key
export UNSPLASH_ACCESS_KEY=your_api_key

# スクリプトを実行
node scripts/fetch-onsen-images-multi-api.js
```

## その他のスクリプト

- `check-images.js` - 画像リンク切れチェック
- `check-links.js` - 内部リンク切れチェック
- `generate-readme.js` - README自動生成
- `generate-page.js` - ページテンプレート生成
