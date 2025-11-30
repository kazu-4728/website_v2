# アーキテクチャ分析と問題点

## 現状の問題点

### 1. 画像が変わっていない問題
- **原因**: Unsplashの画像IDが実際に温泉の画像を指していない可能性
- **確認**: `photo-1600585154340-be6161a56a0c` が実際に温泉画像か確認が必要
- **対応**: より明確に温泉らしい画像URLに変更

### 2. ハンバーガーメニューが機能していない問題
- **原因**: z-indexの問題、またはモバイルメニューの表示ロジックの問題
- **確認**: Header.tsxの実装を確認
- **対応**: z-indexの調整とモバイルメニューの表示ロジックの修正

### 3. サブページのテキスト量が少ない問題
- **原因**: 一部の温泉地（水上、四万、日光湯元、塩原、伊東、修善寺、下田、湯河原、奥多摩、秩父）のテキストが少ない
- **対応**: すべての温泉地のテキストを拡充

### 4. リポジトリ構成の問題
- **問題**: 複数の設定ファイルが存在し、どれが使用されているか不明確
  - `config/site.config.ts` - 使用されていない（grepで見つからなかった）
  - `app/config/theme.config.ts` - 使用されていない可能性
  - `themes/onsen-kanto/content.json` - 実際に使用されている
  - `app/lib/content.ts` - 実際に使用されている

## 実際に使用されているファイル

### コンテンツ管理
- ✅ `themes/onsen-kanto/content.json` - メインのコンテンツファイル
- ✅ `app/lib/content.ts` - コンテンツ読み込みロジック

### 使用されていないファイル（削除または整理が必要）
- ❌ `config/site.config.ts` - 使用されていない
- ❌ `app/config/theme.config.ts` - 使用されていない（onsen-kantoテーマでは不要）

## ファイル依存関係マップ

```
app/layout.tsx
  └─> app/lib/content.ts
      └─> themes/onsen-kanto/content.json

app/page.tsx
  └─> app/lib/content.ts
      └─> themes/onsen-kanto/content.json

app/components/navigation/Header.tsx
  └─> app/components/icons/index.tsx
  └─> (props from layout.tsx)

app/docs/[slug]/page.tsx
  └─> app/lib/content.ts
      └─> themes/onsen-kanto/content.json
```

## 修正計画

1. **画像URLの修正**: すべての画像を明確に温泉らしいものに変更
2. **ハンバーガーメニューの修正**: z-indexと表示ロジックの修正
3. **テキストの拡充**: すべてのサブページのテキストを拡充
4. **リポジトリ構成の整理**: 使用されていないファイルの削除または整理
