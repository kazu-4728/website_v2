# UI崩れの段階別分析

最終更新: 2025/11/30

## 🔍 問題の特定

UI崩れが発生している原因を段階的に分析します。

---

## 📊 段階別チェックポイント

### 1. ビルド段階

**確認事項:**
- [ ] ビルドが正常に完了しているか
- [ ] `out`ディレクトリが生成されているか
- [ ] CSS/JSファイルが正しく生成されているか
- [ ] HTMLファイルのパスが正しいか

**確認コマンド:**
```bash
npm run build
ls -la out
find out/_next -name "*.css" -o -name "*.js"
cat out/index.html | grep -E "(href=|src=)"
```

**問題の可能性:**
- `basePath`が正しく設定されていない
- CSS/JSファイルのパスが間違っている
- ビルドエラーが発生している

---

### 2. ビルド成果物の確認

**確認事項:**
- [ ] HTMLファイル内のCSS/JSパスが正しいか
- [ ] `basePath`が環境変数から正しく読み込まれているか
- [ ] 相対パスと絶対パスの使い分けが正しいか

**確認コマンド:**
```bash
cat out/index.html | grep -oE 'href="/[^"]*"'
cat out/index.html | grep -oE 'src="/[^"]*"'
```

**問題の可能性:**
- `next.config.mjs`の`basePath`がデフォルト値（`/web-site`）のまま
- 環境変数`NEXT_PUBLIC_BASE_PATH`がビルド時に設定されていない
- GitHub Pagesのリポジトリ名（`website_v2`）と不一致

---

### 3. デプロイ段階

**確認事項:**
- [ ] GitHub Actionsワークフローで環境変数が正しく設定されているか
- [ ] デプロイが正常に完了しているか
- [ ] アーティファクトが正しくアップロードされているか

**確認コマンド:**
```bash
gh run list --workflow=pages.yml --limit 5
gh run view <run-id> --log
```

**問題の可能性:**
- ワークフローで`NEXT_PUBLIC_BASE_PATH`が設定されていない
- デプロイが失敗している
- アーティファクトのパスが間違っている

---

### 4. 本番環境での確認

**確認事項:**
- [ ] GitHub Pagesでサイトが正しく表示されているか
- [ ] CSS/JSファイルが正しく読み込まれているか（ブラウザの開発者ツールで確認）
- [ ] 404エラーが発生していないか

**確認方法:**
1. ブラウザの開発者ツールを開く
2. NetworkタブでCSS/JSファイルの読み込み状況を確認
3. Consoleタブでエラーを確認

**問題の可能性:**
- CSS/JSファイルのパスが404エラーになっている
- `basePath`が実際のリポジトリ名と一致していない
- キャッシュの問題

---

## 🐛 現在確認されている問題

### 問題1: basePathの不一致

**現状:**
- `next.config.mjs`のデフォルト値: `/web-site`
- GitHub Pagesの実際のリポジトリ名: `website_v2`
- ワークフローでの設定: `NEXT_PUBLIC_BASE_PATH: "/${{ github.event.repository.name }}"`

**影響:**
- HTMLファイル内のCSS/JSパスが`/web-site/_next/...`になる
- GitHub Pagesでは`/website_v2/_next/...`である必要がある
- 結果としてCSS/JSが読み込めず、UIが崩れる

**解決策:**
1. `next.config.mjs`のデフォルト値を`/website_v2`に変更
2. または、ワークフローで環境変数が確実に設定されるようにする
3. ビルド時に環境変数が正しく読み込まれているか確認

---

## 🔧 診断手順

### ステップ1: ローカルビルドの確認

```bash
# 環境変数を設定してビルド
NEXT_PUBLIC_BASE_PATH="/website_v2" npm run build

# 生成されたHTMLのパスを確認
cat out/index.html | grep -oE 'href="/[^"]*"' | head -5
cat out/index.html | grep -oE 'src="/[^"]*"' | head -5
```

**期待される結果:**
- パスが`/website_v2/_next/...`になっている

**実際の結果:**
- パスが`/web-site/_next/...`になっている → 問題あり

---

### ステップ2: ワークフローの確認

```bash
# ワークフローファイルを確認
cat .github/workflows/pages.yml | grep -A 2 "NEXT_PUBLIC_BASE_PATH"
```

**確認事項:**
- `NEXT_PUBLIC_BASE_PATH`が正しく設定されているか
- 環境変数がビルドステップで使用されているか

---

### ステップ3: ビルドログの確認

GitHub Actionsのビルドログで以下を確認：
- 環境変数が正しく設定されているか
- ビルドが正常に完了しているか
- エラーが発生していないか

---

## 📝 修正手順

### 修正1: next.config.mjsのデフォルト値を修正

```javascript
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/website_v2';
```

### 修正2: ワークフローでの環境変数設定を確認

```yaml
env:
  NEXT_PUBLIC_BASE_PATH: "/${{ github.event.repository.name }}"
```

### 修正3: ビルド後の検証

ビルド後に生成されたHTMLのパスを確認し、正しいパスになっているか検証する。

---

## ✅ 確認チェックリスト

- [ ] ローカルビルドでパスが正しいか確認
- [ ] ワークフローで環境変数が設定されているか確認
- [ ] ビルドログでエラーがないか確認
- [ ] 生成されたHTMLのパスを確認
- [ ] GitHub Pagesで実際のパスを確認（開発者ツール）
- [ ] CSS/JSファイルが正しく読み込まれているか確認

---

## 🔗 関連ファイル

- `next.config.mjs` - basePathの設定
- `.github/workflows/pages.yml` - ワークフローの環境変数設定
- `out/index.html` - 生成されたHTMLファイル（ビルド後）
