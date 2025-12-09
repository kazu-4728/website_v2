# GitHub Pages設定の修正方法

## 問題の説明

現在、GitHub Pagesが2つの異なるデプロイ方法で設定されているため、エラーが発生しています：

1. ✅ **正常に動作**: カスタムGitHub Actionsワークフロー（`.github/workflows/pages.yml`）
   - Next.jsアプリケーションをビルド
   - 静的ファイルを`web/out`からデプロイ
   - **このワークフローは正常に動作しています**

2. ❌ **エラー発生**: レガシーJekyll自動ビルド（`pages-build-deployment`）
   - GitHub Pagesの古い設定により自動実行
   - 存在しない`/docs`ディレクトリからビルドしようとしている
   - エラー: `No such file or directory @ dir_chdir - /github/workspace/docs`

## 解決方法

GitHub Pagesの設定を「GitHub Actions」に変更する必要があります。

### 手順

1. **リポジトリの設定ページを開く**
   - https://github.com/kazu-4728/web-site/settings/pages にアクセス

2. **Build and deployment セクションを確認**
   - 現在の設定を確認します

3. **Source を変更**
   - **Source**: `GitHub Actions` を選択
   - これにより、レガシーJekyll自動ビルドが無効化されます

4. **保存**
   - 設定を保存すると、次回のpush時からカスタムワークフローのみが実行されます

## 現在の状態

### 正常に動作しているワークフロー

✅ **Deploy to GitHub Pages** (`.github/workflows/pages.yml`)
- 実行履歴: 直近の連続実行がすべて成功
- デプロイ先: https://kazu-4728.github.io/web-site/
- このワークフローは完全に機能しています

### 削除または無効化が必要なワークフロー

❌ **pages-build-deployment** (GitHub自動生成)
- 失敗の原因: `/docs`ディレクトリが存在しない
- このワークフローは不要です

## 確認方法

設定変更後、以下を確認してください：

1. mainブランチに何かをpushする
2. Actions タブで「Deploy to GitHub Pages」ワークフローのみが実行される
3. 「pages-build-deployment」ワークフローが実行されない

## 補足情報

### .nojekyllファイルについて

リポジトリのルートに`.nojekyll`ファイルが既に存在しています。これはJekyllでの処理をスキップするためのファイルですが、GitHub Pagesの設定が「Jekyll自動ビルド」になっている場合は効果がありません。

### カスタムワークフローの利点

カスタムGitHub Actionsワークフロー（現在使用中）には以下の利点があります：

- Next.js 15の最新機能をサポート
- ビルドプロセスを完全に制御可能
- 環境変数による柔軟な設定
- より高速なビルドとデプロイ

## トラブルシューティング

設定変更後もエラーが続く場合：

1. ブラウザのキャッシュをクリア
2. 新しいコミットをpushして、ワークフローを再実行
3. Actions タブで最新の実行ログを確認

---

**注意**: GitHub Pagesの設定変更はリポジトリの管理者権限が必要です。
