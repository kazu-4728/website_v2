# UI崩れの根本原因分析

最終更新: 2025/11/30

## 🔍 問題の特定

ユーザーからの報告: "UI崩れの原因はbasePathではない。リポジトリを確認してください。base pathはリポジトリ名に合わせて自動デプロイされるように設定されているので変更は必要ない。UI崩れの原因は他にある。あなたが行っている作業の中で起きている。コミットをひとつずつ遡って原因を探してください。"

## 📊 コミット履歴の分析

### 関連コミット（時系列順）

1. **`b09f545`** (2025-11-30 06:03:04) - `fix: 画像の最適化を有効化し、温泉画像の検索条件を改善`
   - `next.config.mjs`: `unoptimized: true` → `unoptimized: false`
   - `remotePatterns`を追加（Wikimedia Commons、Unsplash）

2. **`c34d501`** (2025-11-30 06:43:56) - `fix: 静的エクスポート用に画像最適化を無効化`
   - `next.config.mjs`: `unoptimized: false` → `unoptimized: true`
   - `app/lib/images.ts`: Wikimedia Commons URLの処理を追加

3. **`9f1fa55`** (2025-11-30 11:30:14) - `fix: basePathのデフォルト値を修正してUI崩れを解消`
   - `next.config.mjs`: デフォルト値を`/web-site` → `/website_v2`に変更

4. **`4172028`** (2025-11-30 11:30:45) - `fix: basePathのデフォルト値を修正してUI崩れを解消`
   - `.env.local`を削除
   - `.gitignore`に`.env.local`を追加

## 🐛 根本原因の仮説

### 仮説1: `b09f545`での`unoptimized: false`変更が原因

**問題点:**
- GitHub Pagesの静的エクスポート（`output: 'export'`）では、Next.jsの画像最適化機能は使用できない
- `unoptimized: false`に設定すると、Next.jsは画像最適化APIを呼び出そうとするが、静的エクスポートではAPIが存在しない
- 結果として、画像が読み込めず、UIが崩れる可能性がある

**確認事項:**
- `b09f545`のコミットで`unoptimized: false`に変更した
- その後、`c34d501`で`unoptimized: true`に戻した
- しかし、`b09f545`から`c34d501`までの間、UI崩れが発生していた可能性がある

### 仮説2: `app/lib/images.ts`の変更が原因

**問題点:**
- `c34d501`で`app/lib/images.ts`にWikimedia Commons URLの処理を追加
- `optimizeImageUrl`関数でWikimedia Commons URLをそのまま返すように変更
- この変更が画像の読み込みに影響を与えている可能性がある

**確認事項:**
- `optimizeImageUrl`関数の変更内容を確認
- 画像URLの生成ロジックに問題がないか確認

## 🔧 診断手順

### ステップ1: `b09f545`のコミットを確認

```bash
git show b09f545 --stat
git diff b09f545^..b09f545
```

### ステップ2: `c34d501`のコミットを確認

```bash
git show c34d501 --stat
git diff c34d501^..c34d501
```

### ステップ3: ビルド時の動作確認

```bash
# b09f545の状態でビルド
git checkout b09f545
npm run build

# c34d501の状態でビルド
git checkout c34d501
npm run build
```

## 📝 推奨される修正

1. **`unoptimized: true`を維持**
   - GitHub Pagesの静的エクスポートでは、画像最適化は使用できない
   - `unoptimized: true`を維持することで、画像は通常の`<img>`タグとして出力される

2. **`optimizeImageUrl`関数の確認**
   - Wikimedia Commons URLの処理が正しいか確認
   - 画像URLの生成ロジックに問題がないか確認

3. **ビルド時の検証**
   - ビルド後に生成されたHTMLを確認
   - 画像URLが正しく生成されているか確認

## ✅ 確認チェックリスト

- [ ] `b09f545`のコミットで`unoptimized: false`に変更したことが原因か確認
- [ ] `c34d501`のコミットで`unoptimized: true`に戻した後、UI崩れが解消されたか確認
- [ ] `app/lib/images.ts`の変更が画像の読み込みに影響を与えていないか確認
- [ ] ビルド時に画像URLが正しく生成されているか確認
- [ ] GitHub Pagesで実際の画像が読み込まれているか確認

## 🔗 関連ファイル

- `next.config.mjs` - 画像最適化の設定
- `app/lib/images.ts` - 画像URLの生成ロジック
- `.github/workflows/pages.yml` - デプロイワークフロー
