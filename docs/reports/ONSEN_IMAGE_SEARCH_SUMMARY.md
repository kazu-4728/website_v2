# 関東温泉の実在画像検索結果サマリー

最終更新: 2025-01-XX

## 📊 検索結果概要

- **検索対象温泉数**: 16
- **既存画像数**: 53（重複チェック済み）
- **自動検索で見つかった画像**: 5件（Wikimedia Commons）

## ✅ 自動検索で見つかった画像（Wikimedia Commons）

以下の温泉で、Wikimedia Commonsから自動で画像が見つかりました：

### 1. 伊香保温泉（群馬県）
- **Ikaho open air bath.JPG**
  - URL: `https://upload.wikimedia.org/wikipedia/commons/I/Ik/Ikaho_open_air_bath.JPG`
  - ソース: Wikimedia Commons
  - ライセンス: CC BY-SA / CC BY（要確認）
  - 説明: 露天風呂の画像

- **Ikaho Onsen 04.JPG**
  - URL: `https://upload.wikimedia.org/wikipedia/commons/I/Ik/Ikaho_Onsen_04.JPG`
  - ソース: Wikimedia Commons
  - ライセンス: CC BY-SA / CC BY（要確認）
  - 説明: 伊香保温泉の画像

### 2. 水上温泉郷（群馬県）
- **Takaragawa Onsen 01.jpg**
  - URL: `https://upload.wikimedia.org/wikipedia/commons/T/Ta/Takaragawa_Onsen_01.jpg`
  - ソース: Wikimedia Commons
  - ライセンス: CC BY-SA / CC BY（要確認）
  - 説明: 宝川温泉の露天風呂

### 3. 四万温泉（群馬県）
- **Yamagutirotenburo.jpg**
  - URL: `https://upload.wikimedia.org/wikipedia/commons/Y/Ya/Yamagutirotenburo.jpg`
  - ソース: Wikimedia Commons
  - ライセンス: CC BY-SA / CC BY（要確認）
  - 説明: 山の宿の露天風呂

### 4. 日光湯元温泉（栃木県）
- **にごり湯源泉かけ流し硫黄泉.jpg**
  - URL: `https://upload.wikimedia.org/wikipedia/commons/に/にご/にごり湯源泉かけ流し硫黄泉.jpg`
  - ソース: Wikimedia Commons
  - ライセンス: CC BY-SA / CC BY（要確認）
  - 説明: 硫黄泉の源泉かけ流し

## 🔍 手動検索が必要な温泉

以下の温泉は、手動でGoogle検索やフリー画像サイトで検索する必要があります：

1. **箱根温泉郷**（神奈川県）
2. **草津温泉**（群馬県）
3. **鬼怒川温泉**（栃木県）
4. **那須温泉郷**（栃木県）
5. **塩原温泉郷**（栃木県）
6. **熱海温泉**（静岡県）
7. **伊東温泉**（静岡県）
8. **修善寺温泉**（静岡県）
9. **下田温泉**（静岡県）
10. **湯河原温泉**（神奈川県）
11. **奥多摩温泉**（東京都）
12. **秩父温泉**（埼玉県）

## 📝 手動検索の手順

各温泉について、以下のURLから手動で検索してください：

### Google検索（フリー画像のみ）
- `{温泉名} 温泉 露天風呂` で検索
- `{温泉名} 温泉 無料画像` で検索
- `{都道府県} {温泉名} 温泉` で検索

### フリー画像サイト
- **Unsplash**: `https://unsplash.com/s/photos/{温泉名} 温泉`
- **Pexels**: `https://www.pexels.com/search/{温泉名} 温泉/`
- **Pixabay**: `https://pixabay.com/images/search/{温泉名} 温泉/`
- **Wikimedia Commons**: `https://commons.wikimedia.org/wiki/Category:{温泉名} 温泉`

詳細な検索URLは `docs/reports/ONSEN_IMAGE_SEARCH_RESULTS.md` を参照してください。

## ✅ 画像選定の基準

以下の条件を満たす画像を選定してください：

1. ✅ **実際の温泉、お湯が映っている**（湯船・露天風呂が明確に写っている）
2. ✅ **どこの温泉か分かる**（看板・風景・特徴的な建物などで特定可能）
3. ✅ **フリーライセンス**（商用利用可）
4. ✅ **既存画像と重複していない**
5. ❌ **抽象的な風景写真**（温泉が写っていない）
6. ❌ **人物が主役の写真**（プライバシー問題）

## 🔧 テーマ変更への対応

このスクリプトは、`themes/onsen-kanto/content.json` から温泉情報を動的に読み込むため、**テーマを変更しても動作します**。

### テーマ変更時の手順

1. 新しいテーマの `content.json` を `themes/{theme-name}/content.json` に配置
2. スクリプトを実行：
   ```bash
   python3 scripts/search-onsen-images-free.py
   ```
3. 生成された `docs/reports/ONSEN_IMAGE_SEARCH_RESULTS.md` を確認
4. 手動検索URLから画像を選定

### 注意事項

- スクリプトは `pages.docs` 配列から温泉情報を読み込みます
- `onsen` フィールドがある場合は、そこから情報を取得
- `onsen` フィールドがない場合は、`title` から温泉名を推測
- 既存画像の重複チェックは、`data/wikimedia-images.json` と `app/lib/images.ts` から読み込みます

## 📋 次のステップ

1. 自動検索で見つかった画像のライセンス情報を確認
2. 手動検索URLから各温泉の画像を選定
3. 選定した画像のURL、ライセンス、撮影者情報を記録
4. `app/lib/images.ts` と `data/wikimedia-images.json` を更新
