# Gemini API 使用状況

最終更新: 2025-01-XX

## 📋 現在の状態

### ✅ インストール済み
- **Python**: 3.12.3
- **google-generativeai**: インストール済み（`/home/ubuntu/.local/lib/python3.12/site-packages`）

### ❌ 未設定
- **GOOGLE_API_KEY**: 環境変数が設定されていません
- **GEMINI_API_KEY**: 環境変数が設定されていません

## 🔧 Gemini APIが使えない理由

1. **APIキーが未設定**
   - `GOOGLE_API_KEY` または `GEMINI_API_KEY` 環境変数が必要
   - APIキーは [Google AI Studio](https://makersuite.google.com/app/apikey) で取得できます

2. **パッケージのパス問題（解決済み）**
   - パッケージは `/home/ubuntu/.local/lib/python3.12/site-packages` にインストール済み
   - PYTHONPATHを設定すればインポート可能

## 🚀 Gemini APIを使用する方法

### 1. APIキーの取得と設定

```bash
# Google AI StudioでAPIキーを取得
# https://makersuite.google.com/app/apikey

# 環境変数に設定
export GOOGLE_API_KEY=your_api_key_here

# または .env ファイルに追加（推奨）
echo "GOOGLE_API_KEY=your_api_key_here" >> .env
```

### 2. スクリプトの実行

```bash
# PYTHONPATHを設定して実行
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH \
  python3 scripts/search-onsen-images-gemini.py
```

## 📝 代替方法

APIキーが設定されていない場合でも、以下の方法で画像を検索できます：

1. **Wikimedia Commons API**: 直接検索（現在試行中）
2. **手動検索**: Wikimedia CommonsのWebサイトで検索
3. **既存の画像パターン**: 既存の画像パターンに基づいて適切な画像を選定

## 🔍 現在の対応

APIキーが設定されていないため、以下の方法で画像を選定しています：

1. **既存の画像パターンに基づく選定**
   - 同じ地域の温泉画像を共有（例：静岡県の温泉は熱海温泉の画像を使用）
   - 実在の温泉画像を優先

2. **Wikimedia Commonsの既存画像を使用**
   - 既に確認済みの実在の温泉画像を使用
   - ライセンス情報を正確に記録

## ⚠️ 注意事項

- APIキーは公開リポジトリにコミットしないでください
- `.env` ファイルは `.gitignore` に追加することを推奨します
- APIキーを設定する場合は、環境変数または `.env` ファイルを使用してください
