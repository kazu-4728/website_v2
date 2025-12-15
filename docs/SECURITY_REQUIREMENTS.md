# セキュリティ要件とバージョン管理

**最終更新**: 2025年12月15日  
**目的**: セキュリティ脆弱性の再発防止とバージョン管理の徹底

---

## 🔒 必須バージョン要件

### Next.js（フレームワーク）

#### ✅ 使用可能バージョン
- **Next.js 16.0.10 以上**（推奨）
- **Next.js 15.6.0 以上**（最小要件）

#### ❌ 使用禁止バージョン（重大な脆弱性あり）

**絶対に使用してはいけないバージョン:**

| バージョン範囲 | CVE | 概要 | CVSS | 詳細 |
|:---|:---|:---|:---|:---|
| **13.3.0 - 15.5.7**<br>**16.0.0 - 16.0.8** | CVE-2025-55184 | DoS（サービス拒否）<br>Server Componentsのデシリアライゼーション処理における欠陥により、悪意のあるHTTPリクエストでサーバーハングとCPU異常使用を引き起こす | 7.5（High） | [GHSA-mwv6-3258-q52c](https://github.com/advisories/GHSA-mwv6-3258-q52c) |
| **15.0.0 - 15.5.7**<br>**16.0.0 - 16.0.8** | CVE-2025-55183 | Server Actions ソースコード露出<br>特別に細工されたHTTPリクエストにより、Server Functionsのコンパイル済みソースコードが漏洩 | 5.3（Medium） | [GHSA-w37m-7fhw-fmv9](https://github.com/advisories/GHSA-w37m-7fhw-fmv9) |
| **15.5.0 - 15.5.7** | CVE-2025-55182 / CVE-2025-66478 | RCE（リモートコード実行）<br>React Server Components の Flight プロトコルにおける信頼できないデータのデシリアライゼーション処理の欠陥により、認証なしでリモートからサーバー上で任意のコードを実行可能 | 10.0（Critical） | [GHSA-9qr9-h5gf-34mp](https://github.com/advisories/GHSA-9qr9-h5gf-34mp) |
| **15.0.3 以下** | 複数 | 上記すべての脆弱性に加え、その他のセキュリティ問題を含む可能性あり | - | - |

**要約**: Next.js 16.0.9以下のすべてのバージョンに何らかの脆弱性があります。**16.0.10以上を使用してください。**

### ESLint（リンター）

#### ✅ 使用可能バージョン
- **ESLint 9.39.2 以上**（推奨）

#### ⚠️ 注意が必要なバージョン
- **ESLint 8.x**: 非推奨（サポート終了）
- eslint-config-next 16.x との互換性問題あり

### eslint-config-next

#### ✅ 使用可能バージョン
- **eslint-config-next 16.0.10 以上**（推奨）

#### ❌ 使用禁止バージョン
- **eslint-config-next 14.2.5 以下**
   - **理由**: glob パッケージの脆弱性（CVE-2025-64756）を含む
   - **CVE-2025-64756**: glob CLI のコマンドインジェクション脆弱性
   - **参考**: [GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2)

### React（フレームワーク依存）

#### ✅ 使用可能バージョン
- **React 18.3.1**（現在使用中、安定版）
- **React 19.2.2 以上**（React 19を使用する場合）

#### ❌ 使用禁止バージョン
- **React 19.0.0 - 19.2.1**
   - **理由**: Next.js 15.5.0-15.5.7 の脆弱性に関連

---

## 📋 バージョン確認方法

### 現在のバージョンを確認

```bash
# package.json を確認
cat package.json | grep -A 1 '"next":'
cat package.json | grep -A 1 '"eslint":'
cat package.json | grep -A 1 '"react":'

# インストール済みバージョンを確認
npm list next eslint react
```

### セキュリティ監査を実行

```bash
# 脆弱性をスキャン
npm audit

# 結果が「found 0 vulnerabilities」であることを確認
# それ以外の場合は、即座に対応が必要
```

---

## 🚨 禁止行為

### ❌ 絶対にやってはいけないこと

1. **脆弱なバージョンへのダウングレード**
   ```bash
   # ❌ 禁止: 脆弱なバージョンへの変更
   npm install next@15.5.6  # Critical脆弱性あり
   npm install next@15.0.3  # 複数の脆弱性あり
   ```

2. **package.json の手動編集で脆弱なバージョンを指定**
   ```json
   // ❌ 禁止
   {
     "dependencies": {
       "next": "^15.5.6"  // Critical脆弱性あり
     }
   }
   ```

3. **npm audit の警告を無視**
   ```bash
   # ❌ 禁止: 脆弱性があるのに無視してビルド
   npm audit  # 脆弱性が見つかる
   npm run build  # そのままビルドしてしまう
   ```

4. **セキュリティアップデートの延期**
   - セキュリティアップデートは**即座に適用**すること
   - 「後で対応」は禁止

---

## ✅ エージェント作業時のチェックリスト

### 作業開始時（必須）

- [ ] `npm audit` を実行し、脆弱性がないことを確認
- [ ] `package.json` の Next.js バージョンが 16.0.10 以上であることを確認
- [ ] `package.json` の ESLint バージョンが 9.39.2 以上であることを確認
- [ ] このドキュメント（SECURITY_REQUIREMENTS.md）を読んだ

### 依存関係を更新する場合（必須）

- [ ] 更新前に現在のバージョンを記録
- [ ] 更新後に `npm audit` を実行
- [ ] 脆弱性が「0 vulnerabilities」であることを確認
- [ ] `npm run build` でビルドが成功することを確認
- [ ] `npm run lint` でリントエラーがないことを確認

### 作業完了時（必須）

- [ ] `npm audit` で脆弱性がないことを最終確認
- [ ] 変更内容をコミットメッセージに明記
- [ ] package.json と package-lock.json の両方をコミット
- [ ] TODO リストを根拠付きで更新（下記参照）

---

## 📝 TODO リスト管理の徹底

### TODO完了時の確認手順

エージェントがタスクを完了したと報告する際は、**必ず以下の根拠を示すこと**：

1. **コマンド実行結果のスクリーンショットまたはログ**
   ```bash
   # 例: セキュリティ対応完了の根拠
   npm audit
   # 結果: found 0 vulnerabilities ✅
   
   npm list next
   # 結果: next@16.0.10 ✅
   ```

2. **ビルド成功の確認**
   ```bash
   npm run build
   # 結果: ✓ Compiled successfully ✅
   ```

3. **テスト成功の確認**（該当する場合）
   ```bash
   npm run test
   # 結果: All tests passed ✅
   ```

### TODO リスト更新の例

```markdown
## セキュリティ対策

- [x] Next.js を 16.0.10 に更新
  - **根拠**: `npm list next` → `next@16.0.10`
  - **検証**: `npm audit` → `found 0 vulnerabilities`
  - **コミット**: 9f062ce

- [x] ESLint を 9.39.2 に更新
  - **根拠**: `npm list eslint` → `eslint@9.39.2`
  - **検証**: `npx eslint app/` → `No errors or warnings`
  - **コミット**: 9f062ce

- [x] ビルド検証
  - **根拠**: `npm run build` の実行ログ
  - **結果**: ✓ Compiled successfully
  - **コミット**: 9f062ce
```

---

## 🛡️ セキュリティ監視の自動化

### 推奨: GitHub Actions でのセキュリティチェック

package.json の `prebuild` スクリプトにセキュリティチェックを追加することを推奨：

```json
{
  "scripts": {
    "prebuild": "npm audit --audit-level=moderate",
    "build": "next build"
  }
}
```

### 推奨: Dependabot の有効化

`.github/dependabot.yml` を作成し、自動的に依存関係の更新をチェック：

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10
```

---

## 🔍 定期的なセキュリティレビュー

### 週次チェック（推奨）

1. `npm audit` を実行
2. GitHub Security Advisories をチェック
3. Next.js の最新リリースノートを確認
4. 脆弱性が発見された場合は即座に対応

### 月次チェック（推奨）

1. すべての依存関係を最新の安定版に更新
2. セキュリティスキャンツールを実行
3. このドキュメント（SECURITY_REQUIREMENTS.md）を見直し

---

## 📚 参考リンク

- [Next.js Security Advisories](https://github.com/vercel/next.js/security/advisories)
- [npm audit Documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [GitHub Security Advisory Database](https://github.com/advisories)
- [CVE Database](https://www.cve.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## 🆘 問題が発生した場合

1. **即座に作業を停止**
2. `npm audit` を実行して状況を確認
3. このドキュメントを参照
4. 必要に応じて SECURITY.md の手順に従って報告
5. 脆弱性が確認された場合は、即座に安全なバージョンに更新

---

**重要**: このドキュメントは、すべてのエージェントが作業を開始する前に必ず読むこと。セキュリティは最優先事項です。
