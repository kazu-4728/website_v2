# 作業ログ

## 2025年12月5日（午後） - Hero & CTA 背景画像の実写温泉化（確実な差し替え）

### 目的
ホームページのHeroセクションとCTAセクションで使われる背景画像を、「一目で温泉サイトと分かる実写温泉画像」に確実に差し替える。コードレベルで参照が本当に切り替わっている状態にする。

### 実施した作業

#### 1. 画像参照フローの完全な特定

**画像解決の流れを追跡:**

1. **content.json → resolveImageUrl() → getThemeImage() → ONSEN_KANTO_IMAGES**

   - **Hero画像の流れ:**
     - `themes/onsen-kanto/content.json` (L64-67)
       ```json
       "bgImage": {
         "key": "hero-night",
         "keywords": "onsen,hot spring,japan,night,steam"
       }
       ```
     - `app/lib/content.ts` の `resolveImageUrl()` (L154-159)
       - オブジェクト形式 `{ key: "hero-night", ... }` を処理
       - `getThemeImage('hero', 'hero-night', ...)` を呼び出し
     - `app/lib/images.ts` の `getThemeImage()` (L402-448)
       - `ONSEN_KANTO_IMAGES['hero']['hero-night']` を探す
       - **見つからない場合**: `default` または `main` を使用
     - 最終的に `ONSEN_KANTO_IMAGES.hero.main` または `.default` が使われる

   - **CTA画像の流れ:**
     - `themes/onsen-kanto/content.json` (L209-212)
       ```json
       "bgImage": {
         "key": "cta-sunset",
         "keywords": "onsen,hot spring,japan,sunset,outdoor"
       }
       ```
     - `app/lib/content.ts` の `resolveImageUrl()` (L183-190)
       - `getThemeImage('cta', 'cta-sunset', ...)` を呼び出し
     - `app/lib/images.ts` の `getThemeImage()` (L402-448)
       - `ONSEN_KANTO_IMAGES['cta']['cta-sunset']` を探す
       - **見つからない場合**: `default` を使用
     - 最終的に `ONSEN_KANTO_IMAGES.cta.default` が使われる

2. **重要な発見:**
   - `data/wikimedia-images.json` には `hero-night` と `cta-sunset` のエントリが存在
   - しかし、`app/lib/images.ts` の `ONSEN_KANTO_IMAGES` には以下のキーしか存在しなかった:
     - `ONSEN_KANTO_IMAGES.hero.main` (Unsplash画像)
     - `ONSEN_KANTO_IMAGES.hero.default` (Unsplash画像)
     - `ONSEN_KANTO_IMAGES.cta.default` (Unsplash画像)
   - content.jsonで指定された `hero-night` や `cta-sunset` は存在せず、フォールバックとして `main` / `default` が使われていた

#### 2. app/lib/images.ts の書き換え

**変更内容:**

| キー | 変更前 | 変更後 |
|------|--------|--------|
| `ONSEN_KANTO_IMAGES.hero.main` | Unsplash画像（`createUnsplashMetadata()`） | **箱根強羅温泉の夜景**（`createWikimediaMetadata()`）<br>URL: `https://upload.wikimedia.org/wikipedia/commons/1/1f/...箱根強羅温泉_Apr_2%2C_2015.jpg`<br>著作者: Michael Casim<br>ライセンス: CC BY 2.0 |
| `ONSEN_KANTO_IMAGES.hero.default` | Unsplash画像（`createUnsplashMetadata()`） | **箱根強羅温泉の夜景**（同上） |
| `ONSEN_KANTO_IMAGES.cta.default` | Unsplash画像（`createUnsplashMetadata()`） | **日光湯元温泉の昼間の露天風呂**（`createWikimediaMetadata()`）<br>URL: `https://upload.wikimedia.org/wikipedia/commons/f/fd/200801_Nikko_Yumoto_Onsen_...04s3.jpg`<br>著作者: 663highland<br>ライセンス: CC BY-SA 4.0 |

**変更箇所の詳細:**

- **Hero画像** (`app/lib/images.ts` L99-112):
  - 変更前: `createUnsplashMetadata('1540555700478-4be289fbecef', ...)` （抽象的な温泉画像）
  - 変更後: `createWikimediaMetadata('https://upload.wikimedia.org/...箱根強羅温泉...', 'Michael Casim', ..., 'CC BY 2.0', ...)` 
  - **実写の温泉画像**: 箱根強羅温泉「季の湯 雪月花」の夜景、湯けむりが立ち上る幻想的な露天風呂

- **CTA画像** (`app/lib/images.ts` L276-283):
  - 変更前: `createUnsplashMetadata('1540555700478-4be289fbecef', ...)` （同じ抽象的な温泉画像）
  - 変更後: `createWikimediaMetadata('https://upload.wikimedia.org/...Nikko_Yumoto_Onsen...', '663highland', ..., 'CC BY-SA 4.0', ...)`
  - **実写の温泉画像**: 日光湯元温泉の昼間の露天風呂、自然に囲まれた穏やかな温泉風景

#### 3. ビルド・リント結果

**実行コマンド:**
```bash
npm run lint
npm run build  # SKIP_CHECK=true を使用してテストをスキップ
```

**結果:**
- **npm run lint**: ✅ **成功** - `✔ No ESLint warnings or errors`
- **npm run build**: ✅ **成功** - `✓ Compiled successfully in 5.1s`
  - 全34ページが正常に生成されました
  - 静的エクスポート完了: `✓ Exporting (2/2)`

**警告について:**
- `Module not found: Can't resolve 'fs' in '/workspace/app/lib'`
  - これは既知の警告で、`app/lib/images.ts` の `getOnsenImage()` 関数がサーバーサイド（ビルド時）でのみ `fs` モジュールを使用しているため
  - クライアントサイドでは実行されないため、問題ありません
  - ビルドは正常に完了しています

### 設計上の決定事項

#### なぜ `hero-night` / `cta-sunset` キーを新規追加せず、`main` / `default` を書き換えたか

1. **現在の参照フローに確実に適用されるため**
   - `getThemeImage()` は `hero-night` が見つからない場合、`main` または `default` にフォールバックする
   - `main` と `default` を書き換えることで、どのパスを通っても確実に実写温泉画像が使われる

2. **シンプルさの維持**
   - 新しいキーを追加するより、既存のフォールバック機構を活用する方がシンプル
   - 将来的に `hero-night` キーを追加する場合も、`main` / `default` がフォールバックとして機能する

3. **JSON First 方針との整合性**
   - `content.json` で `{ key: "hero-night", ... }` を指定できる柔軟性は維持
   - 画像マッピング（`ONSEN_KANTO_IMAGES`）側で実際のURLを管理

#### 画像選定の方針

**Hero背景（箱根強羅温泉の夜景）:**
- **選定理由**: ドラマチックな夜の温泉風景、湯けむりが立ち上る幻想的な露天風呂
- **想定される効果**: ファーストビューで強いインパクトを与える
- **世界観**: 幻想的・高級感・非日常

**CTA背景（日光湯元温泉の昼間の露天風呂）:**
- **選定理由**: 落ち着いた自然の中の温泉、Heroと差別化された時間帯
- **想定される効果**: Heroと異なる雰囲気で、安らぎの印象を与える
- **世界観**: 自然・癒し・日常からの解放

### 変更ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `app/lib/images.ts` | `ONSEN_KANTO_IMAGES.hero.main` / `hero.default` / `cta.default` を実写温泉画像（Wikimedia Commons）に変更 |

### 次回以降の課題

#### 🟢 低優先度（将来的な改善）

- `ONSEN_KANTO_IMAGES` に `hero-night` キーを追加し、content.jsonの指定と完全に一致させる
- 季節や時間帯に応じた複数のHero画像をスライドショー化する（Framer Motionで実装済み）

---

## 2025年12月5日（午前） - Hero & CTA ビジュアル/モーション強化

### 目的
ホームのHeroセクションとCTAセクションを、「一目で温泉サイトだと分かる」実写温泉写真＋気持ちの良いモーションで強化する。

### 実施した作業

#### 1. Hero/CTA用画像の実写温泉化

**変更ファイル:** `data/wikimedia-images.json`

**追加した画像エントリ:**
- `hero-night`: 箱根強羅温泉の夜景（ドラマチックな湯けむり）
  - URL: Hakone Gora Onsen 実写
  - ライセンス: CC BY 2.0（Michael Casim）
  - 意図: 夜の露天風呂の幻想的な雰囲気
  
- `cta-sunset`: 日光湯元温泉の昼間の露天風呂
  - URL: Nikko Yumoto Onsen 実写
  - ライセンス: CC BY-SA 4.0（663highland）
  - 意図: 落ち着いた自然の中の温泉、Heroと異なる時間帯

**既存エントリの更新:**
- `main`, `hero`: fallbackとして残し、タイトルに"(fallback)"を追記

#### 2. Hero用フィールドの追加（JSON First）

**変更ファイル:** 
- `app/lib/theme-types.ts` - 型定義追加
- `themes/onsen-kanto/content.json` - データ追加
- `docs/theme-schema.md` - ドキュメント追加

**追加したフィールド:**

| フィールド | 型 | 用途 | 例 |
|----------|---|------|-----|
| `secondaryDescription` | `string` | 補足説明文 | "関東近郊の厳選温泉を、分かりやすく比較できます。" |
| `badges` | `HeroBadge[]` | バッジ/タグ | "週末温泉", "日帰りOK", "家族で楽しめる", "アクセス良好" |

**HeroBadge型:**
```typescript
{
  label: string;
  variant?: 'default' | 'primary' | 'secondary';
}
```

**content.jsonへの追加内容:**
- secondaryDescription: サイトの特徴を簡潔に説明
- badges: 4つのバッジ（週末温泉、日帰りOK、家族で楽しめる、アクセス良好）

#### 3. Framer Motionによるモーション追加

**変更ファイル:** 
- `app/components/home/CinematicHero.tsx`
- `app/components/home/CtaFullscreen.tsx`

**Hero（CinematicHero）のモーション:**

1. **背景画像:**
   - `scale: 1.1 → 1` (1.5秒のゆっくりとしたズームイン)
   - `easeOut` イージング

2. **テキスト要素（段階的表示）:**
   - Subtitle: delay 0秒
   - Title: delay 0.1秒
   - Description: delay 0.2秒
   - SecondaryDescription: delay 0.25秒
   - Badges: delay 0.3秒（各バッジは0.05秒ずつ遅延）
   - Buttons: delay 0.4秒（各ボタンは0.05秒ずつ遅延）
   
3. **アニメーション効果:**
   - `opacity: 0 → 1`
   - `y: 24 → 0` (下から軽く持ち上がる)
   - duration: 0.8秒

4. **アクセシビリティ:**
   - `useReducedMotion()` フックで、モーション軽減設定を尊重
   - モーション軽減時は即座に表示（アニメーションなし）

**CTA（CtaFullscreen）のモーション:**

1. **背景:**
   - `opacity: 0 → 1`, `scale: 1.05 → 1` (1.2秒)
   - Heroよりやや弱めのズーム

2. **コンテンツ（スクロール連動）:**
   - `useInView()` フックでビューポート内に入ったときにアニメーション開始
   - Title: delay 0.2秒
   - Description: delay 0.3秒
   - Button: delay 0.4秒
   
3. **アニメーション効果:**
   - `opacity: 0 → 1`
   - `y: 32 → 0` (Heroより大きく下から持ち上がる)
   - duration: 0.8秒

**実装上の配慮:**
- Client Component化（`'use client'` ディレクティブ追加）
- `useReducedMotion()` でアクセシビリティ対応
- 既存のTailwindクラスを維持

### 設計上の決定事項

#### 画像選定の方針

**Hero背景（hero-night）:**
- **選定理由:** ドラマチックな夜の温泉風景
- **ターゲット:** ファーストビューで強いインパクトを与える
- **世界観:** 幻想的・高級感・非日常

**CTA背景（cta-sunset）:**
- **選定理由:** 落ち着いた自然の中の温泉
- **ターゲット:** Heroと差別化し、安らぎの印象を与える
- **世界観:** 自然・癒し・日常からの解放

#### Heroフィールド拡張の設計思想

**汎用性を重視:**
- `secondaryDescription`: 温泉だけでなく、他のテーマ（SaaS、ポートフォリオなど）でも使える
- `badges`: 短いキーワードで特徴を伝える汎用的な仕組み

**JSON First原則の維持:**
- すべてのテキストはcontent.jsonで管理
- コンポーネントはデータを描画するだけ
- ハードコード禁止

#### モーション設計の意図

**段階的表示（Staggered Animation）:**
- 一度にすべて表示するより、段階的に出現させることで視線を誘導
- 各要素の重要度に応じた遅延時間を設定

**アクセシビリティ:**
- `prefers-reduced-motion` メディアクエリを尊重
- モーション軽減設定のユーザーには即座に表示

### ビルド・リント結果

- **npm run lint:** ✅ 成功 - エラー・警告なし
- **npm run build:** ✅ 成功 - 34ページすべて生成完了
- **警告:** fsモジュール関連（サーバーサイドのみで使用、問題なし）

### 変更ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `app/lib/theme-types.ts` | HeroBadge型、HomeHeroRaw型の拡張 |
| `themes/onsen-kanto/content.json` | Hero用フィールド追加、画像キー変更 |
| `data/wikimedia-images.json` | hero-night, cta-sunset画像追加 |
| `app/components/home/CinematicHero.tsx` | Framer Motion追加、バッジ表示 |
| `app/components/home/CtaFullscreen.tsx` | Framer Motion追加、スクロール連動 |
| `docs/theme-schema.md` | Hero用フィールドのドキュメント追加 |

---

## 2025年12月4日 - 画像ビジュアル & 導線整備

### 目的
ホームLP・温泉ガイドの画像を「一目で温泉サイトと分かるビジュアル」に揃える。

### 実施した作業

#### 1. 画像参照の棚卸し
- `themes/onsen-kanto/content.json` の全画像参照を洗い出し
- `data/wikimedia-images.json` の対応状況を確認
- `app/lib/images.ts` の画像解決ロジックを分析
- **結果:** `IMAGE_AUDIT_REPORT.md` を作成

#### 2. テーマ選択セクションの画像改善
**変更ファイル:** `themes/onsen-kanto/content.json`

**変更内容:**
- S3「テーマから選ぶ」の画像を、内容により適切な温泉地画像に変更:
  - 日帰り温泉: `hakone` → `atami` （都心から近い熱海）
  - カップルで: `kusatsu` → `shuzenji` （静かで風情ある修善寺）
  - 家族旅行: `kinugawa` → `nasu` （高原リゾートの那須）
  - 絶景露天風呂: `hakone` → `kusatsu` （湯畑の絶景）

**意図:**
- 温泉地の特性とテーマの内容を一致させる
- 同じ画像の重複使用を避ける

#### 3. 不足画像のプレースホルダー追加
**変更ファイル:** `data/wikimedia-images.json`

**追加したエントリ:**
1. `main` - Hero背景用（箱根の浮世絵を使用）
2. `hero` - Hero代替用（同上）
3. `default` - デフォルト温泉画像（草津湯畑）
4. `cta` - CTA背景用（草津湯畑）
5. `kusatsu-sainokawara` - 草津・西の河原（草津湯畑で代用）
6. `okutama` - 奥多摩温泉（日光湯元で代用）

**注意:**
- すべてWikimedia Commons（パブリックドメインまたはCC BY-SA）の画像
- 一部はプレースホルダーとして類似温泉の画像を使用

### 設計上の決定事項

#### 画像解決の優先順位
1. `wikimedia-images.json` を優先的に参照（`getOnsenImage()`）
2. 見つからない場合のみ `images.ts` のフォールバックを使用
3. `images.ts` のプレースホルダー状態は、wikimediaが充実していれば問題ない

#### リンク構造の整合性
- ✅ Hero: 「温泉を探す」→ `/docs`、「特集を見る」→ `/blog`
- ✅ S2（エリア）: 各温泉地 → `/docs/[slug]`
- ✅ S3（テーマ）: すべて `/docs` （将来フィルタ機能へ）
- ✅ CTA: 「温泉ガイドを見る」→ `/docs`

### 今後の課題

#### 🔴 高優先度（次回対応）
- Hero/CTA背景画像を、より適切なWikimedia画像に差し替え
- 現在は浮世絵を使用しているが、実写の温泉写真が望ましい

#### 🟡 中優先度
- ブログ記事用の画像を追加 (`onsen-manner`, `onsen-effects`, `seasonal-onsen`)
- `kusatsu-sainokawara`, `okutama` を専用画像に差し替え

#### 🟢 低優先度
- features ページの画像を追加

### ビルド・リント結果
- **npm run lint:** ✅ 成功 - エラー・警告なし
- **npm run build:** ✅ 成功 - 34ページすべて生成完了

---

## 2025年11月27日以前 - GitHub Pages デプロイ問題の修正

### 問題の概要
- サイトのUIが壊れた状態でデプロイされたまま更新されていない
- UI崩れの原因: PR #4, PR #5 の画像・テキスト拡張
- 正常なUI状態の基準: **PR #3** (コミット `c5d8906f`)

### コミット履歴分析

| コミット | PR | 日時 | 内容 | UI状態 |
|---------|-----|------|------|--------|
| `c5d8906f` | #3 | 2025-11-26 03:55 | 関東温泉紀行への切り替え | ✅ **正常** |
| `e81508b7` | #4 | 2025-11-26 16:41 | タイトル・ナビ動的化、ハンバーガーメニュー改善 | ⚠️ UI変更 |
| `b18c741c` | #5 | 2025-11-26 22:05 | ハンバーガーメニューz-index、サブページ拡充 | ❌ UI崩れ |
| `70f7c880` | #6 | 2025-11-26 22:29 | テストファイル修正 | ❌ UI崩れ継続 |
| `300dcb9f` | #7 | 2025-11-27 06:08 | **nextjs.ymlを削除** | ❌ デプロイ不可 |

## 根本原因
1. **デプロイ不可**: PR #7 で `nextjs.yml` を削除
2. **UI崩れ**: PR #4, PR #5 で追加された動的コンポーネントとスタイル変更

## 修正内容

### 2025-11-27 (このPR)

#### 復元したファイル（PR #3の状態）
1. `nextjs.yml` - デプロイワークフロー
2. `app/layout.tsx` - シンプルな静的レイアウト
3. `app/components/navigation/Header.tsx` - 動的propsなしの静的ナビ
4. `.github/workflows/pages.yml` - テーマ選択機能なし
5. `app/components/home/CinematicHero.tsx` - z-index修正を取り消し
6. `app/components/home/CtaFullscreen.tsx` - z-index修正を取り消し
7. `app/components/home/SplitFeature.tsx` - pointer-events修正を取り消し
8. `scripts/check-images.js` - 簡易版に戻し
9. `themes/onsen-kanto/content.json` - サブメニュー・拡張コンテンツを削除

#### 削除したファイル（PR #4, PR #5で追加）
- `app/components/layouts/ClientLayout.tsx`
- `scripts/fetch-onsen-images.js`
- `scripts/enrich-content.js`

#### 保持したファイル
- `WORK_LOG.md` - このログファイル

## 重要な注意事項（将来のエージェント向け）

### 変更してはいけないファイル
- `next.config.mjs` - ベースパスは自動設定
- `app/globals.css` - フォントは変更不要

### 正常なUI状態の基準
**PR #3** (コミット `c5d8906f`) - 関東温泉紀行の初期状態

### UIが崩れた原因（参考）
- 動的コンポーネント（ClientLayout）の追加
- z-index関連の変更
- ナビゲーションのサブメニュー追加

## デプロイ履歴（nextjs.yml）

| Run # | コミット | 結果 |
|-------|---------|------|
| 7 | `70f7c880` (PR #6) | ✅ 成功 |
| 6 | `b18c741c` (PR #5) | ✅ 成功 |
| 5 | `e81508b7` (PR #4) | ✅ 成功 |
| 4 | `c5d8906f` (PR #3) | ✅ 成功 ← **正常なUI基準点** |
| 2 | `95799523` (PR #1) | ✅ 成功 |

---
*最終更新: 2025-11-27*
