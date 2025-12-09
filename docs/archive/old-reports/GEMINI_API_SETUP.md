# Gemini API セットアップガイド

最終更新: 2025-01-XX

## 📋 概要

Gemini APIを使用して、各温泉地の実在の温泉（湯船・露天風呂）が映っている画像を検索するためのセットアップガイドです。

## 🔧 セットアップ手順

### 1. Gemini APIキーの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. APIキーを生成
3. 環境変数に設定：
   ```bash
   export GOOGLE_API_KEY=your_api_key_here
   ```
   または `.env` ファイルに追加：
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

### 2. Pythonパッケージのインストール

```bash
pip3 install google-generativeai
```

### 3. スクリプトの実行

```bash
python3 scripts/search-onsen-images-gemini.py
```

## 📝 使用方法

スクリプトは以下の温泉地の画像を検索します：
- 那須温泉
- 水上温泉
- 伊東温泉
- 修善寺温泉
- 下田温泉
- 湯河原温泉

結果は `data/gemini-image-search-results.json` に保存されます。

## ⚠️ 注意事項

- APIキーは環境変数に設定する必要があります
- APIキーは公開リポジトリにコミットしないでください
- レート制限に注意してください

## 🔍 現在の状態

- **Python**: ✅ インストール済み (Python 3.12.3)
- **google-generativeai**: ❌ 未インストール
- **GOOGLE_API_KEY**: ❌ 未設定

## 📝 次のステップ

1. Gemini APIキーを取得
2. 環境変数に設定
3. `pip3 install google-generativeai` でパッケージをインストール
4. スクリプトを実行して画像を検索
