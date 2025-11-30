# Cursor Copilot Instructions

## 🚨 作業を開始する前に必ず確認すること

**重要**: このリポジトリで作業を開始する前に、**必ず最初に以下を確認してください**：

### 1. 今後の課題を確認（必須）
**[`docs/FUTURE_TASKS.md`](../docs/FUTURE_TASKS.md)** を最初に読んでください。
- 現在の課題と優先度が記載されています
- 作業の方向性を理解するために必須です
- **このファイルを参照せずに作業を開始しないでください**

### 2. アーキテクチャを理解
**[`docs/MASTER_ARCHITECTURE.md`](../docs/MASTER_ARCHITECTURE.md)** で全体構造を把握してください。
- ファイル構造と依存関係が説明されています
- 変更の影響範囲を理解するために重要です

### 3. 関連ドキュメントを確認
作業内容に応じて、以下のドキュメントも参照してください：
- **画像管理**: [`docs/IMAGE_DATA_LOCATION.md`](../docs/IMAGE_DATA_LOCATION.md)
- **画像の問題**: [`docs/IMAGE_ISSUE_REPORT.md`](../docs/IMAGE_ISSUE_REPORT.md)

---

## 📋 作業フロー

1. **課題の確認**
   - `docs/FUTURE_TASKS.md` を開く
   - 作業する課題を選択（優先度を考慮）
   - 関連するドキュメントを確認

2. **環境の準備**
   - リポジトリをクローン
   - `npm install` で依存関係をインストール
   - `npm run dev` でローカル開発サーバーを起動

3. **作業の実施**
   - 小さな変更から始める
   - テストを実行して確認（`npm run test:images`）
   - ビルドが成功することを確認（`npm run build`）

4. **コミットとプッシュ**
   - 変更内容を明確にコミット
   - プッシュ前にビルドが成功することを確認

---

## 🎯 優先度の理解

`docs/FUTURE_TASKS.md` では、課題が以下の優先度で分類されています：

- **🔴 高優先度**: サイトの信頼性に直結する重要な課題
- **🟡 中優先度**: ユーザー体験やパフォーマンスに影響する課題
- **🟢 低優先度**: サイトの価値向上や開発効率向上に関する課題

作業を開始する際は、優先度の高い課題から取り組むことを推奨します。

---

## 🧪 テストとビルド

作業後は必ずテストを実行してください：

```bash
# 画像関連のテスト
npm run test:images

# すべてのテスト
npm run test:all

# ビルドテスト
npm run build
```

**注意**: GitHub Pagesの静的エクスポートでは、`SKIP_CHECK=true` を設定してビルドをスキップできますが、**本番環境では使用しないでください**。

---

## 📝 コミットメッセージのガイドライン

コミットメッセージは以下の形式を推奨します：

```
[種類]: 簡潔な説明

- 変更内容の詳細
- 関連する課題番号（あれば）
```

例：
```
fix: 温泉画像の検索条件を改善

- 入口・橋・施設などの非温泉画像を除外
- 画像検索スクリプトの検索条件を改善
- 関連: FUTURE_TASKS.md #1
```

---

## 🔧 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **テスト**: Vitest
- **デプロイ**: GitHub Pages (静的エクスポート)

---

## 📁 重要なファイルとディレクトリ

- `docs/FUTURE_TASKS.md` - **今後の課題一覧（必ず最初に確認）**
- `docs/MASTER_ARCHITECTURE.md` - アーキテクチャの詳細
- `themes/onsen-kanto/content.json` - サイトのコンテンツ設定
- `data/wikimedia-images.json` - 画像データ
- `app/lib/images.ts` - 画像管理システム
- `app/lib/content.ts` - コンテンツ管理システム
- `scripts/fetch-wikimedia-images.js` - 画像取得スクリプト

---

## ⚠️ 注意事項

1. **画像の最適化**: GitHub Pagesの静的エクスポートでは画像最適化が無効（`unoptimized: true`）
2. **テスト**: 一部のテストが失敗している可能性がある（`SKIP_CHECK=true`でスキップ可能）
3. **画像の取得**: Wikimedia Commons APIのレート制限に注意
4. **ビルド**: 静的エクスポートを使用しているため、サーバーサイド機能は使用できない

---

## ❓ 質問や問題がある場合

1. まず `docs/FUTURE_TASKS.md` を確認
2. 関連するドキュメントを確認
3. それでも解決しない場合は、Issueを作成してください
