# 複数無料API統合画像取得スクリプト

作成日: 2025年1月

## ⚠️ 重要な注意事項

**画像取得のワークフロー**:
1. このスクリプトを実行して画像を取得
2. 取得した画像は`data/wikimedia-images.json`に保存されます
3. **取得した画像は自動的にサイトに反映されません**
4. **ユーザーが画像を確認し、使用するか判断します**
5. ユーザーの承認を得てから、サイトに反映してください

**エージェント向け**: 画像を取得するだけで、**勝手にサイトに反映しないでください**

## 概要

`scripts/fetch-onsen-images-multi-api.js` は、複数の無料画像APIを統合して、確実に温泉画像を取得するスクリプトです。

## 対応API

### 1. Wikimedia Commons API（最優先）
- **無料**: ✓
- **登録**: 不要
- **レート制限**: なし（推奨制限あり）
- **日本語対応**: ✓
- **特徴**: 最も確実、高品質な画像が多い

### 2. Pixabay API
- **無料**: ✓
- **登録**: 必要（無料）
- **レート制限**: 制限なし（レート制限あり）
- **日本語対応**: 限定的
- **特徴**: 多様な画像、商用利用可能

### 3. Pexels API
- **無料**: ✓
- **登録**: 必要（無料）
- **レート制限**: 200リクエスト/時間
- **日本語対応**: 限定的
- **特徴**: 高品質な写真、商用利用可能

### 4. Unsplash API
- **無料**: ✓
- **登録**: 必要（無料）
- **レート制限**: 50リクエスト/時間
- **日本語対応**: 限定的
- **特徴**: 非常に高品質、レート制限が厳しい

## 使用方法

### 基本的な使い方（Wikimedia Commonsのみ）

```bash
node scripts/fetch-onsen-images-multi-api.js
```

### APIキーを設定して使用

```bash
# 環境変数にAPIキーを設定
export PIXABAY_API_KEY=your_pixabay_api_key
export PEXELS_API_KEY=your_pexels_api_key
export UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# スクリプトを実行
node scripts/fetch-onsen-images-multi-api.js
```

### .envファイルを使用

`.env`ファイルに以下を追加：

```
PIXABAY_API_KEY=your_pixabay_api_key
PEXELS_API_KEY=your_pexels_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

## APIキーの取得方法

### Pixabay APIキー
1. https://pixabay.com/api/docs/ にアクセス
2. 「Get API Key」をクリック
3. 無料アカウントを作成
4. APIキーを取得

### Pexels APIキー
1. https://www.pexels.com/api/ にアクセス
2. 「Get Started」をクリック
3. 無料アカウントを作成
4. APIキーを取得

### Unsplash APIキー
1. https://unsplash.com/developers にアクセス
2. 「Register as a developer」をクリック
3. 無料アカウントを作成
4. 「New Application」を作成
5. Access Keyを取得

## 検索の優先順位

1. **Wikimedia Commons**（最優先）
   - すべての検索キーワードを試す
   - 温泉が写っている画像のみを選択

2. **Pixabay**（APIキーがある場合）
   - 最初の2つの検索キーワードを試す

3. **Pexels**（APIキーがある場合）
   - 最初の2つの検索キーワードを試す

4. **Unsplash**（APIキーがある場合）
   - 最初の検索キーワードのみを試す（レート制限が厳しいため）

## 画像の選択基準

### 必須条件
- 「rotenburo」「露天風呂」「bath」「浴場」などのキーワードが含まれている
- 除外キーワード（建物、風景、入口など）を含まない
- 適切なライセンス（CC BY、CC BY-SA、Public Domainなど）

### 優先度
- **優先度10**: 露天風呂・湯畑などの明確なキーワード
- **優先度8**: 浴場・湯船などのキーワード
- **優先度5**: 湯気・源泉などのキーワード

## 出力

結果は `data/wikimedia-images.json` に保存されます。

形式：
```json
{
  "hakone": {
    "url": "https://...",
    "author": "Author Name",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://...",
    "title": "Image Title",
    "source": "wikimedia"
  }
}
```

## トラブルシューティング

### 画像が見つからない場合

1. **検索キーワードを確認**
   - より具体的なキーワードを試す
   - 英語と日本語の両方を試す

2. **APIキーを確認**
   - 環境変数が正しく設定されているか確認
   - APIキーが有効か確認

3. **レート制限を確認**
   - しばらく待ってから再実行
   - レート制限が緩いAPI（Wikimedia Commons、Pixabay）を優先

### APIキーがない場合

APIキーがなくても、Wikimedia Commons APIは使用できます。他のAPIのキーを設定すると、より多くの画像候補から選択できます。

## 既存スクリプトとの違い

- `scripts/fetch-wikimedia-images.js`: Wikimedia Commonsのみ
- `scripts/fetch-onsen-images-multi-api.js`: 複数API統合版（新規）

## 推奨される使用方法

1. **まずはWikimedia Commonsのみで試す**
   ```bash
   node scripts/fetch-onsen-images-multi-api.js
   ```

2. **画像が見つからない場合、APIキーを設定**
   - Pixabay APIキーを取得（最も簡単）
   - Pexels APIキーを取得
   - Unsplash APIキーを取得（レート制限が厳しい）

3. **再実行**
   ```bash
   export PIXABAY_API_KEY=your_key
   node scripts/fetch-onsen-images-multi-api.js
   ```

## 参考

- [無料画像API一覧](./FREE_IMAGE_APIS.md)
- [画像取得ガイド](./IMAGE_FETCH_GUIDE.md)
- [画像収集精度向上](./IMAGE_COLLECTION_IMPROVEMENT.md)
