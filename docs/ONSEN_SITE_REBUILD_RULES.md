# 温泉サイト再構築ブランチ 作業ルール

対象ブランチ: `refactor/onsen-site-rebuild`

このブランチは、既存テンプレートを修理するためではなく、温泉紹介サイトとして成立する新基盤を作るためのブランチです。

## 目的

- JSON駆動で温泉紹介ページを量産できる状態にする
- 温泉画像、出典、ライセンス、altをデータとして管理する
- 旧UIに引っ張られない新しいサイト構成にする
- 問い合わせ機能や外部送信は後回しにする

## 最重要ルール

### 1. `_legacy` を実ページからimportしない

禁止:

```ts
import { Button } from '../components/_legacy/ui/Button';
import { MarkdownRenderer } from '../components/_legacy/ui/MarkdownRenderer';
```

使用する場所:

```txt
app/components/site/**
app/lib/onsen-site.ts
```

### 2. 旧テーマJSONを新ページの主データにしない

禁止:

```ts
import { loadContent } from './lib/content';
```

新しいページでは以下を使う:

```ts
import { getSiteData, getOnsenSpots } from './lib/onsen-site';
```

### 3. 温泉画像はプレースホルダーで埋めない

画像データには必ず以下を持たせる。

```json
{
  "src": "画像URL",
  "alt": "画像の説明",
  "credit": "撮影者または提供元",
  "license": "ライセンス",
  "sourceUrl": "出典URL"
}
```

画像が未確定の温泉地は、無理に追加しない。先に掲載数を増やすより、掲載済みページの品質を優先する。

### 4. ページ量産は `data/onsen-site.json` を起点にする

温泉地を追加する場合は `onsenSpots` に1件追加する。

必須フィールド:

- `slug`
- `name`
- `prefecture`
- `area`
- `catchcopy`
- `summary`
- `image`
- `tags`
- `springTypes`
- `bestFor`
- `access`
- `stayStyle`
- `season`

### 5. 問い合わせフォームはまだ作らない

現段階では問い合わせ送信機能を実装しない。

禁止:

- 送信していないのに成功表示を出すフォーム
- ダミー送信
- Formspreeなど外部サービスへの仮接続

必要になった段階で、実際の送信先を決めてから追加する。

## 現在の新基盤

```txt
data/onsen-site.json          温泉サイト用データ
app/lib/onsen-site.ts         型付きデータローダー
app/components/site/          新UIコンポーネント
app/page.tsx                  トップページ
app/docs/page.tsx             温泉地一覧
app/docs/[slug]/page.tsx      温泉地詳細
app/blog/page.tsx             特集一覧
app/blog/[slug]/page.tsx      特集詳細
app/features/page.tsx         旅の選び方
app/contact/page.tsx          運営方針
```

## 次にやること

1. ローカルで `npm run build` を実行
2. 表示崩れを確認
3. 温泉地データを10件から20件へ増やす
4. 画像出典確認済みの温泉だけ追加
5. 一覧ページに絞り込みUIを追加
6. 詳細ページに周辺観光・宿泊導線を追加

## 完了の定義

このブランチでの「完了」は、以下を満たすこと。

- `npm run build` が通る
- トップ、一覧、詳細、特集、旅の選び方が同じUIトーンで見える
- `_legacy` import が実ページから消えている
- 画像に出典・ライセンスが表示される
- sitemapが実URLと一致している
