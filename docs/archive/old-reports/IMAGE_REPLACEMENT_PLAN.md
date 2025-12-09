# 画像置き換え計画

最終更新: 2025-01-XX

## 📋 置き換えが必要な画像

### 1. 那須温泉（GIF画像 → 実在の温泉画像）
**現在**: `https://upload.wikimedia.org/wikipedia/commons/5/53/Nasuonsen_1380years.gif`
**問題**: GIF画像のため、温泉が映っているか確認が必要

**置き換え先候補**:
- 那須温泉の露天風呂の実写画像を探す
- 日光湯元温泉の画像（既に使用中）を一時的に使用するか、那須温泉専用の画像を探す

### 2. 水上温泉（古い写真 → 実在の温泉画像）
**現在**: `https://upload.wikimedia.org/wikipedia/commons/4/4b/Minakami_Onsen_in_Taisho_era.jpg`
**問題**: 大正時代の写真のため、温泉が映っているか確認が必要

**置き換え先候補**:
- 水上温泉の露天風呂の実写画像を探す
- 既存の日光湯元温泉の画像を一時的に使用するか、水上温泉専用の画像を探す

### 3. 重複使用されている画像の改善

以下の温泉地で、熱海温泉の画像が重複使用されています：
- `ito` (伊東温泉)
- `shuzenji` (修善寺温泉)
- `shimoda` (下田温泉)
- `yugawara` (湯河原温泉)

**現在**: すべて `https://upload.wikimedia.org/wikipedia/commons/f/f7/230127_Atami_Onsen_Shizuoka_pref_Japan01s3.jpg` (熱海温泉)

**改善方針**:
- 各温泉地に適した実在の温泉画像を探す
- または、各温泉地の特徴を反映した画像を選定

---

## 🔍 検索キーワード

各温泉地の実在の温泉画像を探すためのキーワード：

1. **那須温泉**: "Nasu Onsen outdoor bath rotenburo" / "那須温泉 露天風呂"
2. **水上温泉**: "Minakami Onsen outdoor bath rotenburo" / "水上温泉 露天風呂"
3. **伊東温泉**: "Ito Onsen outdoor bath rotenburo" / "伊東温泉 露天風呂"
4. **修善寺温泉**: "Shuzenji Onsen outdoor bath rotenburo" / "修善寺温泉 露天風呂"
5. **下田温泉**: "Shimoda Onsen outdoor bath rotenburo" / "下田温泉 露天風呂"
6. **湯河原温泉**: "Yugawara Onsen outdoor bath rotenburo" / "湯河原温泉 露天風呂"

---

## 📝 実装方針

1. Wikimedia Commonsから各温泉地の実在の温泉画像を検索
2. 湯船・露天風呂が明確に映っている画像を選定
3. `app/lib/images.ts` と `data/wikimedia-images.json` を更新
4. ビルド・リント確認
