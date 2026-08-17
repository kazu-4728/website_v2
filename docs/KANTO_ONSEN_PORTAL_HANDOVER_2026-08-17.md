# 関東温泉ポータル：画像外部配信・履歴書換え引継ぎ記録

**対象リポジトリ**: `kazu-4728/website_v2`  
**対象ブランチ**: `main`  
**記録作成日**: 2026-08-17  
**最新確認コミット**: `d138d3f` — `docs: add safe recovery for rewritten clones`

## 1. この文書の目的

本書は、関東温泉ポータルの画像管理方式をGitリポジトリ内保存から外部配信へ変更し、そのために実施したGit履歴書換え後の運用・復旧方法を記録するものである。以後このリポジトリを扱う人またはエージェントは、画像バイナリを再追加せず、既存クローンの履歴差異を通常のマージで解消しないこと。

> **最重要事項**: `public/images/` に画像バイナリを追加・コミットしてはならない。画像は外部配信し、出典・ライセンス・著作者・対象説明・配信URLだけを台帳で管理する。

## 2. 実施した変更の時系列

| 時点 | 実施内容 | 結果 |
|---|---|---|
| 初期改善 | 温泉ページの画像、案内、日帰り情報、データ検証を拡充 | 147温泉ページを対象に検証を整備 |
| 公開画像不具合修正 | GitHub Pagesのプロジェクト配下パスに合わせ、ローカル画像URLへベースパスを付与 | 公開サイトの画像参照不具合を解消 |
| 容量問題の確認 | 画像を含む作業ツリーは約86 MiB、Gitオブジェクトは約90.42 MiB | リポジトリ容量問題を確認 |
| 外部配信への移行 | 147件の温泉画像と12件の地域景観画像に外部配信URLを付与 | Wikimedia Commons 156件、Flickr 3件を使用 |
| バイナリ撤去 | `public/images/` を削除し、`.gitignore` へ追加 | 現在のツリーで画像バイナリ0件 |
| 履歴の恒久削除 | `git filter-repo --path public/images/ --invert-paths` で全履歴から画像を除去 | Gitパック容量を約3.86 MiBへ縮小 |
| 既存クローン復旧導線 | 復旧スクリプトと手順書を追加 | 履歴分岐したテストクローンで検証済み |
| 通常操作の再検証 | 通常のコミット・push、CodeQL、Pagesを確認 | 最新コミット `d138d3f` で全て成功 |

## 3. 現在の画像管理構成

| 管理対象 | 場所 | 運用ルール |
|---|---|---|
| 画像の出典・ライセンス・著作者・配信URL | `data/onsen-image-manifest.json` | 承認済み画像はHTTPSの `deliveryUrl` が必須 |
| 温泉画像の表示解決 | `app/lib/onsen-media.ts` | `deliveryUrl` を優先して画面へ返す |
| サイトデータへの画像同期 | `scripts/sync-onsen-images-from-manifest.mjs` | 台帳から全温泉レコードへ外部URLを反映 |
| 画像バイナリの禁止 | `.gitignore` の `/public/images/` | 画像ファイルをGit管理しない |
| 画像移行補助 | `scripts/migrate-onsen-images-to-external-cdn.mjs` と `scripts/migrate-regional-fallbacks-to-external-cdn.mjs` | Commons/Flickrの出典に基づき外部URLを記録 |

現在の外部配信先は `upload.wikimedia.org` が156件、`live.staticflickr.com` が3件である。温泉ページは画像バイナリをGitHub Pagesから配信せず、台帳に記録された外部URLを直接参照する。

## 4. ローカル開発を継続するための手順

### 4.1 新規クローン

新しい開発環境は、通常のGit操作だけで利用できる。

```bash
git clone https://github.com/kazu-4728/website_v2.git
cd website_v2
npm ci
npm run validate:data
npm run build
```

新規クローンでは、画像バイナリを取得しない。外部配信URLを使うため、リポジトリは軽量である。

### 4.2 画像削除前の既存クローン

画像削除前の履歴を持つ既存クローンは、最初の一度だけ現在の履歴へ合わせる必要がある。**先に通常の `git pull` やマージを行ってはならない。** 古い履歴をマージすると、画像を含む履歴を再導入する危険がある。

対象クローンのルートで次を実行する。

```bash
bash scripts/recover-after-history-rewrite.sh
```

このスクリプトは以下を行う。

1. 現在のHEADを `recovery/before-image-history-cleanup-<UTC時刻>` ブランチへ退避する。
2. 未コミット変更と未追跡ファイルをstashへ退避する。
3. `origin/main` を取得し、ローカル `main` を現在の履歴に一致させる。
4. 強制pushを行わず、退避先を表示する。

実行後は通常どおり操作できる。

```bash
git pull
git add -A
git commit -m "変更内容"
git push origin main
```

未コミット変更があった場合は、`git stash list` で確認してから必要な変更だけを戻す。画像バイナリを追加する変更は戻さない。

## 5. 現在の検証状態

| 検証項目 | 状態 |
|---|---|
| `npm run validate:data` | 成功 |
| `node scripts/validate-complete-onsen-portal.mjs` | 147ページ、個別画像147件、リンク327件、リンク切れ0件 |
| GitHub Pages | 最新コミットで成功 |
| CodeQL | 最新コミットで成功 |
| 新規クローン | 成功。画像追跡ファイル0件 |
| 既存クローン復旧スクリプト | 分岐した隔離クローンで成功 |

## 6. CodeQLとGitHubの一時エラーについて

履歴書換えコミット `d297e66` のCodeQL JavaScript/TypeScriptジョブは一度失敗した。しかし、ログ上はTypeScript 77件、JavaScript 51件、Actions 1件の解析とSARIF生成が完了し、診断エラーは0件だった。失敗はGitHubへのコードスキャン結果アップロード時の503である。

その後、通常のコミット `d138d3f` ではCodeQLとPagesがともに成功している。CodeQLの過去の一時失敗を再現・修正するために、アプリケーションコードまたはセキュリティ設定を変更する必要はない。

詳細なログ記録は `docs/ACTIONS_CODEQL_INCIDENT_2026-08-17.md` を参照する。

## 7. 他のエージェントへの作業ルール

1. 画像バイナリをGitリポジトリへ追加しない。新しい画像を使う場合は、ライセンスを確認した外部配信URLを台帳へ記録する。
2. `main` の履歴を再度書き換える必要がある場合は、事前にユーザーの明示承認を得て、既存クローン用の復旧手順を更新する。
3. 既存クローンの非fast-forwardエラーを解消するために、安易な `git pull --allow-unrelated-histories`、通常マージ、または古いブランチのmainへのマージを行わない。
4. 画像台帳を変更したときは `node scripts/sync-onsen-images-from-manifest.mjs`、`npm run validate:data`、`node scripts/validate-complete-onsen-portal.mjs`、`npm run build` を実行する。
5. 外部配信先で画像が取得不能になった場合は、対象画像を別の再利用可能な出典へ差し替え、ライセンスと対象説明を台帳に更新する。

## 8. 関連ファイル

| ファイル | 用途 |
|---|---|
| `docs/RECOVER_EXISTING_CLONES.md` | 既存クローン復旧の短い運用手順 |
| `scripts/recover-after-history-rewrite.sh` | 既存クローンを現在のmainへ安全に揃えるスクリプト |
| `docs/ACTIONS_CODEQL_INCIDENT_2026-08-17.md` | CodeQL一時失敗の根拠ログ |
| `data/onsen-image-manifest.json` | 画像の出典・ライセンス・外部配信URLの台帳 |
| `scripts/migrate-onsen-images-to-external-cdn.mjs` | 個別画像の外部URL移行処理 |
| `scripts/migrate-regional-fallbacks-to-external-cdn.mjs` | 地域景観画像の外部URL移行処理 |

## 9. 結論

リポジトリは、画像バイナリを含まない軽量な状態で正常に使用できる。新規クローンは通常のGit操作で直ちに利用できる。既存クローンは一度だけ復旧スクリプトを実行すれば、その後は通常の `git pull`、`git commit`、`git push` を使える。
