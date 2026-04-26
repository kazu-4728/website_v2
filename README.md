# 関東湯旅案内

写真で選ぶ、週末の温泉旅。関東近郊の温泉地を、写真・泉質・アクセス・過ごし方から比較できるJSON駆動型の温泉紹介サイトです。

## 公開URL

https://kazu-4728.github.io/website_v2/

## 現在の方針

このサイトの一次データは `data/onsen-site.json` のみです。

旧 `themes/`、旧 `_legacy`、旧 `modern` コンポーネント、旧 `app/lib/content.ts` は使いません。

## 主要ページ

```txt
/
/docs
/docs/[slug]
/features
/blog
/blog/[slug]
/contact
```

## データ構造

温泉地を追加する場合は、`data/onsen-site.json` の `onsenSpots` に追加します。

画像には必ず以下を入れます。

```json
{
  "src": "画像URL",
  "alt": "画像説明",
  "credit": "撮影者または提供元",
  "license": "ライセンス",
  "sourceUrl": "出典URL"
}
```

## 開発

```bash
npm ci
npm run validate:data
npm run dev
```

ブラウザで開くURL:

```txt
http://localhost:3000
```

本番ビルド確認:

```bash
npm run build
```

## 主な構成

```txt
data/onsen-site.json
app/lib/onsen-site.ts
app/components/site/
app/page.tsx
app/docs/page.tsx
app/docs/[slug]/page.tsx
app/blog/page.tsx
app/blog/[slug]/page.tsx
app/features/page.tsx
app/contact/page.tsx
scripts/validate-onsen-site-data.mjs
```

## 禁止

- `themes/**` を復活させない
- `_legacy` / `modern` をimportしない
- `app/lib/content.ts` を復活させない
- ダミー問い合わせフォームを置かない
- 出典なし画像を追加しない

## 検証

```bash
npm run validate:data
npm run build
```

`validate:data` は、温泉地データ、画像メタデータ、slug参照の整合性を確認します。
