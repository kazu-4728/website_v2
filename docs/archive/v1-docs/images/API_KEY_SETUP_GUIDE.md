# 画像APIキー設定ガイド

作成日: 2025年1月

## 📋 概要

このドキュメントでは、画像フリーサイトのAPIキーを取得し、環境変数に設定する方法を説明します。

## 🔑 対応API一覧

### 1. Wikimedia Commons API ⭐ **推奨（APIキー不要）**

**特徴**:
- ✅ **APIキー不要** - すぐに使用可能
- ✅ 無料
- ✅ 高品質な画像が多い
- ✅ 日本語対応

**環境変数**: 不要

**APIドキュメント**: https://www.mediawiki.org/wiki/API:Main_page

**使用例**:
```bash
# 環境変数の設定は不要
node scripts/fetch-onsen-images-multi-api.js
```

---

### 2. Pixabay API ⭐ **推奨（APIキー必要）**

**特徴**:
- ✅ 無料プランあり
- ✅ レート制限なし（推奨制限あり）
- ✅ 多様な画像
- ✅ 商用利用可能

**APIキー取得方法**:

1. **Pixabayにアクセス**
   - URL: https://pixabay.com/api/docs/
   - または: https://pixabay.com/ja/service/terms/

2. **アカウント作成**
   - 「Get API Key」または「APIキーを取得」をクリック
   - 無料アカウントを作成（メールアドレスとパスワード）

3. **APIキーを取得**
   - ログイン後、ダッシュボードからAPIキーを確認
   - または: https://pixabay.com/api/docs/ から「Get API Key」をクリック

4. **環境変数に設定**
   ```bash
   export PIXABAY_API_KEY=your_pixabay_api_key_here
   ```

**環境変数名**: `PIXABAY_API_KEY`

**APIドキュメント**: https://pixabay.com/api/docs/

**レート制限**: なし（推奨制限あり）

**使用例**:
```bash
export PIXABAY_API_KEY=12345678-1234-1234-1234-123456789abc
node scripts/fetch-onsen-images-multi-api.js
```

---

### 3. Pexels API

**特徴**:
- ✅ 無料プランあり
- ✅ 200リクエスト/時間
- ✅ 高品質な写真
- ✅ 商用利用可能

**APIキー取得方法**:

1. **Pexelsにアクセス**
   - URL: https://www.pexels.com/api/

2. **アカウント作成**
   - 「Get Started」をクリック
   - 無料アカウントを作成（メールアドレスとパスワード）

3. **APIキーを取得**
   - ログイン後、ダッシュボードからAPIキーを確認
   - または: https://www.pexels.com/api/new/ から新規APIキーを作成

4. **環境変数に設定**
   ```bash
   export PEXELS_API_KEY=your_pexels_api_key_here
   ```

**環境変数名**: `PEXELS_API_KEY`

**APIドキュメント**: https://www.pexels.com/api/documentation/

**レート制限**: 200リクエスト/時間

**使用例**:
```bash
export PEXELS_API_KEY=your_pexels_api_key_here
node scripts/fetch-onsen-images-multi-api.js
```

---

### 4. Unsplash API

**特徴**:
- ✅ 無料プランあり
- ⚠️ 50リクエスト/時間（レート制限が厳しい）
- ✅ 非常に高品質な写真
- ✅ 商用利用可能

**APIキー取得方法**:

1. **Unsplash Developersにアクセス**
   - URL: https://unsplash.com/developers

2. **アカウント作成**
   - 「Register as a developer」をクリック
   - 無料アカウントを作成（メールアドレスとパスワード）

3. **アプリケーションを作成**
   - 「New Application」をクリック
   - アプリケーション名と説明を入力
   - 利用規約に同意

4. **Access Keyを取得**
   - アプリケーション作成後、Access KeyとSecret Keyが表示される
   - **Access Key**を使用（Secret Keyは使用しない）

5. **環境変数に設定**
   ```bash
   export UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

**環境変数名**: `UNSPLASH_ACCESS_KEY`

**APIドキュメント**: https://unsplash.com/documentation

**レート制限**: 50リクエスト/時間

**使用例**:
```bash
export UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
node scripts/fetch-onsen-images-multi-api.js
```

---

## 🔧 環境変数の設定方法

### 方法1: 一時的な設定（現在のセッションのみ）

```bash
# ターミナルで直接設定
export PIXABAY_API_KEY=your_api_key
export PEXELS_API_KEY=your_api_key
export UNSPLASH_ACCESS_KEY=your_api_key

# スクリプトを実行
node scripts/fetch-onsen-images-multi-api.js
```

### 方法2: `.env`ファイルを使用（推奨）

プロジェクトルートに`.env`ファイルを作成:

```bash
# .env
PIXABAY_API_KEY=your_pixabay_api_key_here
PEXELS_API_KEY=your_pexels_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

**注意**: `.env`ファイルは`.gitignore`に含まれているため、Gitにコミットされません。

### 方法3: `.env.local`ファイルを使用

`.env.local`ファイルを作成（`.env`より優先されます）:

```bash
# .env.local
PIXABAY_API_KEY=your_pixabay_api_key_here
PEXELS_API_KEY=your_pexels_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### 方法4: システム環境変数に設定（永続的）

**Linux/macOS**:
```bash
# ~/.bashrc または ~/.zshrc に追加
export PIXABAY_API_KEY=your_api_key
export PEXELS_API_KEY=your_api_key
export UNSPLASH_ACCESS_KEY=your_api_key

# 設定を反映
source ~/.bashrc  # または source ~/.zshrc
```

**Windows (PowerShell)**:
```powershell
# ユーザー環境変数に設定
[System.Environment]::SetEnvironmentVariable('PIXABAY_API_KEY', 'your_api_key', 'User')
[System.Environment]::SetEnvironmentVariable('PEXELS_API_KEY', 'your_api_key', 'User')
[System.Environment]::SetEnvironmentVariable('UNSPLASH_ACCESS_KEY', 'your_api_key', 'User')
```

## 📝 環境変数の確認方法

### 現在の環境変数を確認

```bash
# すべての環境変数を確認
env | grep -E "PIXABAY|PEXELS|UNSPLASH"

# または個別に確認
echo $PIXABAY_API_KEY
echo $PEXELS_API_KEY
echo $UNSPLASH_ACCESS_KEY
```

### スクリプト実行時に確認

`scripts/fetch-onsen-images-multi-api.js`を実行すると、設定されているAPIキーが表示されます:

```
Available APIs:
  - Wikimedia Commons: ✓ (always available)
  - Pixabay: ✓ (set PIXABAY_API_KEY)
  - Pexels: ✗ (set PEXELS_API_KEY)
  - Unsplash: ✗ (set UNSPLASH_ACCESS_KEY)
```

## 🔗 各APIのリンク一覧

### Pixabay
- **ホームページ**: https://pixabay.com/
- **APIドキュメント**: https://pixabay.com/api/docs/
- **APIキー取得**: https://pixabay.com/api/docs/ （「Get API Key」をクリック）
- **利用規約**: https://pixabay.com/ja/service/terms/

### Pexels
- **ホームページ**: https://www.pexels.com/
- **APIドキュメント**: https://www.pexels.com/api/documentation/
- **APIキー取得**: https://www.pexels.com/api/
- **利用規約**: https://www.pexels.com/terms-of-service/

### Unsplash
- **ホームページ**: https://unsplash.com/
- **Developers**: https://unsplash.com/developers
- **APIドキュメント**: https://unsplash.com/documentation
- **APIキー取得**: https://unsplash.com/developers （「Register as a developer」をクリック）
- **利用規約**: https://unsplash.com/license

### Wikimedia Commons
- **ホームページ**: https://commons.wikimedia.org/
- **APIドキュメント**: https://www.mediawiki.org/wiki/API:Main_page
- **APIキー**: 不要

## ⚠️ セキュリティに関する注意事項

1. **APIキーをGitにコミットしない**
   - `.env`ファイルは`.gitignore`に含まれています
   - 環境変数に設定する場合は、Gitにコミットしないように注意

2. **APIキーを公開しない**
   - ChatやログにAPIキーを出力しない
   - 公開リポジトリにAPIキーを含めない

3. **APIキーの管理**
   - 定期的にAPIキーをローテーション（変更）することを推奨
   - 不要になったAPIキーは削除する

## 🚀 推奨設定順序

1. **Wikimedia Commons**（APIキー不要）- すぐに使用可能
2. **Pixabay**（APIキー必要）- レート制限が緩い、推奨
3. **Pexels**（APIキー必要）- 高品質な画像
4. **Unsplash**（APIキー必要）- レート制限が厳しい、最後に設定

## 📚 関連ドキュメント

- [`MULTI_API_IMAGE_FETCH.md`](./MULTI_API_IMAGE_FETCH.md) - 画像取得システムの使い方
- [`IMAGE_MANAGEMENT_SYSTEM.md`](./IMAGE_MANAGEMENT_SYSTEM.md) - 画像管理システムの仕組み
- [`../agent/IMAGE_WORKFLOW.md`](../agent/IMAGE_WORKFLOW.md) - 画像取得ワークフロー
