# 公開反映・表示確認記録

確認日時: 2026-08-21
対象コミット: `fb30e85`（`feat: add 4 Tokyo day-trip onsen pages (151 total)`）

## GitHub Pages デプロイ

GitHub Actionsの「Deploy to GitHub Pages」は、上記コミットに対するpush実行として成功したことを確認した。公開一覧ページ `https://kazu-4728.github.io/website_v2/onsens` は、見出しで **151件の温泉候補** を表示した。

## 新規ページの実機表示

`https://kazu-4728.github.io/website_v2/onsens/tokyo-toyosu-manyo-club/` をブラウザで確認した。ページ名、公式サイト、Googleマップ、料金・営業案内、詳細訪問案内、日帰り案内、画像クレジットが表示された。

ヒーロー画像として設定したWikimedia Commonsの外部URLはブラウザで読込完了し、`naturalWidth: 1280`、`naturalHeight: 847` を確認した。ローカル画像ファイルは使用していない。

有明・多摩百草・荻窪の画像は、同ページ下部の関連カードに対する遅延読込対象であり、この表示時点ではビューポート外のため未読込だった。これは表示領域外の画像を節約する通常の遅延読込挙動であり、画像URLは外部配信URLとしてDOMに設定されている。

## 品質検証

| 検証項目 | 結果 |
|---|---|
| サイトデータ検証 | 成功 |
| 画像・網羅台帳検証 | 151件で成功 |
| 外部画像ポリシー | 承認・追跡済み163アセット、ローカル画像ファイルなし |
| URL監査 | 513 URL、未解決結果なし |
| Next.js本番ビルド | 成功、336ページ静的生成 |

注記: 画像の閲覧時はWikimedia Commons等の外部CDNに接続する。画像バイナリはGit履歴および作業ツリーへ追加していない。
