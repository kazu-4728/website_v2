# Codex / Cursor エージェント向け補足ガイド

このリポジトリでは、エージェント作業時のルールを **`docs/cursor-rules.md`** に集約しています。必ずそちらを最優先で参照してください。

## 作業前に確認するもの
- [`docs/cursor-rules.md`](./cursor-rules.md) — 開発ルールと運用手順の単一ソース
- [`docs/requirements.md`](./requirements.md) — プロジェクト全体の要件定義
- [`docs/START_HERE.md`](./START_HERE.md) — 着手前チェックリスト
- [`docs/FUTURE_TASKS.md`](./FUTURE_TASKS.md) — 直近のタスク一覧

## 作業時のポイント
- JSON First アーキテクチャを徹底し、UIテキストは必ず `content.json` / `texts.json` から取得する。
- `npm run lint` / `npm run build` が通ることを確認し、型安全性を崩さない。
- main ブランチへの直接 push は禁止。コミット後の PR／push はオーナーの指示を待つ。
- `WORK_LOG.md` に作業内容を記録し、変更意図を共有する。
