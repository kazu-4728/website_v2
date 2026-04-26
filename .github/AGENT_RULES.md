# AIエージェント作業ルール

対象: `kazu-4728/website_v2`

このリポジトリは、JSON駆動の関東温泉紹介サイトです。旧テンプレート、旧テーマ、旧legacy UIには戻さないでください。

## 最重要方針

- サイトの一次データは `data/onsen-site.json` のみ。
- データ読み込みは `app/lib/onsen-site.ts` のみ。
- UIは `app/components/site/` のみを拡張する。
- 旧 `themes/`、旧 `_legacy`、旧 `modern` コンポーネントは使わない。
- 問い合わせフォームは未実装。ダミー送信フォームを作らない。
- 温泉画像には必ず `src`, `alt`, `credit`, `license`, `sourceUrl` を持たせる。

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

## 禁止

```txt
app/components/_legacy/** をimportする
app/components/modern/** をimportする
themes/** を復活させる
app/lib/content.ts を復活させる
app/lib/images.ts を復活させる
送信されない問い合わせフォームを置く
画像出典なしで温泉地を追加する
```

## 検証

```bash
npm run validate:data
npm run build
```

`npm run validate:data` は、温泉地データ、画像メタデータ、slug参照の整合性を確認します。

## コミット方針

- コミットメッセージは日本語。
- 大きなUI変更は、何を変えたかを本文に書く。
- 旧資産に戻す変更は禁止。
