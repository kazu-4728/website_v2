# AIエージェント作業ルール

対象: `kazu-4728/website_v2`

このリポジトリは、JSON駆動の関東温泉ディレクトリです。温泉地・温泉施設を、エリア、目的、公式サイト導線、画像クレジット付きで比較できる構成にします。

## 最重要方針

- サイトの一次データは `data/directory-site.json` のみ。
- データ読み込みは `app/lib/onsen-site.ts` のみ。
- UIは `app/components/site/` を拡張する。
- 主要ルートは `/areas`, `/onsens`, `/purposes`, `/articles`, `/about`。
- `/docs`, `/blog`, `/features`, `/contact` は互換ルート。新規導線では使わない。
- 温泉画像には必ず `src`, `alt`, `credit`, `license`, `sourceUrl` を持たせる。
- 温泉画像は `data/onsen-image-manifest.json` の承認済みHTTPS `deliveryUrl` だけで表示する。画像バイナリは保存しない。
- 公式サイト画像は、利用許諾が確認できない限り転載しない。公式サイトは `officialUrl` としてリンクに使う。

## 変更してよい主なファイル

```txt
data/directory-site.json
app/lib/onsen-site.ts
app/components/site/**
app/page.tsx
app/areas/**
app/onsens/**
app/purposes/**
app/articles/**
app/about/**
app/sitemap.ts
app/robots.ts
scripts/validate-onsen-site-data.mjs
```

## 互換ルート

以下は古いURLを壊さないためだけに残す。

```txt
app/docs/**
app/blog/**
app/features/page.tsx
app/contact/page.tsx
```

新規UI・新規リンクでは使わない。

## 禁止

```txt
app/components/_legacy/** をimportする
app/components/modern/** をimportする
app/components/_archive/** をimportする
themes/** を復活させる
app/lib/content.ts を復活させる
app/lib/images.ts を復活させる
data/onsen-site.json 前提に戻す
送信されない問い合わせフォームを置く
画像出典なしで温泉候補を追加する
公式サイト画像を無断転載する
`public/images/**`、`static/images/**`、`assets/images/**` に画像バイナリを保存・追加・復活させる
画像台帳に `localPath` を追加する、または `deliveryUrl` の代わりに使う
Commons、Flickr、Openverse、公式サイトその他から画像ファイルをローカルへダウンロードする
レートリミットまたはAPIエラーの間に画像収集・ダウンロード・再試行バッチを実行する
画像削除後のGit履歴を再導入する
```

## 検証

```bash
npm run validate:data
npm run build
```

`npm run validate:data` は、エリア、温泉候補、目的、記事、公式URL、画像メタデータ、slug参照の整合性に加え、ローカル画像・`localPath`・非HTTPSの画像配信URLを拒否します。

## コミット方針

- コミットメッセージは日本語。
- UI変更は、何を変えたかを本文に書く。
- 旧資産に戻す変更は禁止。
