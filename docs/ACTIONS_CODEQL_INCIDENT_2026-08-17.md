# Actions / CodeQL incident record — 2026-08-17

## GitHub service status

GitHub公式ステータスは 2026-08-17 に **Partial System Outage** を表示した。

- Status: https://www.githubstatus.com/
- Status API: https://www.githubstatus.com/api/v2/status.json
- 取得時のステータス: `indicator: major`, `description: Partial System Outage`
- インシデントの更新には、Web/API、Git Operations、Pages、Actions、Issues、Pull Requests、Webhooksへの残存影響が記録されている。

## website_v2 CodeQL failure

- 実行ID: `32050839750`
- 対象SHA: `d297e6652514037b0caafc8137c799254c89d8a0`
- 失敗ジョブ: `Analyze (javascript-typescript)` / Job ID `95449561443`
- 失敗ステップ: `Perform CodeQL Analysis`
- 同一実行内の `Analyze (actions)` と `Analyze (python)` は成功。

ログでは CodeQL が JavaScript/TypeScript 77ファイル、JavaScript 51ファイル、GitHub Actions 1ファイルをスキャンし、**raw diagnostic messages は0件**、SARIFエクスポートも成功している。その後の「Uploading code scanning results」で次のエラーが発生した。

> `No server is currently available to service your request. Sorry about that. Please try resubmitting your request and contact us if the problem persists.`

直後に改善済みインクリメンタル解析の失敗が副次的に記録され、次回は当該キャッシュを使わずに実行されると説明されている。主要な失敗地点はコード解析ではなく、CodeQL結果のGitHub側へのアップロードである。

## Repository existence checks

- `git ls-remote --heads origin main`: 成功。`d297e665... refs/heads/main`
- GitHub REST `repos/kazu-4728/website_v2`: 成功。リポジトリは存在し、デフォルトブランチは `main`。
- GitHub REST `user/repos`: 複数のアカウントリポジトリ一覧を取得できた。
