# 関東湯旅案内

関東近郊の温泉地・温泉施設を、エリア、目的、公式サイト導線、画像クレジット付きで比較できるJSON駆動型の温泉ディレクトリです。

## 公開URL

https://kazu-4728.github.io/website_v2/

## 現在の方針

このサイトの一次データは `data/directory-site.json` です。

旧 `themes/`、旧 `_legacy`、旧 `modern`、旧 `app/lib/content.ts`、旧 `data/onsen-site.json` 前提には戻しません。

## 主要ページ

```txt
/
/areas
/areas/[areaSlug]
/onsens
/onsens/[slug]
/purposes
/purposes/[purposeSlug]
/articles
/articles/[slug]
/about
```

以下は互換ルートです。新規導線では使いません。

```txt
/docs
/docs/[slug]
/features
/blog
/blog/[slug]
/contact
```

## データ構造

温泉候補を追加する場合は、`data/directory-site.json` の `onsens` に追加します。

主な単位:

```txt
areas      エリア情報
onsens     温泉地・温泉施設候補
purposes   日帰り、宿泊、温泉街、静養、家族などの目的
articles   選び方・確認ポイント記事
```

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

公式サイト画像は、利用許諾が確認できない限り転載しません。公式サイトは `officialUrl` としてカードの導線に使います。

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
data/directory-site.json
app/lib/onsen-site.ts
app/components/site/
app/page.tsx
app/areas/page.tsx
app/areas/[areaSlug]/page.tsx
app/onsens/page.tsx
app/onsens/[slug]/page.tsx
app/purposes/page.tsx
app/purposes/[purposeSlug]/page.tsx
app/articles/page.tsx
app/articles/[slug]/page.tsx
app/about/page.tsx
scripts/validate-onsen-site-data.mjs
```

## 禁止

- `themes/**` を復活させない
- `_legacy` / `modern` / `_archive` をimportしない
- `app/lib/content.ts` を復活させない
- `data/onsen-site.json` 前提に戻さない
- ダミー問い合わせフォームを置かない
- 出典なし画像を追加しない
- 公式サイト画像を無断転載しない

## 検証

```bash
npm run validate:data
npm run build
```

`validate:data` は、エリア、温泉候補、目的、記事、公式URL、画像メタデータ、slug参照の整合性を確認します。
