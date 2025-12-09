# エージェント向けガイド

このドキュメントは、このリポジトリで作業するAIエージェント向けのガイドです。

## 🚨 重要な原則

### 1. 画像の取得と使用について

**重要**: 取得した画像は**自動的にサイトに反映しません**。

- 画像取得スクリプトで取得した画像は、`data/wikimedia-images.json`に保存されます
- **ユーザーが画像を確認し、使用するか判断します**
- エージェントは画像を取得するだけで、**勝手にサイトに反映しないでください**

**画像取得のワークフロー**:
1. スクリプトを実行して画像を取得
2. `data/wikimedia-images.json`に保存
3. 取得した画像のリストをユーザーに報告
4. **ユーザーが確認・承認してから**サイトに反映

### 2. JSON Firstアーキテクチャ

- すべてのユーザー向けテキストは`themes/onsen-kanto/texts.json`で管理
- コンテンツ構造は`themes/onsen-kanto/content.json`で管理
- ReactコンポーネントはJSONからデータを読み込んで表示するだけ

### 3. ファイルの編集権限

#### ✅ 編集可能（OK）
- `app/components/` - UIコンポーネント
- `app/lib/` - ライブラリ関数（型定義含む）
- `themes/onsen-kanto/texts.json` - テキストの追加・変更
- `themes/onsen-kanto/content.json` - コンテンツ構造の追加・変更
- `docs/` - ドキュメント（設計書、ガイドなど）

#### ❌ 編集禁止（NG）
- `.github/workflows/` - CI/CD設定（特別な理由がない限り）
- `package.json` / `package-lock.json` - 依存関係（変更時は慎重に）
- `next.config.*` / `tsconfig.*` - 設定ファイル（変更時は影響を確認）

## 📁 ディレクトリ構造の理解

### エージェントが使用するファイル

```
docs/
├── AGENT_GUIDE.md          # ← このファイル（エージェント向けガイド）
├── START_HERE.md           # 作業開始時の必須確認事項
├── FUTURE_TASKS.md         # 今後の課題一覧
├── design/                 # 設計ドキュメント
│   ├── DESIGN_CONCEPTION_V4.md      # 設計構想（最新版）
│   ├── DESIGN_CONCEPTION_SUMMARY.md # 設計構想サマリー
│   └── UI_DESIGN_V3.md              # UI設計書
├── images/                 # 画像システムドキュメント
│   ├── MULTI_API_IMAGE_FETCH.md     # 画像取得システムガイド
│   └── IMAGE_FETCH_RECOMMENDATIONS.md # 画像取得推奨事項
└── architecture/           # アーキテクチャドキュメント
    └── MASTER_ARCHITECTURE.md
```

### ユーザーが確認・判断するファイル

```
data/
└── wikimedia-images.json   # 取得した画像のリスト（ユーザーが確認して使用を判断）

scripts/
└── fetch-onsen-images-multi-api.js  # 画像取得スクリプト（実行はOK、結果はユーザー確認）
```

## 🔄 作業フロー

### 画像取得の作業フロー

**重要**: 画像取得は**ユーザーの指示がある場合のみ**実行します。

1. **ユーザーが画像取得を指示**
   - Chatで「○○温泉の画像を取得して」などと指示

2. **エージェントが画像を取得**
   - `scripts/fetch-onsen-images-multi-api.js`を実行
   - 取得した画像のURLをChatに表示

3. **ユーザーが画像を確認**
   - Chatに表示された画像リンクを確認
   - 画像の品質・適切性を判断

4. **ユーザーが判断**
   - **OK**: 「この画像を使用して」→ エージェントが`data/wikimedia-images.json`に追加
   - **NG**: 「再取得して」または「この画像を使用して」（ユーザーがChatに画像をアップロード）

5. **エージェントがサイトに反映**
   - 承認された画像を`data/wikimedia-images.json`に追加
   - `content.json`の`image`フィールドにキーを設定（必要に応じて）

詳細は [`IMAGE_WORKFLOW.md`](./IMAGE_WORKFLOW.md) を参照してください。

### 一般的な作業フロー

1. **作業開始前の確認**
   - `docs/START_HERE.md`を読む
   - `docs/FUTURE_TASKS.md`で課題を確認
   - `docs/AGENT_GUIDE.md`（このファイル）を読む

2. **設計の確認**
   - `docs/design/DESIGN_CONCEPTION_V4.md`で設計構想を確認
   - JSON Firstアーキテクチャを理解

3. **実装**
   - 小さな変更から始める
   - JSON Firstアーキテクチャを維持
   - 型安全性を確保

4. **テスト・確認**
   - ビルドが成功することを確認
   - 型エラーがないことを確認
   - 動作確認

## ⚠️ 注意事項

### 画像に関する注意

- **画像を自動的にサイトに反映しない**
- 取得した画像は必ずユーザーに報告し、確認を得る
- 画像の品質・適切性を評価して報告する

### JSON Firstアーキテクチャに関する注意

- ハードコードされたテキストを追加しない
- すべてのテキストは`texts.json`で管理
- コンテンツ構造は`content.json`で管理

### コミット・プッシュに関する注意

- `main`ブランチには直接pushしない（明示的な指示がある場合を除く）
- コミットメッセージは明確に
- ビルドが成功することを確認してからコミット

## 📚 参考ドキュメント

- `docs/START_HERE.md` - 作業開始時の必須確認事項
- `docs/FUTURE_TASKS.md` - 今後の課題一覧
- `docs/design/DESIGN_CONCEPTION_V4.md` - 設計構想（最新版）
- `docs/images/MULTI_API_IMAGE_FETCH.md` - 画像取得システムガイド
- `.cursorrules` - Cursorルール（このファイルと重複する内容あり）
