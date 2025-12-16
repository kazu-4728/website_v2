# GitHub ラベルの作成手順

## 問題

Dependabot が以下のラベルが見つからないというエラーを出しています：
- `dependencies`
- `security`
- `github-actions`

## 解決方法

以下の手順でラベルを作成してください：

### 方法1: GitHub Web UI で作成（推奨）

1. リポジトリのページに移動: https://github.com/kazu-4728/website_v2
2. 「Issues」タブをクリック
3. 「Labels」をクリック
4. 「New label」ボタンをクリック
5. 以下のラベルを1つずつ作成：

#### `dependencies` ラベル
- **Name**: `dependencies`
- **Description**: `Dependencies` または `依存関係の更新`
- **Color**: `#8b5cf6` (紫色) または任意の色

#### `security` ラベル
- **Name**: `security`
- **Description**: `Security updates` または `セキュリティ更新`
- **Color**: `#d73a4a` (赤色) または任意の色

#### `github-actions` ラベル
- **Name**: `github-actions`
- **Description**: `GitHub Actions` または `GitHub Actionsの更新`
- **Color**: `#000000` (黒色) または任意の色

### 方法2: GitHub CLI で作成

```bash
gh label create "dependencies" --color "8b5cf6" --description "依存関係の更新" --repo kazu-4728/website_v2
gh label create "security" --color "d73a4a" --description "セキュリティ更新" --repo kazu-4728/website_v2
gh label create "github-actions" --color "000000" --description "GitHub Actionsの更新" --repo kazu-4728/website_v2
```

### 方法3: GitHub API で作成

```bash
# dependencies ラベル
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/kazu-4728/website_v2/labels \
  -d '{"name":"dependencies","color":"8b5cf6","description":"依存関係の更新"}'

# security ラベル
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/kazu-4728/website_v2/labels \
  -d '{"name":"security","color":"d73a4a","description":"セキュリティ更新"}'

# github-actions ラベル
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/kazu-4728/website_v2/labels \
  -d '{"name":"github-actions","color":"000000","description":"GitHub Actionsの更新"}'
```

## ラベル作成後

ラベルを作成したら、PR #24 のエラーは自動的に解消されます。Dependabot は次回の更新時にこれらのラベルを使用できるようになります。

## 参考

- [GitHub Labels ドキュメント](https://docs.github.com/ja/issues/using-labels-and-milestones-to-track-work/managing-labels)
- [Dependabot 設定オプション](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#labels)
