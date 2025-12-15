# Security Policy

## Supported Versions

The following versions of the Code Voyage template are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## 🔒 セキュリティ要件とバージョン管理

**重要**: すべての開発者とエージェントは、作業開始前に以下のドキュメントを必ず確認してください。

### 必読ドキュメント

1. **[SECURITY_REQUIREMENTS.md](docs/SECURITY_REQUIREMENTS.md)** - バージョン要件と禁止行為
   - 使用可能なバージョン一覧
   - 使用禁止の脆弱なバージョン一覧
   - セキュリティチェックリスト
   - TODO管理の徹底方法

2. **[CODEQL_ANALYSIS_REPORT.md](docs/CODEQL_ANALYSIS_REPORT.md)** - セキュリティツールの理解
   - CodeQLの役割と限界
   - なぜ依存関係の脆弱性を検出できなかったか
   - 多層防御の実装方法

### 現在のセキュリティ要件

#### ✅ 使用可能バージョン
- **Next.js**: 16.0.10 以上（推奨）
- **ESLint**: 9.39.2 以上
- **eslint-config-next**: 16.0.10 以上

#### ❌ 使用禁止バージョン
- **Next.js 15.5.0 - 15.5.7**: Critical RCE脆弱性（CVE-2025-55182）
- **Next.js 15.0.3 以下**: 複数の脆弱性
- 詳細は [SECURITY_REQUIREMENTS.md](docs/SECURITY_REQUIREMENTS.md) を参照

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability in the Code Voyage template, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to [security@codevoyage.dev](mailto:security@codevoyage.dev).

You should receive a response within 24 hours. If for some reason you do not, please follow up with us to ensure we received your original message.

## Security Features

This template includes the following built-in security features:

- **Dependabot**: Automatically checks for vulnerable dependencies (有効化済み).
- **Security Audit CI**: Automated npm audit on every push and PR (有効化済み).
- **Secret Scanning**: Prevents accidental commit of credentials.
- **CodeQL**: Static code analysis for custom code vulnerabilities.
- **Strict CSP**: Content Security Policy configuration (recommended in production).

## Best Practices for Users

When using this template for your own site, we recommend:

1. **依存関係の定期更新**: 
   - `npm audit` を実行してセキュリティチェック
   - 脆弱性がある場合は即座に対応
   - Dependabotのアラートに注意

2. **バージョン管理の徹底**:
   - [SECURITY_REQUIREMENTS.md](docs/SECURITY_REQUIREMENTS.md) を参照
   - 禁止バージョンを使用しない
   - 作業前後にセキュリティチェック

3. **Branch Protection の有効化**:
   - Security Audit CI を必須チェックに設定
   - npm audit が失敗したらマージを禁止

4. **センシティブデータの管理**:
   - `content.json` に機密情報を含めない
   - 環境変数を適切に使用
   - Secretsをコードにハードコードしない
