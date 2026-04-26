# GitHub Copilot Agent Instructions

このリポジトリは、JSON駆動の関東温泉紹介サイトです。

## 最優先ルール

- 日本語で対応する。
- サイトの一次データは `data/onsen-site.json` のみ。
- データ読み込みは `app/lib/onsen-site.ts` のみ。
- UIは `app/components/site/` のみを使う。
- `themes/**`、`app/components/_legacy/**`、`app/components/modern/**`、旧 `app/lib/content.ts`、旧 `app/lib/images.ts` を復活させない。
- 問い合わせフォームはまだ作らない。送信されないフォームは禁止。
- 温泉画像には `src`, `alt`, `credit`, `license`, `sourceUrl` を必ず持たせる。

## 変更してよい主なファイル

```txt
data/onsen-site.json
app/lib/onsen-site.ts
app/components/site/**
app/page.tsx
app/docs/page.tsx
app/docs/[slug]/page.tsx
app/blog/page.tsx
app/blog/[slug]/page.tsx
app/features/page.tsx
app/contact/page.tsx
app/sitemap.ts
app/robots.ts
```

## 検証

```bash
npm run validate:data
npm run build
```

## 禁止

- 旧テーマJSONへ戻す
- 旧legacy/modern UIをimportする
- 画像出典なしで温泉地を増やす
- ダミー問い合わせフォームを作る
- `SKIP_CHECK=true` を通常の検証結果として扱う
