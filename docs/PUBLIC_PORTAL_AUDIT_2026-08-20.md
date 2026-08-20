# 公開ポータル監査記録（2026-08-20）

## 公開ページ

- URL: `https://kazu-4728.github.io/website_v2/?audit=403`
- ページ上の掲載件数表示: 147件
- ページ内の都県別掲載数: 茨城17、群馬23、埼玉23、神奈川18、千葉25、東京24、栃木17。

## 画像の実測

公開ページの最初の20枚の画像をDOMで確認した。先頭14枚は `upload.wikimedia.org` から読み込み成功し、`naturalWidth` が500〜6016であった。一方、少なくとも以下の画像はDOM取得時点で `complete: false`、`naturalWidth: 0` であった。

- `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Arima_Dam_%283892122359%29.jpg/1920px-Arima_Dam_%283892122359%29.jpg?...`

このため、外部配信URLの一部について公開ページで読み込み失敗が実際に発生している。HTTP状態は別途監査する。

## リンクの実測

袋田温泉のカードでは、以下の3つの主導線は異なるURLであった。

| 導線 | URL |
|---|---|
| 詳細を見る | `/website_v2/onsens/fukuroda-onsen/` |
| 公式サイト | `https://www.daigo-kanko.jp/` |
| Googleマップ | `https://www.google.com/maps/search/?api=1&query=袋田温泉 茨城県` |

ただし、カード内の「周辺施設・探し方」には、施設の公式情報を持たずGoogleマップ検索URLを「案内」と「地図」の両方へ設定しているレコードがある。これはユーザー指摘の重複導線に該当するため、全件監査と修正が必要である。

## 掲載件数

現在の `data/directory-site.json` は147レコードであり、2026-08-17の拡張後から増加していない。直近の画像外部配信・再発防止のコミットはページ追加作業ではない。
