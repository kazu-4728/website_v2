# Cursor マイシークレッツ使用方法

最終更新: 2025-01-XX

## 📋 現在の状況

- **ユーザー報告**: `GEMINI_API_KEY` を環境変数に設定済み
- **検出状況**: ❌ 現在のシェルセッションでは検出されていません

## 🔍 原因

Cursorのマイシークレッツは、設定したシェルセッションやCursorの設定によっては、現在のシェルセッションの環境変数に自動的に反映されない場合があります。

## ✅ 解決方法

### 方法1: .env ファイルを使用（推奨）

1. Cursorのマイシークレッツから `GEMINI_API_KEY` の値をコピー
2. `.env` ファイルを作成：

```bash
echo "GEMINI_API_KEY=your_api_key_from_cursor_secrets" >> .env
```

3. 読み込んでテスト：

```bash
source .env
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH python3 scripts/test-gemini-api.py
```

### 方法2: 現在のシェルセッションで直接設定

CursorのマイシークレッツからAPIキーをコピーして、現在のシェルセッションで設定：

```bash
export GEMINI_API_KEY=your_api_key_from_cursor_secrets
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH python3 scripts/test-gemini-api.py
```

## 🔒 セキュリティ

- `.env` ファイルは `.gitignore` に追加済み（コミットされません）
- APIキーはコードやログに出力されません
- スクリプトは環境変数から読み取るだけです

## 📝 確認方法

APIキーを設定した後、以下のコマンドで確認できます：

```bash
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH python3 scripts/check-api-key.py
```

このスクリプトは：
- APIキーが設定されているか確認
- Gemini APIの接続をテスト
- **キー自体は出力しません**（セキュリティ対策）

## 🚀 次のステップ

APIキーが正しく設定されれば、以下のコマンドで画像検索を実行できます：

```bash
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH \
  python3 scripts/search-onsen-images-gemini.py
```
