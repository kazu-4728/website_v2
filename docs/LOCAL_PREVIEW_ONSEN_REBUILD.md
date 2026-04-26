# 再構築ブランチのローカル確認手順

対象ブランチ: `refactor/onsen-site-rebuild`

このブランチはPRを作らず、温泉紹介サイトとしての大改造を確認するための作業ブランチです。

## 確認手順

```bash
git fetch origin
git switch refactor/onsen-site-rebuild
npm ci
npm run validate:data
npm run dev
```

ブラウザで以下を開きます。

```txt
http://localhost:3000
```

このブランチでは、開発時だけ `basePath` を空にしているため、`/website_v2` を付けずに確認できます。

## 確認するページ

```txt
/
/docs
/docs/hakone-gora
/docs/kusatsu
/docs/kinugawa
/features
/blog
/blog/how-to-choose-onsen
/contact
```

## このブランチで確認したいこと

- 温泉紹介サイトとしてトップページが成立しているか
- 一覧から詳細への導線が自然か
- 写真が温泉サイトとして十分に効いているか
- 画像クレジットが邪魔すぎず、最低限の出典表示になっているか
- 旧テンプレート臭が消えているか
- 問い合わせフォームを出さない判断が違和感ないか

## ビルド確認

```bash
npm run build
```

`npm run build` の前に `npm run validate:data` が自動実行されます。

## 既知の注意点

- この環境では実ブラウザ確認やLighthouse確認は未実施です。
- GitHub Pagesは通常、任意ブランチをそのまま公開プレビューできません。
- オンラインで確認したい場合は、GitHub Pagesのデプロイ先を一時的にこのブランチへ向けるか、別のpreview用workflowを追加する必要があります。
- その操作は公開状態に影響するため、実行前に確認が必要です。

## 次に進めるなら

1. 表示確認
2. 気になる温泉地の追加
3. 画像出典確認済みの候補を追加
4. 一覧ページに絞り込みUIを追加
5. 詳細ページに周辺観光・宿泊導線を追加
6. mainへ取り込むか、別サイトとして公開するか判断
