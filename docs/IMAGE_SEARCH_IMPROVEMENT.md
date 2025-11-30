# 画像検索の改善

## 現在の状況

- 取得した画像数: 6個（21個中）
- 全て温泉関連の画像（品質は良い）
- 問題: 多くの温泉地で画像が見つかっていない

## 改善内容

### 1. 検索結果の増加
- `srlimit`を5から20に増加
- より多くの検索結果から選択可能に

### 2. 除外キーワードの追加
- 鉄道、駅、市街地、銅像などの画像を除外
- より適切な画像を選択

### 3. 温泉関連画像の優先
- タイトルに「onsen」「温泉」「yubatake」「湯畑」「rotemburo」を含む画像を優先
- フォールバック画像も使用（除外キーワードを含まない限り）

### 4. カテゴリ検索の追加
- 通常の検索で見つからない場合、カテゴリ検索も試行

## 取得できた画像（6個）

全て温泉関連：
1. hakone: "Ashinoyu onsen - Hakone.jpg" ✓
2. kusatsu: "Kusatsu Onsen Yubatake in Taisho era.jpg" ✓
3. kusatsu-yubatake: "Kusatsu Onsen Yubatake in Taisho era.jpg" ✓
4. ikaho: "Ikaho Onsen Stone Steps.jpg" ✓
5. shima: "Yamagutirotenburo.jpg" ✓
6. nikko: "200801 Nikko Yumoto Onsen Nikko Tochigi pref Japan04s3.jpg" ✓

## 次のステップ

1. より具体的な検索キーワードを使用
2. カテゴリ検索を改善
3. 手動で画像を追加（オプション）
