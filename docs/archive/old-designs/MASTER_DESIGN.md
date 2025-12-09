# マスターデザイン設計書

## 🎯 このリポジトリの目的

**関東温泉ガイドサイト専用**のJSON-first構造のNext.jsサイトです。

## 📁 ディレクトリ構成（最終版）

```
/
├── app/                          # Next.js App Router
│   ├── components/             # 再利用可能なコンポーネント
│   │   ├── navigation/         # ナビゲーション
│   │   │   └── Header.tsx      # ⭐ ヘッダーコンポーネント
│   │   ├── home/               # ホームページ用コンポーネント
│   │   ├── ui/                 # UIコンポーネント
│   │   └── icons/              # アイコンコンポーネント
│   ├── lib/                     # ユーティリティ関数
│   │   └── content.ts          # ⭐ コンテンツ読み込みロジック
│   ├── page.tsx                # トップページ
│   ├── layout.tsx              # ⭐ ルートレイアウト
│   └── [各ページ]/              # 各ページ
├── themes/                      # テーマ設定
│   └── onsen-kanto/            # 関東温泉テーマ
│       └── content.json        # ⭐⭐⭐ 唯一のコンテンツソース（最重要）
├── docs/                        # ドキュメント（整理済み）
│   ├── README.md               # ドキュメント一覧
│   ├── QUICK_START.md          # クイックスタートガイド
│   ├── INDEX.md                # ドキュメントインデックス
│   ├── FILE_STRUCTURE.md       # ファイル構造ガイド
│   ├── MASTER_DESIGN.md        # このファイル
│   ├── architecture/           # アーキテクチャ設計
│   ├── development/            # 開発ドキュメント
│   └── deployment/             # デプロイ関連
├── public/                      # 静的ファイル
│   └── images/                 # 画像ファイル
└── scripts/                     # スクリプト
```

## 🔑 最重要ファイル

### `/themes/onsen-kanto/content.json` ⭐⭐⭐
**役割**: サイト全体のコンテンツを定義（唯一の情報源）

**編集方法**: JSONファイルを編集するだけ

**構造**:
```json
{
  "site": {
    "name": "サイト名",
    "logo": { "text": "ロゴテキスト", "icon": "アイコン名" },
    "metadata": { "title": "タイトル", "description": "説明" }
  },
  "navigation": [ /* ナビゲーションメニュー */ ],
  "pages": {
    "home": { /* トップページ */ },
    "docs": [ /* ドキュメントページ */ ],
    "blog": { /* ブログページ */ },
    "features": { /* フィーチャーページ */ },
    "contact": { /* お問い合わせページ */ }
  }
}
```

## 🔄 データフロー

```
1. ユーザーがページにアクセス
   ↓
2. Next.jsが該当するページコンポーネントを読み込む
   ↓
3. ページコンポーネントが loadContent() を呼び出し
   ↓
4. app/lib/content.ts が themes/onsen-kanto/content.json を読み込む
   ↓
5. データがページコンポーネントに返される
   ↓
6. ページコンポーネントがデータを各セクションコンポーネントに渡す
   ↓
7. セクションコンポーネントがデータを表示
```

## 📝 編集ガイド

### コンテンツ編集者（非エンジニア）向け

**編集するファイル**: `/themes/onsen-kanto/content.json`

**編集可能な項目**:
- サイト名、ロゴ、メタデータ
- ナビゲーションメニュー
- 各ページのコンテンツ
- 画像URL
- テキスト内容

**編集方法**: JSONファイルを編集するだけ

### 開発者向け

**見るべきファイル**:
- `/docs/architecture/MASTER_ARCHITECTURE.md` - 完全なアーキテクチャ設計
- `/app/lib/content.ts` - コンテンツ読み込みロジック
- `/app/components/navigation/Header.tsx` - ヘッダーコンポーネント

**コードを変更する場合**:
- コンポーネントの追加・修正: `/app/components/`
- ページの追加・修正: `/app/[ページ名]/`
- コンテンツ読み込みロジックの変更: `/app/lib/content.ts`

## 🚫 使用されていないファイル

- ❌ `config/site.config.ts` - 削除済み
- ⚠️ `app/config/theme.config.ts` - 使用されていないが、将来の拡張のために保持

## ✅ 設計の確認

この設計により、以下のことが保証されます：

1. **明確な情報源**: `content.json`が唯一のコンテンツソース
2. **編集の容易さ**: 非エンジニアでもJSONを編集するだけでコンテンツを変更可能
3. **型安全性**: TypeScriptの型定義により、JSONの構造が保証される
4. **保守性**: ファイル構成が明確で、どこを編集すればよいかが分かる
5. **ドキュメントの整理**: すべてのドキュメントが`/docs`ディレクトリに整理されている

## 📚 ドキュメントの場所

- **クイックスタート**: `/docs/QUICK_START.md`
- **マスターアーキテクチャ**: `/docs/architecture/MASTER_ARCHITECTURE.md`
- **ファイル構造**: `/docs/FILE_STRUCTURE.md`
- **ドキュメントインデックス**: `/docs/INDEX.md`
