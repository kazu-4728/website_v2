# 画像取得方法ガイド

作成日: 2025年1月

## 1. 現状の問題

**問題**: 画像メインなサイトで温泉画像が全く表示されていない

**原因の可能性**:
1. `data/wikimedia-images.json`には画像URLが存在しているが、実際に表示されていない
2. `getOnsenImage()`関数が正しく動作していない可能性
3. Next.jsのImageコンポーネントが外部URLを正しく読み込めていない可能性

## 2. 画像取得の仕組み

### 2.1 画像取得の流れ

```
1. ビルド前: scripts/fetch-wikimedia-images.js を実行
   ↓
2. Wikimedia Commons APIから画像を検索・取得
   ↓
3. data/wikimedia-images.json に保存
   ↓
4. ビルド時: app/lib/images.ts の getOnsenImage() が読み込み
   ↓
5. 実行時: app/lib/content.ts の resolveImageUrls() が画像URLを解決
   ↓
6. コンポーネント: Next.js Imageコンポーネントで表示
```

### 2.2 画像取得方法

#### 方法1: スクリプトで一括取得（推奨）

```bash
# すべての温泉地の画像を取得
node scripts/fetch-wikimedia-images.js
```

このスクリプトは：
- Wikimedia Commons APIを使用して画像を検索
- 各温泉地に適した画像を自動選択
- `data/wikimedia-images.json`に保存

#### 方法2: 手動で画像を追加

`data/wikimedia-images.json`に直接追加：

```json
{
  "温泉地のスラッグ": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/...",
    "author": "作者名",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "title": "画像のタイトル"
  }
}
```

#### 方法3: プログラムから動的取得（非推奨）

`app/lib/wikimedia.ts`の`getOnsenImageFromWikimedia()`を使用できますが、API制限があるため非推奨です。

## 3. 画像が表示されない場合の確認手順

### 3.1 データファイルの確認

```bash
# data/wikimedia-images.jsonが存在し、データが入っているか確認
cat data/wikimedia-images.json | jq 'keys'
```

### 3.2 画像URLの確認

```bash
# 特定の温泉地の画像URLを確認
node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync('data/wikimedia-images.json', 'utf-8')); console.log(data.hakone?.url);"
```

### 3.3 画像URLが正しく解決されているか確認

```bash
# ビルドして画像URLが正しく解決されているか確認
npm run build
```

### 3.4 ブラウザで画像URLに直接アクセス

`data/wikimedia-images.json`のURLをブラウザで直接開いて、画像が表示されるか確認。

## 4. 画像取得スクリプトの使い方

### 4.1 基本的な使い方

```bash
# すべての温泉地の画像を取得
node scripts/fetch-wikimedia-images.js
```

### 4.2 特定の温泉地のみ取得

スクリプトを編集して、`onsenSearchTerms`から必要な温泉地のみを残す。

### 4.3 検索キーワードのカスタマイズ

`scripts/fetch-wikimedia-images.js`の`onsenSearchTerms`を編集：

```javascript
const onsenSearchTerms = {
  hakone: [
    'Hakone Onsen hot spring 温泉',
    'Hakone Onsen 箱根温泉',
    // カスタムキーワードを追加
  ],
  // ...
};
```

## 5. 画像の品質チェック

### 5.1 画像が温泉であることを確認

スクリプトは以下の条件で画像をフィルタリングしています：

- ✅ 含まれるキーワード: `onsen`, `hot spring`, `温泉`, `露天風呂`, `rotenburo`, `湯畑`
- ❌ 除外キーワード: `entrance`, `gate`, `bridge`, `railway`, `station`, `city`, `town`

### 5.2 手動で画像を確認

1. `data/wikimedia-images.json`のURLをブラウザで開く
2. 画像が実際に温泉であることを確認
3. 不適切な画像の場合は、スクリプトを再実行するか、手動で置き換える

## 6. 画像の追加・更新

### 6.1 新しい温泉地の画像を追加

1. `scripts/fetch-wikimedia-images.js`の`onsenSearchTerms`に追加：

```javascript
const onsenSearchTerms = {
  // ...
  'new-onsen': [
    'New Onsen 新温泉 露天風呂',
    'New Onsen hot spring japan',
  ],
};
```

2. スクリプトを実行：

```bash
node scripts/fetch-wikimedia-images.js
```

### 6.2 既存の画像を更新

1. `data/wikimedia-images.json`から該当するエントリを削除
2. スクリプトを再実行：

```bash
node scripts/fetch-wikimedia-images.js
```

### 6.3 手動で画像を置き換え

1. Wikimedia Commonsで適切な画像を探す
2. `data/wikimedia-images.json`を編集してURLを更新

## 7. トラブルシューティング

### 7.1 画像が取得できない

**原因**: API制限、ネットワークエラー、検索キーワードが不適切

**解決策**:
1. 少し時間を置いてから再実行
2. 検索キーワードを変更
3. 手動で画像を追加

### 7.2 画像が表示されない

**原因**: URLが正しく解決されていない、Next.jsの設定問題

**解決策**:
1. `next.config.mjs`で`remotePatterns`に`upload.wikimedia.org`が含まれているか確認
2. `app/lib/images.ts`の`getOnsenImage()`が正しく動作しているか確認
3. ビルドログを確認

### 7.3 画像の品質が低い

**原因**: 検索結果に適切な画像がない

**解決策**:
1. 検索キーワードを変更
2. 手動でより良い画像を探して追加
3. 複数の検索キーワードを試す

## 8. ベストプラクティス

### 8.1 画像の選定基準

1. **明確に温泉であること**: 湯船、露天風呂、湯畑などが写っている
2. **高品質**: 解像度が高く、鮮明である
3. **適切なライセンス**: CC BY、CC BY-SA、Public Domainなど
4. **場所が明確**: 該当する温泉地の画像である

### 8.2 画像の管理

1. **定期的な更新**: 定期的にスクリプトを実行して最新の画像を取得
2. **バックアップ**: `data/wikimedia-images.json`をGitで管理
3. **品質チェック**: 取得した画像を手動で確認

### 8.3 パフォーマンス

1. **画像の最適化**: 将来的に画像最適化を実装（現在は`unoptimized: true`）
2. **遅延読み込み**: Next.js Imageコンポーネントの`loading="lazy"`を使用
3. **キャッシュ**: `data/wikimedia-images.json`をキャッシュしてAPI呼び出しを減らす

## 9. 次のステップ

### 9.1 画像取得の自動化

- GitHub Actionsで定期的に画像を取得
- 画像の品質チェックを自動化

### 9.2 画像の最適化

- ビルド時に画像を最適化
- WebP形式への変換
- 画像サイズの最適化

### 9.3 画像ギャラリー

- 各温泉地に複数の画像を表示
- 画像のスライダー・ギャラリー機能

## 10. 参考リンク

- [Wikimedia Commons API](https://www.mediawiki.org/wiki/API:Main_page)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Creative Commons Licenses](https://creativecommons.org/licenses/)
