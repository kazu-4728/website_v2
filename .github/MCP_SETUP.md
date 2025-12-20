# MCP サーバー設定ガイド

このファイルは、GitHub Copilot のための Model Context Protocol (MCP) サーバー設定です。

## 📋 設定されているMCPサーバー

### 1. Filesystem Server 📁
**用途**: ファイルシステムへのアクセス

**アクセス可能なディレクトリ**:
- `docs/` - ドキュメント
- `themes/` - テーマ設定
- `data/` - データファイル（画像メタデータなど）
- `public/images/` - 画像ファイル

**使用例**:
- ドキュメントの検索・参照
- テーマファイルの編集
- 画像メタデータの確認

---

### 2. Brave Search Server 🔍
**用途**: Web検索機能

**機能**:
- リアルタイムのWeb検索
- 最新情報の取得
- 温泉地の情報収集
- ベンチマークサイトの調査

**必要な環境変数**:
```bash
BRAVE_API_KEY=your_api_key_here
```

**API キーの取得方法**:
1. [Brave Search API](https://brave.com/search/api/) にアクセス
2. アカウント作成とAPI キー発行
3. 環境変数に設定

**使用例**:
```
「箱根温泉の最新情報を検索」
「ベンチマークサイト あえの風 のデザイン」
```

---

### 3. Fetch Server 🌐
**用途**: HTTP リクエストの実行

**機能**:
- Wikimedia Commons API からの画像取得
- 外部APIの呼び出し
- Web ページの取得

**使用例**:
- Wikimedia Commons から温泉画像を取得
- API エンドポイントのテスト
- 画像メタデータの取得

---

## 🚀 使用方法

### ローカル開発環境

1. **環境変数の設定** (`.env.local`)
```bash
# Brave Search API (任意)
BRAVE_API_KEY=your_brave_api_key_here
```

2. **Copilot の起動**
   - VS Code または GitHub Copilot を起動
   - MCPサーバーが自動的に起動します

### GitHub Actions / CI 環境

**注意**: MCPサーバーはローカル開発環境向けの機能です。GitHub Actions などのCI環境では使用できません。

---

## 🎯 プロジェクト固有の使用例

### 画像収集タスク

```
Copilot に依頼:
「Wikimedia Commons から箱根温泉の露天風呂画像を検索して、
data/wikimedia-images.json に追加してください」
```

MCPサーバーの動作:
1. **Fetch Server**: Wikimedia Commons API を呼び出し
2. **Filesystem Server**: `data/wikimedia-images.json` を読み込み
3. **Filesystem Server**: 新しい画像情報を追加して保存

---

### ベンチマークサイト調査

```
Copilot に依頼:
「あえの風のようなベンチマークサイトのUI/UXデザインを調査して、
参考になるポイントをまとめてください」
```

MCPサーバーの動作:
1. **Brave Search**: 「あえの風 温泉サイト デザイン」で検索
2. **Fetch Server**: サイトの情報を取得
3. **Filesystem Server**: `docs/` にレポートを保存

---

### ドキュメント参照

```
Copilot に依頼:
「AGENT_MASTER_GUIDE.md に書かれている画像最適化の手順を教えてください」
```

MCPサーバーの動作:
1. **Filesystem Server**: `docs/AGENT_MASTER_GUIDE.md` を読み込み
2. 該当箇所を抽出して回答

---

## ⚠️ 制限事項と注意点

### セキュリティ
- **APIキーを Git にコミットしないこと**
- `.env.local` は `.gitignore` に含まれています
- 環境変数を使用してAPIキーを管理

### パフォーマンス
- MCPサーバーはローカル環境でのみ動作
- 複数のサーバーが同時に起動するため、リソースを消費
- 不要なサーバーは無効化を検討

### トラブルシューティング

#### MCPサーバーが起動しない
```bash
# npx のキャッシュをクリア
npm cache clean --force

# MCPサーバーのパッケージを手動インストール
npx -y @modelcontextprotocol/server-filesystem
```

#### API キーエラー
```bash
# 環境変数が設定されているか確認
echo $BRAVE_API_KEY

# .env.local に正しく設定されているか確認
cat .env.local
```

---

## 📚 参考リンク

- [Model Context Protocol 公式ドキュメント](https://modelcontextprotocol.io/)
- [GitHub Copilot MCP サポート](https://docs.github.com/en/copilot)
- [Brave Search API](https://brave.com/search/api/)
- [Wikimedia Commons API](https://commons.wikimedia.org/wiki/Commons:API)

---

## 🔧 カスタマイズ

### 追加のディレクトリへのアクセス

`copilot-mcp.json` の `filesystem` セクションに追加:
```json
{
  "mcpServers": {
    "filesystem": {
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/additional/directory"
      ]
    }
  }
}
```

### 他のMCPサーバーの追加

利用可能なMCPサーバー:
- `@modelcontextprotocol/server-github` - GitHub API
- `@modelcontextprotocol/server-postgres` - PostgreSQL
- `@modelcontextprotocol/server-slack` - Slack

追加方法:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

**最終更新**: 2025年12月20日
