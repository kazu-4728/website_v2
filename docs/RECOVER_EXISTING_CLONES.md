# 既存クローンの復旧手順

このリポジトリでは、ライセンス済み画像バイナリをGit履歴から恒久的に除去しました。そのため、画像削除前の履歴を持つ既存クローンで `git pull` や `git push` を実行すると、履歴の分岐により non-fast-forward エラーが発生します。これは現在の `main` が壊れていることを意味せず、既存クローンを一度だけ新しい履歴へ合わせる必要があることを意味します。

> 新規にクローンした環境は通常どおり利用できます。既存クローンだけが、下記の一回限りの移行対象です。

## 安全な復旧

まず、対象クローンのルートで作業します。未コミットの変更、ローカルコミット、移行前のHEADは、復旧スクリプトがそれぞれstashと `recovery/` ブランチへ退避します。

```bash
cd /path/to/website_v2
bash scripts/recover-after-history-rewrite.sh
```

スクリプトが完了すると、ローカルの `main` は `origin/main` と一致します。その後は、通常どおりコミットとpushを実行できます。

```bash
git add -A
git commit -m "your change"
git push origin main
```

未コミット変更があった場合は、自動適用ではなくstashへ退避します。`git stash list` で内容を確認し、必要な変更だけを選んで適用してください。画像バイナリを再追加する変更は、外部配信方針に反するため適用しません。

## 新規クローン

新しい作業環境では次の通常手順だけで利用できます。

```bash
git clone https://github.com/kazu-4728/website_v2.git
cd website_v2
npm ci
```

## 画像の管理方針

画像本体は `public/images/` に保存しません。画像の出典、ライセンス、著作者、対象説明、外部配信URLは `data/onsen-image-manifest.json` に記録します。画像ファイルの再コミットを防ぐため、`/public/images/` は `.gitignore` に含まれています。
