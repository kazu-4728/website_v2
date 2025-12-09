# Cursor マイシークレッツ使用ガイド

最終更新: 2025-01-XX

## 📋 概要

Cursorの「マイシークレッツ」機能を使用して、APIキーを安全に管理する方法です。

## 🔒 セキュリティ重要事項

**APIキーは絶対に外部に漏洩しないようにしてください。**
- マイシークレッツに保存したキーは、環境変数として読み込む必要があります
- コードやログにAPIキーを出力しない

## 🔧 Cursor マイシークレッツの使用方法

### 1. マイシークレッツにAPIキーを保存

1. Cursorの設定を開く
2. 「マイシークレッツ」または「Secrets」セクションを開く
3. `GOOGLE_API_KEY` または `GEMINI_API_KEY` としてAPIキーを保存

### 2. 環境変数として読み込む

Cursorのマイシークレッツは、通常は環境変数として自動的に読み込まれますが、明示的に読み込む必要がある場合があります。

**方法1: 現在のシェルセッションで設定**

```bash
# Cursorのシークレット管理機能から取得（Cursorが提供する場合）
export GOOGLE_API_KEY=$(cursor-secrets get GOOGLE_API_KEY)

# または、直接設定
export GOOGLE_API_KEY=your_api_key_here
```

**方法2: .env ファイルを使用**

```bash
# .env ファイルを作成（.gitignoreに追加済み）
echo "GOOGLE_API_KEY=your_api_key_here" >> .env

# 読み込む
source .env
```

## ✅ 動作確認

APIキーを設定した後、以下のコマンドで確認できます：

```bash
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH \
  python3 scripts/check-api-key.py
```

## 📝 現在の状態

- **環境変数の検出**: ❌ GOOGLE_API_KEY / GEMINI_API_KEY が見つかりません
- **google-generativeai**: ✅ インストール済み
- **テストスクリプト**: ✅ 作成済み

## 🚀 次のステップ

1. CursorのマイシークレッツにAPIキーを保存
2. 環境変数として読み込む（上記の方法を参照）
3. `scripts/check-api-key.py` で動作確認
4. `scripts/search-onsen-images-gemini.py` で画像検索を実行

## ⚠️ トラブルシューティング

### マイシークレッツから環境変数が読み込まれない場合

1. **Cursorを再起動**: シークレットの変更を反映するため
2. **明示的に環境変数を設定**: `export GOOGLE_API_KEY=your_key`
3. **.env ファイルを使用**: より確実な方法

### 環境変数が別のシェルセッションで設定されている場合

環境変数は、設定したシェルセッションでのみ有効です。現在のセッションで再度設定する必要があります。
