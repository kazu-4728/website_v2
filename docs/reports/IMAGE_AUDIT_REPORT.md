# 画像参照の棚卸しレポート

**作成日:** 2025年12月4日  
**目的:** ホームLP・温泉ガイドの画像を「一目で温泉サイトと分かるビジュアル」に揃える

---

## 📊 現状の画像参照一覧

### 1. ホームページ (`pages.home`)

#### S1: Hero セクション
- **画像キー:** `main`
- **keywords:** `onsen,hot spring,japan,steam`
- **解決方法:** `getThemeImage('hero', 'main', ...)`
- **問題:** ❌ images.ts のプレースホルダー画像を使用（すべて同じUnsplash画像ID）
- **対応:** wikimedia-images.json に "main" または "hero" エントリを追加

#### S2: エリアから探す (grid-gallery)
| 温泉地 | 画像キー | Wikimedia対応 | 問題 |
|-------|---------|--------------|-----|
| 箱根温泉郷 | `hakone` | ✅ あり | なし |
| 草津温泉 | `kusatsu` | ✅ あり | なし |
| 鬼怒川温泉 | `kinugawa` | ✅ あり | なし |
| 伊香保温泉 | `ikaho` | ✅ あり | なし |
| 那須温泉郷 | `nasu` | ✅ あり | なし |
| 水上温泉郷 | `minakami` | ✅ あり | なし |

**評価:** ✅ すべて温泉地に対応した画像が存在

#### S3: テーマから選ぶ (grid-gallery)
| テーマ | 画像キー | 内容との整合性 | 問題 |
|-------|---------|--------------|-----|
| 日帰り温泉 | `hakone` | ⚠️ 箱根の画像（日帰りテーマとは無関係） | テーマに合った画像に差し替えたい |
| カップルで | `kusatsu` | ⚠️ 草津の画像（カップルテーマとは無関係） | テーマに合った画像に差し替えたい |
| 家族旅行 | `kinugawa` | ⚠️ 鬼怒川の画像（家族テーマとは無関係） | テーマに合った画像に差し替えたい |
| 絶景露天風呂 | `hakone` | ⚠️ 箱根の画像（絶景はOKだが同じ画像が2回） | 異なる絶景画像に差し替えたい |

**評価:** ⚠️ 温泉地画像を再利用しているが、テーマ内容とのビジュアル的な関連性が弱い

#### S4: 旅行者の声 (testimonials)
- **画像:** Unsplashのアバター画像（外部URL）
- **問題:** なし（人物写真のためUnsplashのままでOK）

#### S5: 温泉の選び方 (steps)
- **画像:** なし

#### S6: CTA セクション
- **画像キー:** `default`
- **keywords:** `onsen,hot spring,japan,steam`
- **解決方法:** `getThemeImage('cta', 'default', ...)`
- **問題:** ❌ images.ts のプレースホルダー画像を使用
- **対応:** wikimedia-images.json に "cta" または "default" エントリを追加

---

### 2. 温泉ガイド (`pages.docs`)

| 温泉地 | スラッグ | 画像キー | Wikimedia対応 | 問題 |
|-------|---------|---------|--------------|-----|
| 箱根温泉郷 | `hakone` | `hakone` | ✅ あり | なし |
| 箱根湯本 | `hakone-yunohana` | `hakone-yunohana` | ✅ あり | なし |
| 強羅 | `hakone-gora` | `hakone-gora` | ✅ あり | なし |
| 仙石原 | `hakone-sengokuhara` | `hakone-sengokuhara` | ✅ あり | なし |
| 草津温泉 | `kusatsu` | `kusatsu` | ✅ あり | なし |
| 湯畑 | `kusatsu-yubatake` | `kusatsu-yubatake` | ✅ あり | なし |
| 西の河原 | `kusatsu-sainokawara` | なし | ❌ なし | wikimediaに画像追加が必要 |
| 鬼怒川温泉 | `kinugawa` | `kinugawa` | ✅ あり | なし |
| 伊香保温泉 | `ikaho` | `ikaho` | ✅ あり | なし |
| 那須温泉郷 | `nasu` | `nasu` | ✅ あり | なし |
| 水上温泉郷 | `minakami` | `minakami` | ✅ あり | なし |
| 四万温泉 | `shima` | `shima` | ✅ あり | なし |
| 日光湯元温泉 | `nikko` | `nikko` | ✅ あり | なし |
| 塩原温泉郷 | `shiobara` | `shiobara` | ✅ あり | なし |
| 熱海温泉 | `atami` | `atami` | ✅ あり | なし |
| 伊東温泉 | `ito` | `ito` | ✅ あり | なし |
| 修善寺温泉 | `shuzenji` | `shuzenji` | ✅ あり | なし |
| 下田温泉 | `shimoda` | `shimoda` | ✅ あり | なし |
| 湯河原温泉 | `yugawara` | `yugawara` | ✅ あり | なし |
| 奥多摩温泉 | `okutama` | なし | ❌ なし | wikimediaに画像追加が必要 |
| 秩父温泉 | `chichibu` | `chichibu` | ✅ あり | なし |

**評価:** ✅ ほとんどの温泉地に対応した画像が存在（2箇所のみ不足）

---

### 3. ブログ (`pages.blog`)

| 記事 | スラッグ | 画像キー | Wikimedia対応 | 問題 |
|-----|---------|---------|--------------|-----|
| 温泉マナー | `onsen-manner` | `onsen-manner` | ❌ なし | wikimediaまたは汎用画像が必要 |
| 泉質別効能 | `onsen-effects` | `onsen-effects` | ❌ なし | wikimediaまたは汎用画像が必要 |
| 四季の温泉 | `seasonal-onsen` | `seasonal-onsen` | ❌ なし | wikimediaまたは汎用画像が必要 |

**評価:** ❌ ブログ用の画像が不足

---

### 4. おすすめプラン (`pages.features`)

| プラン | 画像キー | Wikimedia対応 | 問題 |
|-------|---------|--------------|-----|
| Hero | `hero` | ❌ なし | wikimediaまたは汎用画像が必要 |
| 日帰り温泉 | `day-trip` | ❌ なし | wikimediaまたは汎用画像が必要 |
| カップル旅行 | `couple` | ❌ なし | wikimediaまたは汎用画像が必要 |
| ファミリー | `family` | ❌ なし | wikimediaまたは汎用画像が必要 |

**評価:** ❌ features用の画像が不足

---

## 🔧 images.ts の現状

**現在の問題:**
- すべての温泉画像が同じUnsplash画像ID (`1540555700478-4be289fbecef`) を参照している
- これはプレースホルダーとして設定されているだけ

**実際の動作:**
- `getOnsenImage()` 関数が `wikimedia-images.json` を優先的に読み込む
- wikimediaに画像がある場合は、images.tsのプレースホルダーは使われない
- wikimediaに画像がない場合のみ、images.tsのフォールバックが使われる

**結論:**
✅ images.ts のプレースホルダー状態は、wikimedia-images.json が充実していれば問題ない

---

## 🎯 優先対応が必要な箇所

### 🔴 高優先度（ホームページの主要ビジュアル）

1. **Hero セクションの背景画像**
   - 現状: プレースホルダー画像
   - 対応: wikimedia-images.json に "main" または "hero" エントリを追加
   - 推奨画像: 湯気立つ温泉の全景、できれば関東エリアの代表的な温泉

2. **CTA セクションの背景画像**
   - 現状: プレースホルダー画像
   - 対応: wikimedia-images.json に "cta" または "default" エントリを追加
   - 推奨画像: 夕暮れや夜の温泉風景（幻想的な雰囲気）

3. **S3: テーマから選ぶ セクション**
   - 現状: 温泉地の画像を再利用（テーマとの関連性が弱い）
   - 対応方針A: 既存の温泉画像から、より適切な組み合わせを選ぶ
   - 対応方針B: wikimedia-images.json に "day-trip", "couple", "family", "scenic-view" エントリを追加

### 🟡 中優先度（コンテンツページ）

4. **不足している温泉地画像**
   - `kusatsu-sainokawara` (草津・西の河原)
   - `okutama` (奥多摩温泉)

5. **ブログ記事の画像**
   - `onsen-manner`
   - `onsen-effects`
   - `seasonal-onsen`

### 🟢 低優先度（将来の機能）

6. **おすすめプラン (`features`) の画像**
   - 現在、featuresページは実装されているが、画像が不足

---

## 📋 推奨される修正アクション

### アクション1: Hero・CTA画像の追加

**wikimedia-images.json に追加:**

```json
{
  "main": {
    "url": "TODO: Add Wikimedia URL for main hero onsen image",
    "author": "TODO",
    "license": "TODO",
    "licenseUrl": "",
    "title": "Japanese hot spring with steam"
  },
  "hero": {
    "url": "TODO: Add Wikimedia URL for hero onsen image",
    "author": "TODO",
    "license": "TODO",
    "licenseUrl": "",
    "title": "Japanese hot spring panorama"
  },
  "cta": {
    "url": "TODO: Add Wikimedia URL for CTA background onsen image",
    "author": "TODO",
    "license": "TODO",
    "licenseUrl": "",
    "title": "Japanese hot spring at dusk"
  },
  "default": {
    "url": "TODO: Add Wikimedia URL for default onsen image",
    "author": "TODO",
    "license": "TODO",
    "licenseUrl": "",
    "title": "Japanese hot spring"
  }
}
```

### アクション2: S3テーマ選択の画像改善

**content.json の theme-selection セクションを修正:**

```json
{
  "id": "theme-selection",
  "type": "grid-gallery",
  "title": "テーマから選ぶ",
  "items": [
    {
      "title": "日帰り温泉",
      "description": "...",
      "image": "atami",  // 東京から近い熱海に変更
      "href": "/docs"
    },
    {
      "title": "カップルで",
      "description": "...",
      "image": "shuzenji",  // 静かな修善寺に変更
      "href": "/docs"
    },
    {
      "title": "家族旅行",
      "description": "...",
      "image": "nasu",  // 高原リゾートの那須に変更
      "href": "/docs"
    },
    {
      "title": "絶景露天風呂",
      "description": "...",
      "image": "kusatsu",  // 湯畑の絶景、草津に変更
      "href": "/docs"
    }
  ]
}
```

### アクション3: 不足画像の追加

**wikimedia-images.json に追加:**

```json
{
  "kusatsu-sainokawara": {
    "url": "TODO: Add Wikimedia URL for Kusatsu Sainokawara",
    "author": "TODO",
    "license": "TODO",
    "licenseUrl": "",
    "title": "Kusatsu Sainokawara open-air bath"
  },
  "okutama": {
    "url": "TODO: Add Wikimedia URL for Okutama Onsen",
    "author": "TODO",
    "license": "TODO",
    "licenseUrl": "",
    "title": "Okutama hot spring"
  }
}
```

---

## 🔗 リンク構造の整合性チェック

### Hero セクション

| ボタン | ラベル | リンク先 | 整合性 |
|-------|-------|---------|--------|
| Primary | "温泉を探す" | `/docs` | ✅ OK |
| Secondary | "特集を見る" | `/blog` | ✅ OK |

### S2: エリアから探す

すべてのカードが `/docs/[slug]` にリンクしており、整合性あり。

### S3: テーマから選ぶ

すべてのカードが `/docs` （一覧ページ）にリンクしており、整合性あり。  
※ 将来的にはテーマ別フィルタ機能を実装する想定。

### S6: CTA セクション

| ボタン | ラベル | リンク先 | 整合性 |
|-------|-------|---------|--------|
| Primary | "温泉ガイドを見る" | `/docs` | ✅ OK |

**評価:** ✅ すべてのリンクが文言と整合している

---

## 📊 まとめ

### 温泉らしさの評価

| 項目 | 評価 | コメント |
|-----|------|---------|
| 温泉ガイド画像 | ✅ 90% | ほとんどの温泉地に対応済み（2箇所不足） |
| ホームHero/CTA | ❌ 0% | プレースホルダー画像のため対応必要 |
| エリア選択 | ✅ 100% | 全6温泉地の画像が適切 |
| テーマ選択 | ⚠️ 50% | 温泉画像だが内容との関連性が弱い |
| リンク整合性 | ✅ 100% | 文言とリンク先が一致 |

### 次のステップ

1. ✅ **即座に実施:** S3テーマ選択の画像を既存温泉画像から最適な組み合わせに変更（content.json修正のみ）
2. 🔄 **次回対応:** Hero・CTA・不足画像をwikimedia-images.jsonに追加（TODO URLのまま）
3. 📷 **後日対応:** TODO URLを実際のWikimedia画像URLに差し替え

---

**作成者:** 温泉ビジュアル & 導線リライトエージェント  
**最終更新:** 2025年12月4日
