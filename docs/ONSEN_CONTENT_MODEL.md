# 関東温泉サイト用 JSON データモデル設計

## 📋 現状構造のサマリー

### content.json の構造

現在の `themes/onsen-kanto/content.json` は以下の構造を持っています：

#### トップレベル
- `site`: サイト基本情報（name, tagline, description, logo, metadata）
- `navigation`: ナビゲーションメニュー
- `pages`: 各ページのコンテンツ
  - `home`: ホームページ（hero, sections）
  - `docs`: 温泉ガイド一覧（配列）
  - `features`: おすすめプラン
  - `blog`: ブログ記事一覧（配列）
  - `contact`: お問い合わせ

#### docs 配列の現状構造
```json
{
  "slug": "hakone",
  "title": "箱根温泉郷完全ガイド",
  "subtitle": "神奈川県 - Hakone Onsen",
  "description": "富士箱根伊豆国立公園内に位置する日本有数の温泉リゾート...",
  "image": "hakone",
  "content": "## 箱根温泉の魅力\n\n...",
  "related": ["hakone-yunohana", "hakone-gora", "hakone-sengokuhara"]
}
```

**現状の問題点**:
- 温泉固有の情報（泉質、効能、アクセス、宿泊情報など）が構造化されていない
- `content` フィールドにMarkdownで全ての情報が詰め込まれている
- 一覧ページで表示する情報と詳細ページで表示する情報が分離されていない
- 検索・フィルタリングに必要なメタデータが不足

#### blog 配列の現状構造
```json
{
  "slug": "onsen-manner",
  "title": "知っておきたい温泉マナー10選",
  "excerpt": "初めての温泉旅行でも安心...",
  "date": "2024.05.15",
  "readTime": "5 min",
  "category": "マナー",
  "author": "温泉ソムリエ",
  "image": "onsen-manner",
  "content": "## 温泉を楽しむための基本マナー\n\n..."
}
```

**現状の問題点**:
- ブログ記事は比較的構造化されているが、日付形式が統一されていない（ISO 8601推奨）

### texts.json の構造

現在の `themes/onsen-kanto/texts.json` は以下の構造を持っています：

- `nav`: ナビゲーション関連テキスト
- `pages`: ページタイトル・説明文
- `buttons`: ボタンラベル
- `form`: フォームラベル・プレースホルダー
- `messages`: エラーメッセージ・not found メッセージ
- `ui`: UIラベル

**現状の問題点**:
- 温泉固有のラベル（泉質名、効能名など）が不足
- アクセス情報のラベルが不足

---

## 🎯 提案する理想データモデル

### 各温泉地（docs/blogの1件）に最低限持たせるべき項目

#### 1. 基本情報
- `id`: 一意の識別子（slugと同一でも可）
- `slug`: URL用のスラッグ
- `name`: 温泉地名（日本語）
- `nameKana`: 読み仮名（検索・ソート用）
- `nameEn`: 英語名（サブタイトル用）
- `region`: 地域情報
  - `prefecture`: 都道府県
  - `area`: エリア名（例：「箱根エリア」「草津エリア」）
  - `coordinates`: 座標（将来的なマップ機能用）
    - `lat`: 緯度
    - `lng`: 経度

#### 2. 温泉情報
- `onsen`: 温泉固有情報
  - `springTypes`: 泉質の配列（例：["単純泉", "塩化物泉"]）
  - `ph`: pH値（数値）
  - `temperature`: 源泉温度（℃）
  - `flowRate`: 湧出量（リットル/分、または文字列）
  - `effects`: 主な効能の配列（例：["神経痛", "筋肉痛", "冷え性"]）
  - `characteristics`: 特徴の配列（例：["源泉掛け流し", "露天風呂あり"]）

#### 3. アクセス情報
- `access`: アクセス情報
  - `nearestStation`: 最寄り駅
    - `name`: 駅名
    - `line`: 路線名
    - `walkingTime`: 徒歩時間（分）
  - `fromTokyo`: 東京からのアクセス
    - `byTrain`: 電車でのアクセス
      - `time`: 所要時間（分）
      - `description`: 説明文（例：「小田急線で90分」）
    - `byCar`: 車でのアクセス
      - `time`: 所要時間（分）
      - `distance`: 距離（km）
      - `description`: 説明文
  - `parking`: 駐車場情報
    - `available`: 有無
    - `fee`: 料金（文字列）

#### 4. 宿泊・施設情報
- `accommodation`: 宿泊情報
  - `dayTripAvailable`: 日帰り可否（boolean）
  - `dayTripFacilities`: 日帰り施設の配列
  - `representativeRyokan`: 代表的な旅館の配列
    - `name`: 旅館名
    - `features`: 特徴の配列
    - `priceRange`: 予算レンジ（文字列、例：「1泊2食 15,000円〜」）
  - `features`: 施設特徴の配列（例：["露天風呂", "貸切風呂", "レストラン"]）

#### 5. コンテンツ情報
- `content`: コンテンツ情報
  - `shortDescription`: 一覧用の短い説明文（100-150文字程度）
  - `longDescription`: 詳細ページ用の長い説明文（Markdown対応）
  - `highlights`: ハイライトポイントの配列（箇条書き用）
  - `seasons`: 季節別の魅力
    - `spring`: 春の特徴
    - `summer`: 夏の特徴
    - `autumn`: 秋の特徴
    - `winter`: 冬の特徴

#### 6. 画像情報
- `images`: 画像情報
  - `main`: メイン画像キー（hero用）
  - `thumbnail`: サムネイル用画像キー（一覧用）
  - `gallery`: ギャラリー用画像キーの配列
  - `credit`: ImageCredit参照キー（`data/wikimedia-images.json`のキーに対応）

#### 7. メタ情報
- `metadata`: メタ情報
  - `priority`: 表示優先度（数値、高いほど優先）
  - `tags`: タグの配列（検索・フィルタリング用）
  - `related`: 関連温泉地のslug配列
  - `publishedAt`: 公開日（ISO 8601形式）
  - `updatedAt`: 更新日（ISO 8601形式）

---

## 📄 TypeScript Interface 定義例

```typescript
// 温泉地の基本情報
interface OnsenBasicInfo {
  id: string;
  slug: string;
  name: string;
  nameKana: string;
  nameEn: string;
  region: {
    prefecture: string;
    area: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

// 温泉情報
interface OnsenInfo {
  springTypes: string[];
  ph?: number;
  temperature?: number;
  flowRate?: string;
  effects: string[];
  characteristics: string[];
}

// アクセス情報
interface AccessInfo {
  nearestStation?: {
    name: string;
    line: string;
    walkingTime?: number;
  };
  fromTokyo: {
    byTrain?: {
      time: number;
      description: string;
    };
    byCar?: {
      time: number;
      distance: number;
      description: string;
    };
  };
  parking?: {
    available: boolean;
    fee?: string;
  };
}

// 宿泊・施設情報
interface AccommodationInfo {
  dayTripAvailable: boolean;
  dayTripFacilities?: string[];
  representativeRyokan?: Array<{
    name: string;
    features: string[];
    priceRange?: string;
  }>;
  features: string[];
}

// コンテンツ情報
interface ContentInfo {
  shortDescription: string;
  longDescription: string;
  highlights?: string[];
  seasons?: {
    spring?: string;
    summer?: string;
    autumn?: string;
    winter?: string;
  };
}

// 画像情報
interface ImageInfo {
  main: string;
  thumbnail: string;
  gallery?: string[];
  credit?: string;
}

// メタ情報
interface MetadataInfo {
  priority: number;
  tags: string[];
  related: string[];
  publishedAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// 完全な温泉地データモデル
interface OnsenDoc extends OnsenBasicInfo {
  onsen: OnsenInfo;
  access: AccessInfo;
  accommodation: AccommodationInfo;
  content: ContentInfo;
  images: ImageInfo;
  metadata: MetadataInfo;
}
```

---

## 📝 JSON データ例

```json
{
  "id": "hakone",
  "slug": "hakone",
  "name": "箱根温泉郷",
  "nameKana": "はこねおんせんきょう",
  "nameEn": "Hakone Onsen",
  "region": {
    "prefecture": "神奈川県",
    "area": "箱根エリア",
    "coordinates": {
      "lat": 35.2333,
      "lng": 139.1033
    }
  },
  "onsen": {
    "springTypes": ["単純泉", "塩化物泉", "炭酸水素塩泉", "硫酸塩泉"],
    "ph": 7.2,
    "temperature": 42,
    "flowRate": "豊富",
    "effects": ["神経痛", "筋肉痛", "関節痛", "冷え性", "疲労回復"],
    "characteristics": ["源泉掛け流し", "露天風呂あり", "多様な泉質"]
  },
  "access": {
    "nearestStation": {
      "name": "箱根湯本駅",
      "line": "小田急線・箱根登山鉄道",
      "walkingTime": 5
    },
    "fromTokyo": {
      "byTrain": {
        "time": 90,
        "description": "小田急線で新宿から約90分"
      },
      "byCar": {
        "time": 90,
        "distance": 80,
        "description": "東名高速道路経由で約90分"
      }
    },
    "parking": {
      "available": true,
      "fee": "施設により異なる"
    }
  },
  "accommodation": {
    "dayTripAvailable": true,
    "dayTripFacilities": ["日帰り温泉施設多数"],
    "representativeRyokan": [
      {
        "name": "強羅花壇",
        "features": ["露天風呂", "富士山眺望", "庭園"],
        "priceRange": "1泊2食 30,000円〜"
      }
    ],
    "features": ["露天風呂", "貸切風呂", "レストラン", "売店"]
  },
  "content": {
    "shortDescription": "年間2000万人が訪れる日本有数の温泉リゾート。20種類以上の泉質を持ち、芦ノ湖や大涌谷など観光スポットも豊富。",
    "longDescription": "## 箱根温泉の魅力\n\n箱根は年間約2,000万人が訪れる日本を代表する温泉リゾートです...",
    "highlights": [
      "17の温泉エリア",
      "20種類以上の泉質",
      "都心から90分でアクセス可能",
      "観光スポットも豊富"
    ],
    "seasons": {
      "spring": "新緑が美しく、気候も過ごしやすい",
      "summer": "標高が高く避暑地として人気",
      "autumn": "紅葉が美しく最も人気のシーズン",
      "winter": "雪景色と湯気が幻想的"
    }
  },
  "images": {
    "main": "hakone",
    "thumbnail": "hakone-thumb",
    "gallery": ["hakone-1", "hakone-2", "hakone-3"],
    "credit": "hakone"
  },
  "metadata": {
    "priority": 10,
    "tags": ["人気", "アクセス良好", "観光", "日帰り可"],
    "related": ["hakone-yunohana", "hakone-gora", "hakone-sengokuhara"],
    "publishedAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-12-01T00:00:00Z"
  }
}
```

---

## 🎨 ページ別の表示項目とJSONフィールド対応

### トップページ（`/`）

#### Hero Section
- **表示項目**: サイトタイトル、キャッチコピー、背景画像
- **JSONフィールド**: `pages.home.hero.*`

#### Featured Sections（人気の温泉地）
- **表示項目**: 
  - 温泉地名（`name`）
  - 短い説明文（`content.shortDescription`）
  - サムネイル画像（`images.thumbnail`）
  - リンク（`slug`）
- **JSONフィールド**: `pages.home.sections[].items[]` から `metadata.priority` の高い順に表示

#### Split Feature Sections（注目の温泉地）
- **表示項目**:
  - 温泉地名（`name`）
  - サブタイトル（`nameEn`）
  - 説明文（`content.shortDescription`）
  - 統計情報（`onsen.springTypes.length`, `region.prefecture` など）
  - メイン画像（`images.main`）
- **JSONフィールド**: `pages.home.sections[].type === 'split-feature'` のセクション

### 一覧ページ（`/docs`）

#### リスト表示
- **表示項目**:
  - 温泉地名（`name`）
  - 都道府県（`region.prefecture`）
  - 短い説明文（`content.shortDescription`）
  - サムネイル画像（`images.thumbnail`）
  - 主な効能（`onsen.effects` の最初の2-3個）
  - アクセス時間（`access.fromTokyo.byTrain.time`）
- **JSONフィールド**: `pages.docs[]` 配列から取得
- **ソート**: `metadata.priority` の降順、または `nameKana` の昇順

#### フィルタリング（将来的な機能）
- **都道府県で絞り込み**: `region.prefecture`
- **泉質で絞り込み**: `onsen.springTypes`
- **効能で絞り込み**: `onsen.effects`
- **日帰り可否**: `accommodation.dayTripAvailable`
- **タグで絞り込み**: `metadata.tags`

### 詳細ページ（`/docs/[slug]`）

#### Hero Header
- **表示項目**:
  - 温泉地名（`name`）
  - サブタイトル（`region.prefecture` + `nameEn`）
  - 説明文（`content.shortDescription`）
  - メイン画像（`images.main`）
  - ImageCredit（`images.credit`）
- **JSONフィールド**: `pages.docs[]` から該当slugを検索

#### 基本情報セクション
- **表示項目**:
  - 都道府県・エリア（`region.prefecture`, `region.area`）
  - 泉質（`onsen.springTypes`）
  - 主な効能（`onsen.effects`）
  - 源泉温度（`onsen.temperature`）
  - pH値（`onsen.ph`）
  - 湧出量（`onsen.flowRate`）
- **JSONフィールド**: `onsen.*`, `region.*`

#### アクセス情報セクション
- **表示項目**:
  - 最寄り駅（`access.nearestStation.name`, `line`）
  - 東京からのアクセス（`access.fromTokyo.byTrain.description`, `byCar.description`）
  - 駐車場情報（`access.parking.available`, `fee`）
- **JSONフィールド**: `access.*`

#### 宿泊・施設情報セクション
- **表示項目**:
  - 日帰り可否（`accommodation.dayTripAvailable`）
  - 日帰り施設（`accommodation.dayTripFacilities`）
  - 代表的な旅館（`accommodation.representativeRyokan[]`）
  - 施設特徴（`accommodation.features`）
- **JSONフィールド**: `accommodation.*`

#### コンテンツセクション
- **表示項目**:
  - 詳細説明（`content.longDescription` - Markdownレンダリング）
  - ハイライトポイント（`content.highlights`）
  - 季節別の魅力（`content.seasons.*`）
- **JSONフィールド**: `content.*`

#### 関連温泉地セクション
- **表示項目**:
  - 関連温泉地のリンク（`metadata.related[]` からslugを取得して表示）
- **JSONフィールド**: `metadata.related[]`

---

## 🔄 移行計画（将来のステップ）

1. **段階的移行**: 既存の `content.json` の構造を維持しつつ、新しいフィールドを追加
2. **後方互換性**: 既存の `title`, `subtitle`, `description`, `image`, `content` フィールドは維持
3. **型定義の更新**: `app/lib/content.ts` の型定義を段階的に拡張
4. **コンポーネントの更新**: 新しいフィールドに対応するコンポーネントを追加

---

**作成日**: 2025-12-03  
**作成者**: Composer (Cursor AI)
