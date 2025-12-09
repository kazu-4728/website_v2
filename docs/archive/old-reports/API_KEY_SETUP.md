# APIキー設定ガイド

最終更新: 2025-01-XX

## 🔒 セキュリティ重要事項

**APIキーは絶対に外部に漏洩しないようにしてください。**
- 環境変数に設定することを推奨
- `.env` ファイルは `.gitignore` に追加済み
- コードやログにAPIキーを出力しない

## 🔧 APIキーの設定方法

### 方法1: 環境変数に設定（推奨）

```bash
# 一時的に設定（現在のセッションのみ）
export GOOGLE_API_KEY=your_api_key_here

# または
export GEMINI_API_KEY=your_api_key_here
```

### 方法2: .env ファイルに設定

```bash
# .env ファイルを作成（既に .gitignore に追加済み）
echo "GOOGLE_API_KEY=your_api_key_here" >> .env
```

## ✅ API動作確認

APIキーを設定した後、以下のコマンドで動作確認できます：

```bash
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH \
  python3 scripts/test-gemini-api.py
```

## 📝 現在の状態

- **APIキー**: ❌ 未設定
- **google-generativeai**: ✅ インストール済み
- **テストスクリプト**: ✅ 作成済み (`scripts/test-gemini-api.py`)

## 🚀 次のステップ

1. [Google AI Studio](https://makersuite.google.com/app/apikey) でAPIキーを取得
2. 環境変数または `.env` ファイルに設定
3. `scripts/test-gemini-api.py` で動作確認
4. `scripts/search-onsen-images-gemini.py` で画像検索を実行
