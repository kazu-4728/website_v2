# Contributing

## 📋 作業を開始する前に

**必ず最初に以下を確認してください：**

### 1. 今後の課題を確認
**[`docs/FUTURE_TASKS.md`](./docs/FUTURE_TASKS.md)** を最初に読んでください。
- 現在の課題と優先度が記載されています
- 作業の方向性を理解するために必須です
- このファイルを参照せずに作業を開始しないでください

### 2. アーキテクチャを理解
**[`docs/MASTER_ARCHITECTURE.md`](./docs/MASTER_ARCHITECTURE.md)** で全体構造を把握してください。
- ファイル構造と依存関係が説明されています
- 変更の影響範囲を理解するために重要です

### 3. 関連ドキュメントを確認
作業内容に応じて、以下のドキュメントも参照してください：
- **画像管理**: [`docs/IMAGE_DATA_LOCATION.md`](./docs/IMAGE_DATA_LOCATION.md)
- **画像の問題**: [`docs/IMAGE_ISSUE_REPORT.md`](./docs/IMAGE_ISSUE_REPORT.md)
- **ファイル構造**: [`docs/FILE_STRUCTURE.md`](./docs/FILE_STRUCTURE.md)（存在する場合）

---

## 🔄 作業フロー

1. **課題の確認**
   - `docs/FUTURE_TASKS.md` を開く
   - 作業する課題を選択（優先度を考慮）
   - 関連するドキュメントを確認

2. **環境の準備**
   - リポジトリをクローン
   - `npm install` で依存関係をインストール
   - `npm run dev` でローカル開発サーバーを起動

3. **作業の実施**
   - 小さな変更から始める
   - テストを実行して確認（`npm run test:images`）
   - ビルドが成功することを確認（`npm run build`）

4. **コミットとプッシュ**
   - 変更内容を明確にコミット
   - プッシュ前にビルドが成功することを確認

---

## 🎯 優先度の理解

`docs/FUTURE_TASKS.md` では、課題が以下の優先度で分類されています：

- **🔴 高優先度**: サイトの信頼性に直結する重要な課題
- **🟡 中優先度**: ユーザー体験やパフォーマンスに影響する課題
- **🟢 低優先度**: サイトの価値向上や開発効率向上に関する課題

作業を開始する際は、優先度の高い課題から取り組むことを推奨します。

---

## 📝 コミットメッセージのガイドライン

コミットメッセージは以下の形式を推奨します：

```
[種類]: 簡潔な説明

- 変更内容の詳細
- 関連する課題番号（あれば）
```

例：
```
fix: 温泉画像の検索条件を改善

- 入口・橋・施設などの非温泉画像を除外
- 画像検索スクリプトの検索条件を改善
- 関連: FUTURE_TASKS.md #1
```

---

## 🧪 テスト

作業後は必ずテストを実行してください：

```bash
# 画像関連のテスト
npm run test:images

# すべてのテスト
npm run test:all

# ビルドテスト
npm run build
```

テストが失敗する場合は、`SKIP_CHECK=true npm run build` でビルドをスキップできますが、**本番環境では使用しないでください**。

---

## ❓ 質問や問題がある場合

- まず `docs/FUTURE_TASKS.md` を確認
- 関連するドキュメントを確認
- それでも解決しない場合は、Issueを作成してください

---

# Contributing to Code Voyage

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Code Voyage. These are just guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Code Voyage. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Code Voyage, including completely new features and minor improvements to existing functionality.

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Explain why this enhancement would be useful** to most Code Voyage users.

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible.
- End all files with a newline

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Developer Certificate of Origin (DCO)

All commits must include a DCO sign-off. This can be done by adding a "Signed-off-by" line to your commit message:

```
Signed-off-by: Your Name <your.email@example.com>
```

You can automatically add this to your commits using:

```bash
git commit -s -m "Your commit message"
```

Or configure git to always sign off:

```bash
git config --global format.signoff true
```

For more information, see `.github/DCO_SIGNOFF.md`
