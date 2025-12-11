# アーキテクチャ設計書

## 設計原則

1. **単一の情報源**: `themes/onsen-kanto/content.json`が唯一のコンテンツソース
2. **明確な依存関係**: すべてのファイルの依存関係を明確化
3. **使用されていないファイルの削除**: 不要なファイルは削除または整理

## ファイル構成

### 実際に使用されているファイル

```
themes/onsen-kanto/content.json  # メインコンテンツ（唯一の情報源）
app/lib/content.ts                # コンテンツ読み込みロジック
app/layout.tsx                    # ルートレイアウト（ヘッダーを含む）
app/page.tsx                      # トップページ
app/components/navigation/Header.tsx  # ヘッダーコンポーネント
app/components/icons/index.tsx    # アイコンマッピング
```

### 削除または整理が必要なファイル

```
config/site.config.ts            # 使用されていない（削除推奨）
app/config/theme.config.ts       # 使用されていない（onsen-kantoでは不要）
```

## データフロー

```
1. ユーザーがページにアクセス
   ↓
2. app/layout.tsx が loadContent() を呼び出し
   ↓
3. app/lib/content.ts が themes/onsen-kanto/content.json を読み込む
   ↓
4. データが各コンポーネントに渡される
   ↓
5. コンポーネントがデータを表示
```

## 修正計画

### 1. ハンバーガーメニューの修正
- z-indexの確認と調整
- モバイルメニューの表示ロジックの改善
- ヘッダーの高さに応じた動的な調整

### 2. 画像URLの修正
- すべての画像を明確に温泉らしいものに変更
- Unsplashの画像IDを確認し、適切なものに変更

### 3. テキストの拡充
- すべてのサブページのテキストを拡充
- 最低でも300文字以上を目標

### 4. リポジトリ構成の整理
- 使用されていないファイルの削除
- ドキュメントの整理
