# 画像システムドキュメント

このディレクトリには、画像取得・管理システムに関するドキュメントが含まれています。

## 主要ドキュメント

- **[IMAGE_FETCH_GUIDE.md](./IMAGE_FETCH_GUIDE.md)** - 画像取得ガイド（基本）
  - 既存の画像取得システムの説明
  - スクリプトの使用方法
  - トラブルシューティング

- **[MULTI_API_IMAGE_FETCH.md](./MULTI_API_IMAGE_FETCH.md)** - 複数API画像取得システム
  - 複数の無料画像APIを統合した画像取得システム
  - 使用方法とAPIキー設定
  - 精度向上のための検索条件調整

- **[IMAGE_FETCH_RECOMMENDATIONS.md](./IMAGE_FETCH_RECOMMENDATIONS.md)** - 画像取得推奨事項
  - 現在の画像取得状況のまとめ
  - 次のステップの推奨事項
  - APIキー設定のガイド

- **[FREE_IMAGE_APIS.md](./FREE_IMAGE_APIS.md)** - 無料画像API一覧
  - 利用可能な無料画像APIの一覧
  - 各APIの特徴と制限
  - 統合順序の提案

- **[IMAGE_COLLECTION_IMPROVEMENT.md](./IMAGE_COLLECTION_IMPROVEMENT.md)** - 画像収集精度向上
  - 検索精度向上のための改善内容
  - 必須キーワード・除外キーワードの設定

- **[IMAGE_ISSUE_DIAGNOSIS.md](./IMAGE_ISSUE_DIAGNOSIS.md)** - 画像問題の診断
  - 画像が表示されない原因の分析
  - 解決方法の提案

## 関連スクリプト

- `../../scripts/fetch-onsen-images-multi-api.js` - 複数API画像取得スクリプト（推奨）
- `../../scripts/fetch-wikimedia-images.js` - Wikimedia Commons画像取得スクリプト（旧版）

## 画像データ

- `../../data/wikimedia-images.json` - 取得した画像のメタデータ（URL、ライセンス、作者情報）
