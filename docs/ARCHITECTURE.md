# アーキテクチャ設計書 (ARCHITECTURE.md)

## 1. ディレクトリ構造

```
/
├── app/
│   ├── components/       # UIコンポーネント
│   │   ├── core/         # 原子的なUI部品 (Button, Input, Typography)
│   │   ├── modules/      # 機能単位のコンポーネント (Hero, CardGrid, Nav)
│   │   ├── templates/    # ページレイアウトテンプレート
│   │   └── _legacy/      # 旧コンポーネント退避場所
│   ├── lib/              # ロジック・ユーティリティ
│   │   ├── content/      # JSON読み込み・型定義
│   │   └── images/       # 画像解決ロジック
│   └── [routes]/         # ページルーティング
├── docs/                 # ドキュメント
├── public/               # 静的アセット
├── themes/               # テーマ定義
│   ├── _template/        # 新規テーマ作成用テンプレート
│   └── [theme-name]/     # 各テーマの実体
│       ├── content.json  # コンテンツデータ
│       ├── texts.json    # UIテキスト
│       └── theme.json    # デザイン設定（予定）
└── ...
```

## 2. データフロー (JSON First)

### 2.1 データの流れ
1.  **JSON定義**: `themes/[theme]/content.json` にページ構成とデータを定義。
2.  **ロード**: `app/lib/content.ts` がJSONを読み込み、型チェックを行う。
3.  **注入**: ページコンポーネント (`app/page.tsx` 等) がデータを取得し、各コンポーネントにPropsとして渡す。
4.  **描画**: コンポーネントは受け取ったデータを元にUIを描画する。

### 2.2 画像解決
1.  **キー指定**: JSON内では画像パスではなく「キー（例: `hero-main`）」を指定する。
2.  **解決**: `app/lib/images.ts` (または `ImageResolver`) がキーを受け取り、最適な画像URLを返す。
    *   開発時/ローカル: `public/images/` または外部URL
    *   本番: 最適化されたCDN URLなど（将来拡張）

## 3. コンポーネント設計

### 3.1 分類方針
*   **Core**: スタイルや基本動作を持つ最小単位。外部依存を持たない。
    *   例: `PrimaryButton`, `Heading`, `Icon`
*   **Modules**: 特定の機能やセクションを実現する。Coreや他のModuleを組み合わせる。JSONデータを受け取る。
    *   例: `FullscreenHero`, `FeatureGrid`, `GlobalNavigation`
*   **Templates**: ページ全体の構造を定義する。Modulesを配置する枠組み。
    *   例: `ImmersiveLayout`, `ArticleLayout`

### 3.2 設計ルール
*   **汎用性**: 特定のドメイン（温泉など）に依存する命名やロジックを避ける。
    *   NG: `OnsenRank`
    *   OK: `RatingBadge`
*   **Props設計**: デザイン調整用のパラメータ（配色、配置など）もPropsで受け取れるようにする。

## 4. テーマシステム

### 4.1 テーマの構成要素
*   **Content**: 何を表示するか（構造とデータ）
*   **Texts**: UIのラベル（ボタン名、エラーメッセージ）
*   **Design**: どう表示するか（配色パレット、フォント設定、角丸の大きさなど）

### 4.2 切り替えメカニズム
*   環境変数 `NEXT_PUBLIC_ACTIVE_THEME` または設定ファイルでアクティブなテーマを指定。
*   ビルド時に該当テーマのJSONが読み込まれ、静的サイトとして生成される。

## 5. 技術スタック詳細

*   **Next.js**: App Router, Server Components活用。
*   **Tailwind CSS**: ユーティリティファースト。テーマ設定は `tailwind.config.js` で動的に読み込む（将来構想）。
*   **Framer Motion**: アニメーション実装。
*   **TypeScript**: 厳格な型定義。`any` の使用禁止。
