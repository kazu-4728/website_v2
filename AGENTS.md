# エージェント作業規約

このリポジトリで温泉画像を扱う全てのエージェントは、以下の規約に従うこと。

> **画像バイナリをGitリポジトリ、`public/`、またはGitHub Pagesの成果物へ保存してはならない。**
> 温泉画像は、ライセンスと出典を確認した外部HTTPS配信URLだけで表示する。

## 必須の画像運用

| 対象 | 必須事項 |
|---|---|
| 画像の表示URL | `data/onsen-image-manifest.json` の承認済み `deliveryUrl` を使用する |
| 台帳項目 | `subject`、`sourceUrl`、`license`、`credit`、`deliveryUrl`、`reviewedAt`、`note` を記録する |
| 画像の保存 | ローカルファイルへダウンロードしない。`public/images/` を作成・復活させない |
| 収集時の扱い | 画像候補を調査しても、ファイル本体を取得・保存しない。出典ページと外部配信URLの記録だけを行う |
| レートリミット中 | 画像検索API、画像ダウンロード、URL一括取得を実行しない。既存の承認済み `deliveryUrl` を維持する |

## 明確な禁止事項

次の操作は禁止する。

- `public/images/**`、`static/images/**`、`assets/images/**` に画像バイナリを保存・追加・復活させること。
- Commons、Flickr、Openverse、公式サイトその他から画像ファイルをローカルへダウンロードすること。
- `localPath` を画像台帳へ追加すること、または `deliveryUrl` の代わりに使うこと。
- 画像最適化・サムネイル生成を目的に画像バイナリをリポジトリへ保持すること。
- 既存のGit履歴を書き換えて画像を再導入すること。
- APIがレートリミットまたはエラーを返している間に、再試行ループやバッチ収集を開始すること。

## 変更後の必須検証

画像台帳・温泉データ・表示処理を変更したら、必ず次を実行する。

```bash
npm run validate:data
npm run build
```

`npm run validate:data` は、ローカル画像ファイル、`localPath`、非HTTPSの画像配信URLを検出すると失敗する。検証を回避するための `SKIP_CHECK=true` は禁止する。

## 引継ぎ資料

画像外部配信への移行履歴と、画像削除前の既存クローンを復旧する手順は、次を参照する。

- `docs/KANTO_ONSEN_PORTAL_HANDOVER_2026-08-17.md`
- `docs/RECOVER_EXISTING_CLONES.md`
- `scripts/recover-after-history-rewrite.sh`
