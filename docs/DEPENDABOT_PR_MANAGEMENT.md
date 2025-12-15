# Dependabot PR管理ガイド

**作成日**: 2025年12月15日  
**目的**: Dependabot PRの効率的な処理方法とPR数の削減方法を説明

---

## 🎯 即座に対応が必要なPR

### 🔴 最優先: セキュリティパッチ（即座にマージ）

**確認方法**:
- PRのタイトルに「security」「vulnerability」「CVE」が含まれる
- PRの説明文に脆弱性の詳細がある
- GitHub Security Advisoryへのリンクがある

**対応**: 
1. セキュリティパッチは**すぐにマージ**
2. マージ後に`npm audit`で脆弱性が0件であることを確認

---

## 📋 現在のDependabot PRの処理順序

### ステップ1: セキュリティ関連を最優先でマージ

```bash
# マージ前に必ず確認
1. PRページで「Security」ラベルがついているか確認
2. Changelogで脆弱性修正の記載を確認
3. マージ後に npm audit で検証
```

**該当PR**: なし（2025年12月15日時点で0件の脆弱性を確認済み）

### ステップ2: ビルドツール・重要な開発依存関係を更新

**優先順位が高い理由**: ビルドやテストの安定性に直結

**推奨マージ順序**:
1. **TypeScript関連** (typescript, @types/*)
   - 型チェックとビルドの基盤
   - コンフリクトリスク: 低
   
2. **ESLint/Prettier関連** (eslint, prettier, typescript-eslint)
   - コード品質に影響
   - コンフリクトリスク: 低

3. **Testing Library関連** (@testing-library/*, vitest, jsdom)
   - テストの安定性に影響
   - コンフリクトリスク: 低

**マージ方法**:
```bash
# 例: TypeScript を更新する場合
1. PRページを開く
2. Changelogを確認（Breaking Changesがないか）
3. CI/CDが緑色（成功）であることを確認
4. 「Merge pull request」をクリック
5. マージ後に npm run build で確認
```

### ステップ3: UIライブラリと実行時依存関係を更新

**優先順位**: 中

**推奨マージ順序**:
1. **Tailwind CSS関連** (@tailwindcss/*, tailwindcss)
   - UIスタイルに影響
   - コンフリクトリスク: 低〜中
   
2. **Radix UI関連** (@radix-ui/*)
   - UIコンポーネントに影響
   - コンフリクトリスク: 低

3. **アイコンライブラリ** (lucide-react)
   - アイコン表示に影響
   - コンフリクトリスク: 低

4. **アニメーションライブラリ** (framer-motion)
   - アニメーションに影響
   - コンフリクトリスク: 中（APIが変更される可能性あり）

**マージ方法**:
```bash
1. PRページを開く
2. Changelogを確認（特にBreaking Changesとバグ修正）
3. CI/CDが成功していることを確認
4. マージ
5. npm run dev で動作確認（UIに影響があるため）
6. 問題なければ完了
```

### ステップ4: マイナーな開発依存関係を更新

**優先順位**: 低

**該当パッケージ**:
- autoprefixer
- postcss
- class-variance-authority
- その他の補助的なツール

**マージ方法**:
```bash
1. 複数のPRをまとめて確認
2. 1つずつマージするか、同時に複数マージ
3. npm run build でビルド確認
```

---

## 🚨 エラーが出ているPRの対処法

### CI/CDが失敗している場合

**確認すべき点**:
1. **エラーログを確認**
   - PRページの「Checks」タブをクリック
   - 失敗したジョブのログを確認

2. **よくあるエラー原因**:
   - **Breaking Changes**: パッケージのAPIが変更された
   - **依存関係の競合**: 他のパッケージとバージョンが合わない
   - **テストの失敗**: コードの変更が必要

3. **対処方法**:
   - **Breaking Changesの場合**: コードの修正が必要（このPRは保留）
   - **依存関係の競合**: 他のPRを先にマージする
   - **テストの失敗**: 調査が必要（このPRは保留）

**基本ルール**: 
- ✅ CI/CDが成功しているPRのみマージ
- ❌ 失敗しているPRはマージしない

---

## 🔀 コンフリクトが起きた場合の対処

### コンフリクトが起きる可能性が高いパッケージ

1. **package.json / package-lock.json**
   - 複数のPRで同じファイルを更新するため

2. **Tailwind CSS**
   - 設定ファイルが変更される可能性

### コンフリクト解決の基本手順

**推奨**: Dependabotに自動で解決させる

```bash
# PRページで「Resolve conflicts」ボタンが表示される場合:
1. 「Resolve conflicts」をクリック
2. GitHubのエディタでコンフリクトを解決
3. 「Mark as resolved」をクリック
4. 「Commit merge」をクリック

# または、Dependabotに再ベースさせる:
1. PRページでコメント: @dependabot rebase
2. Dependabotが自動的に最新のmainブランチにリベース
3. コンフリクトが自動解決される
```

**重要**: コンフリクトを手動で解決する必要はほとんどありません。Dependabotに任せましょう。

---

## 🛠️ Dependabot PRを減らす方法

### 問題の本質

**なぜ大量のPRが出るのか？**
- Dependabotは毎日チェックして、更新があれば自動的にPRを作成
- PR#12で多数のパッケージを更新した直後のため、その後の小さな更新が次々と検出されている
- 現在の設定: `open-pull-requests-limit: 10`（最大10件まで同時オープン）

### 解決策1: グループ化設定を追加（推奨）

`.github/dependabot.yml` を編集して、関連するパッケージをグループ化します。

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
      time: "00:00"
      timezone: "Asia/Tokyo"
    open-pull-requests-limit: 5  # 10 → 5 に削減
    
    # グループ化設定を追加
    groups:
      # ESLintとPrettier関連を1つのPRにまとめる
      linting:
        patterns:
          - "eslint*"
          - "prettier*"
          - "@typescript-eslint/*"
          - "typescript-eslint"
      
      # Testing関連を1つのPRにまとめる
      testing:
        patterns:
          - "@testing-library/*"
          - "vitest*"
          - "jsdom"
      
      # Tailwind CSS関連を1つのPRにまとめる
      tailwind:
        patterns:
          - "tailwindcss"
          - "@tailwindcss/*"
          - "autoprefixer"
          - "postcss"
      
      # Radix UI関連を1つのPRにまとめる
      radix:
        patterns:
          - "@radix-ui/*"
      
      # TypeScript型定義を1つのPRにまとめる
      types:
        patterns:
          - "@types/*"
    
    # ラベル設定
    labels:
      - "dependencies"
      - "security"
    
    commit-message:
      prefix: "chore(deps)"
      include: "scope"
    
    versioning-strategy: "increase"
    
    allow:
      - dependency-type: "all"
```

**効果**: 
- 10〜15個のPR → 5〜7個のPRに削減
- 関連するパッケージが1つのPRにまとまるため、レビューが楽
- コンフリクトのリスクも低減

### 解決策2: チェック頻度を週次に変更

```yaml
schedule:
  interval: "weekly"  # daily → weekly
  day: "monday"
  time: "00:00"
  timezone: "Asia/Tokyo"
```

**効果**:
- 毎日のPR作成 → 週に1回だけ
- 1週間分の更新をまとめて処理

**注意**: セキュリティパッチの検出が最大7日遅れる可能性

### 解決策3: パッチバージョンの自動マージ（上級者向け）

GitHub Actionsで自動マージを設定:

```yaml
# .github/workflows/auto-merge-dependabot.yml
name: Auto-merge Dependabot PRs

on:
  pull_request:
    branches: [ main ]

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Check PR
        id: check
        run: |
          # パッチバージョンのみ自動マージ
          if [[ "${{ github.event.pull_request.title }}" =~ "patch" ]]; then
            echo "auto_merge=true" >> $GITHUB_OUTPUT
          fi
      
      - name: Auto-merge
        if: steps.check.outputs.auto_merge == 'true'
        run: gh pr merge --auto --squash "${{ github.event.pull_request.number }}"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**効果**: 
- パッチバージョン（x.y.Z の Z部分の更新）は自動マージ
- 手動対応が必要なのはマイナー・メジャーアップデートのみ

**注意**: 十分なテストカバレッジがない場合は非推奨

---

## 📊 推奨設定の比較

| 設定 | PR数 | 手動対応の頻度 | セキュリティ検出速度 | 推奨度 |
|:---|:---:|:---:|:---:|:---:|
| **現在の設定**<br>（日次・上限10） | 10-15/日 | 毎日 | 即座 | ⭐⭐⭐ |
| **グループ化**<br>（日次・上限5） | 5-7/日 | 毎日 | 即座 | ⭐⭐⭐⭐⭐ |
| **週次チェック**<br>（週1・上限10） | 10-15/週 | 週1回 | 最大7日遅れ | ⭐⭐⭐⭐ |
| **週次+グループ化**<br>（週1・上限5） | 5-7/週 | 週1回 | 最大7日遅れ | ⭐⭐⭐⭐⭐ |
| **自動マージ**<br>（日次・パッチのみ自動） | 2-3/日 | 週1-2回 | 即座 | ⭐⭐⭐⭐ |

**個人的な推奨**: **週次+グループ化**
- 手動対応が週1回で済む
- セキュリティチェックは自動で継続
- PRのレビューがまとまって効率的

---

## ✅ 実際のマージ手順（チェックリスト）

### 週次メンテナンスの流れ

**所要時間**: 15〜30分（週1回）

```bash
# 1. すべてのDependabot PRをリストアップ
gh pr list --author "app/dependabot" --state open

# 2. セキュリティラベルのPRを確認（あれば最優先でマージ）
gh pr list --label "security" --state open

# 3. CI/CDが成功しているPRのみを抽出
gh pr list --author "app/dependabot" --state open --json number,title,statusCheckRollup

# 4. 優先順位順にマージ
# 推奨: GitHubのWeb UIでマージ（1クリックで簡単）

# 5. マージ後の確認
npm install
npm audit  # 脆弱性: 0件であることを確認
npm run build  # ビルド成功を確認
npm run test  # テスト成功を確認

# 6. すべて成功したら完了
```

---

## 🎓 まとめ

### ✅ やるべきこと

1. **セキュリティPRは即座にマージ**
   - 妥協なし

2. **その他のPRは週1回まとめて処理**
   - 優先順位: ビルドツール → UIライブラリ → その他

3. **CI/CDが失敗しているPRはスキップ**
   - 手動調査が必要な場合は後回し

4. **設定を最適化してPR数を削減**
   - グループ化 + 週次チェックを推奨

### ❌ やってはいけないこと

1. **CI/CDが失敗しているPRをマージ**
   - ビルドエラーやテスト失敗の原因になる

2. **コンフリクトを無理に手動解決**
   - Dependabotに任せる

3. **セキュリティPRを放置**
   - 脆弱性が残り続ける

---

## 📞 サポート

質問や問題がある場合:
1. このドキュメントを再確認
2. `docs/WHY_DEPENDABOT_PRS_APPEARED.md` も参照
3. それでも解決しない場合はIssueを作成

**重要**: 脆弱性に関する問題は、`SECURITY.md` の手順に従って報告してください。
