# Wikimedia Commons画像取得ガイド

## 手順

### 1. Wikimedia Commonsで検索

各温泉地の画像を検索：
- 箱根: https://commons.wikimedia.org/wiki/Category:Hakone_Onsen
- 草津: https://commons.wikimedia.org/wiki/Category:Kusatsu_Onsen
- 鬼怒川: https://commons.wikimedia.org/wiki/Category:Kinugawa_Onsen

### 2. 画像を選択

以下の条件を満たす画像を選択：
- CC BY-SA 4.0 または CC BY 4.0 ライセンス
- 高解像度（1920px以上推奨）
- 適切なクレジット情報がある

### 3. 画像URLを取得

画像ページから「Original file」をクリックして、直接画像URLを取得。

例：
```
https://upload.wikimedia.org/wikipedia/commons/thumb/.../...jpg/1920px-...jpg
```

### 4. クレジット情報を取得

画像ページから以下を取得：
- 写真家名（Author）
- ライセンス情報
- ライセンスURL

### 5. コードに追加

`app/lib/images.ts`の`createWikimediaMetadata`を使用：

```typescript
hakone: createWikimediaMetadata(
  'https://upload.wikimedia.org/wikipedia/commons/...',
  '写真家名',
  'https://commons.wikimedia.org/wiki/User:...',
  'CC BY-SA 4.0',
  'https://creativecommons.org/licenses/by-sa/4.0/',
  'Hakone hot spring with Mount Fuji'
),
```

## 注意事項

- CC BY-SA 4.0ライセンスの場合、クレジット表示が必須
- 画像URLは直接リンクを使用（サムネイルではなく）
- 写真家の情報は正確に記載する

## 参考リンク

- Wikimedia Commons: https://commons.wikimedia.org/
- Creative Commons: https://creativecommons.org/licenses/by-sa/4.0/
