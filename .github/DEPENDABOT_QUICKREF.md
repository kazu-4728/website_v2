# Dependabot クイックリファレンス 🚀

## ⚠️ 初回セットアップ（重要）

まず、以下のGitHubラベルを作成してください：
- `dependencies` (紫: #8b5cf6)
- `security` (赤: #d73a4a)
- `github-actions` (黒: #000000)

詳細: `.github/CREATE_LABELS.md` を参照

## 📅 スケジュール
- **npm依存関係**: 月次（毎月第1月曜日 00:00 JST）
- **GitHub Actions**: 月次（毎月第1月曜日 00:00 JST）

## 📊 PR制限
- npm: 最大3個
- Actions: 最大1個

## 🎯 グルーピング

### 1. all-dependencies（統合PR）
- マイナー・パッチ更新を全て含む
- 月1回の大規模更新PR

### 2. security-updates（セキュリティ専用PR）
- セキュリティ更新のみ
- 最優先で対応

## ⚡ クイックコマンド

### 既存PRをすべてクローズ
```bash
./scripts/manage-dependabot-prs.sh
# → オプション1を選択
```

### セキュリティPRを確認
```bash
gh pr list --label security --author app/dependabot
```

### 特定のPRをクローズ
```bash
gh pr close <PR番号> --comment "理由を記入"
```

### PRをマージ
```bash
gh pr merge <PR番号> --squash
```

## 📋 月次チェックリスト
- [ ] Dependabot PRが作成されたか確認
- [ ] 破壊的変更がないかCHANGELOGを確認
- [ ] テストが通るか確認
- [ ] セキュリティPRを優先的にマージ
- [ ] 統合PRをレビューしてマージ

## 🔴 セキュリティ更新が来たら
1. 即座にPRを確認
2. テストが通ることを確認
3. 優先的にマージ
4. デプロイを確認

## 📚 詳細ドキュメント
- 運用ガイド: `.github/DEPENDABOT_MANAGEMENT.md`
- 変更内容: `.github/DEPENDABOT_CHANGES.md`
- 設定ファイル: `.github/dependabot.yml`

## 🛠️ トラブルシューティング

### PRが多すぎる
→ `.github/dependabot.yml`で`open-pull-requests-limit`を減らす

### 更新が遅い
→ 緊急時は手動で`npm update`を実行

### メジャーバージョンを更新したい
→ 手動で`npm install <package>@latest`を実行

## 💡 Tips
- セキュリティ更新は別PRで即座に対応
- 統合PRは月1回まとめて対応
- メジャー更新は慎重に手動で実施
- 管理スクリプトで効率的に操作

---
最終更新: 2025-12-16
