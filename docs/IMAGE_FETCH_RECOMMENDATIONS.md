# 画像取得の推奨事項

作成日: 2025年1月

## 現状の評価

### 精度
- ✅ **格段に向上**: 温泉が写っている画像のみを選択
- ✅ **質が高い**: 取得できた画像は適切

### 件数
- ⚠️ **少ない**: 21箇所中5箇所のみ取得
- ⚠️ **改善の余地あり**: 検索キーワードやAPIの追加で改善可能

## 推奨される改善案

### 案1: 環境変数にAPIキーを設定（最優先・推奨）

**理由**:
- 最も確実に件数を増やせる
- 複数のAPIから選択できる
- 既存のスクリプトをそのまま使用可能

**手順**:

1. **Pixabay APIキーを取得**（推奨）
   - URL: https://pixabay.com/api/docs/
   - 無料アカウントを作成
   - APIキーを取得
   - 制限: なし（レート制限あり）

2. **環境変数に設定**
   ```bash
   export PIXABAY_API_KEY=your_pixabay_api_key
   ```

3. **スクリプトを再実行**
   ```bash
   node scripts/fetch-onsen-images-multi-api.js
   ```

**期待される効果**:
- 取得件数が大幅に増加
- より多様な画像から選択可能

### 案2: 検索条件の段階的緩和

**理由**:
- 厳格な条件で見つからない場合のフォールバック
- 件数を増やせる

**実装内容**:
1. **第1段階**: 現在の厳格な条件（必須キーワード必須）
2. **第2段階**: 条件を緩和（必須キーワードを1つ減らす）
3. **第3段階**: さらに緩和（場所名のみで検索）

**注意**: 精度を保つため、第1段階で見つかった画像を優先

### 案3: 手動で確認した画像を直接追加

**理由**:
- 確実に適切な画像を追加できる
- 精度を保ちながら件数を増やせる

**手順**:
1. Wikimedia Commonsで手動で検索
2. 適切な画像を見つける
3. `data/wikimedia-images.json`に直接追加

**例**:
```json
{
  "hakone": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/...",
    "author": "Author Name",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "title": "Image Title",
    "source": "wikimedia"
  }
}
```

### 案4: 検索キーワードの追加改善

**実施済みの改善**:
- 箱根: "Hakone Gora", "Hakone Ashinoyu"を追加
- 鬼怒川: "Kinugawa Kogen"を追加
- 那須: "Nasu Kogen"を追加
- 熱海: "Atami ocean view"を追加

**追加改善案**:
- 各温泉地の具体的な施設名を追加
- 英語と日本語の両方で検索
- より多様なキーワードパターンを試す

## 推奨される実行順序

### ステップ1: Pixabay APIキーを設定（推奨）

```bash
# 1. Pixabay APIキーを取得
# https://pixabay.com/api/docs/

# 2. 環境変数に設定
export PIXABAY_API_KEY=your_key

# 3. スクリプトを実行
node scripts/fetch-onsen-images-multi-api.js
```

### ステップ2: 結果を確認

- 取得できた画像のURLを確認
- 精度を確認
- 件数を確認

### ステップ3: 必要に応じて追加改善

- 検索条件の段階的緩和を実装
- 手動で確認した画像を追加
- 検索キーワードを追加

## その他の無料画像API

### Flickr API
- **無料プラン**: 3,600リクエスト/日
- **特徴**: ユーザー投稿写真、ライセンス多様
- **日本語対応**: あり

### Openverse API（旧CC Search）
- **無料プラン**: 制限なし
- **特徴**: Creative Commonsライセンスの画像検索
- **日本語対応**: 限定的

## まとめ

**最優先**: Pixabay APIキーを設定してスクリプトを再実行

**次**: 結果を確認して、必要に応じて追加改善

**長期**: 手動で確認した画像を直接追加（確実性が高い）
