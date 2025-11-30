# 画像ソース分析：Unsplash vs Wikipedia

## 現状の課題

現在、全ての画像が仮の画像ID（`photo-1540555700478-4be289fbecef`）を使用しており、実際の温泉画像に置き換える必要があります。

## 画像ソースの比較

### Unsplash
**利点：**
- 高品質な写真が多い
- Unsplash License（商用利用可能、クレジット推奨）
- APIが使いやすい
- 画像の最適化が簡単

**欠点：**
- 特定の温泉地（箱根、草津など）の正確な画像を見つけるのが難しい
- 検索結果がランダムな場合がある
- 実際の場所と一致しない可能性がある

### Wikipedia / Wikimedia Commons
**利点：**
- 特定の場所の正確な画像を見つけやすい
- 豊富な日本の温泉地の画像
- 適切なクレジット情報が提供されている
- CCライセンス（多くの場合、CC BY-SA 4.0）
- 正確な場所の画像が得られる

**欠点：**
- ライセンスの確認が必要（CC BY-SA 4.0など）
- クレジット表示が必須（CCライセンスの場合）
- 画像のURL構造が複雑な場合がある

## 推奨アプローチ

### ハイブリッドアプローチ（推奨）

1. **Wikipedia/Wikimedia Commonsを優先**
   - 特定の温泉地の正確な画像を取得
   - 適切なクレジット情報を管理
   - より確実に正確な画像を提供

2. **Unsplashを補完的に使用**
   - Wikipediaに適切な画像がない場合
   - 一般的な温泉の雰囲気を表現する場合

## 実装方針

### オプション1: Wikipedia/Wikimedia Commonsを優先（推奨）

```typescript
// Wikipediaの画像を使用
const ONSEN_KANTO_IMAGES = {
  onsen: {
    hakone: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/...',
      photographer: '...',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
  },
};
```

**利点：**
- 正確な場所の画像
- 適切なライセンス情報
- より信頼性が高い

### オプション2: Unsplashを検索して使用

Unsplashで「onsen japan」「hakone onsen」などで検索し、適切な画像を見つける。

**利点：**
- 使いやすいライセンス
- 高品質な画像

**欠点：**
- 特定の場所の正確な画像を見つけるのが難しい

## 推奨事項

**Wikipedia/Wikimedia Commonsを優先することを推奨します。**

理由：
1. 特定の温泉地の正確な画像を確実に取得できる
2. 適切なライセンス情報が提供されている
3. より信頼性が高い
4. 日本の温泉地の画像が豊富にある

## 次のステップ

1. Wikimedia Commonsで各温泉地の画像を検索
2. 適切なライセンス（CC BY-SA 4.0など）の画像を選択
3. 画像URLとクレジット情報を取得
4. `app/lib/images.ts`を更新
