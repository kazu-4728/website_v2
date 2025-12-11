# Cursor / Codex / 各エージェント向けルール

このリポジトリで作業するすべてのエージェントは、以下の2つを**単一の真の仕様源**として扱ってください。

1. `docs/requirements.md` – サイト全体の要件定義
2. `docs/cursor-rules.md` – 開発ルールと運用手順（本書）

## 基本方針
- JSON First アーキテクチャを厳守し、UI文言や構造は `themes/<theme>/texts.json` / `content.json` で管理する。
- 型安全性を最優先し、`npm run lint` と `npm run build` が常に通る状態を保つ。
- main ブランチへの直接 push は禁止（編集と commit は可）。PR 作成・push はリポジトリオーナーの指示を待つ。
- 変更内容は `WORK_LOG.md` に記録し、作業の透明性を確保する。
- 画像は可能な限り実写の温泉写真を使用し、`app/lib/images.ts` に出典・ライセンスを明記する。

## 着手前に読むもの
- `docs/START_HERE.md` – 作業開始チェックリスト
- `docs/requirements.md` – 要件定義
- `docs/FUTURE_TASKS.md` – 優先タスクの確認
- `CONTRIBUTING.md` – コントリビューションフロー

## 作業フロー
1. タスク確認: `docs/FUTURE_TASKS.md` と `docs/requirements.md` を読み、影響範囲を把握する。
2. 実装: JSON First を維持しつつ、型エラー・lint エラーを出さないように変更する。
3. 動作確認: `npm run lint` と `npm run build` を実行し、結果をログに記録する。
4. 記録・コミット: `WORK_LOG.md` を更新し、意図が分かるメッセージでコミットする。push は禁止。

## 編集の指針
- UIテキストはコードにハードコードせず、必ず JSON から取得する。
- 設定ファイルやスキーマを変更する場合は、`docs/requirements.md` と `docs/theme-schema.md` に整合するよう更新する。
- 画像や外部リソースを追加する際は、ライセンス確認とクレジット記載を忘れない。

## 参考リンク
- `.cursorrules` – 既存の共通ルール（本書と内容が矛盾する場合、本書を優先）
- `docs/requirements.md` – プロジェクト全体像と非機能要件
