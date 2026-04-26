# GitHub Copilot Agent Instructions

このリポジトリは、JSON駆動の関東温泉ディレクトリです。

## 最優先ルール

- 日本語で対応する。
- サイトの一次データは `data/directory-site.json` のみ。
- データ読み込みは `app/lib/onsen-site.ts` のみ。
- UIは `app/components/site/` を拡張する。
- 主要ルートは `/areas`, `/onsens`, `/purposes`, `/articles`, `/about`。
- `/docs`, `/blog`, `/features`, `/contact` は互換ルート。新規導線では使わない。
- 温泉画像には `src`, `alt`, `credit`, `license`, `sourceUrl` を必ず持たせる。
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

- `themes/**` を復活させる
- `app/components/_legacy/**` をimportする
- `app/components/modern/**` をimportする
- `app/components/_archive/**` をimportする
- `app/lib/content.ts` を復活させる
- `app/lib/images.ts` を復活させる
- `data/onsen-site.json` 前提に戻す
- ダミー問い合わせフォームを作る
- 画像出典なしで温泉候補を追加する
- 公式サイト画像を無断転載する
- `SKIP_CHECK=true` を通常の検証結果として扱う

## 検証

```bash
npm run validate:data
npm run build
```

`validate:data` は、エリア、温泉候補、目的、記事、公式URL、画像メタデータ、slug参照の整合性を確認する。
