# GitHub Copilot Agent Instructions

**⚠️ 重要**: このファイルは GitHub Copilot SWE Agent専用です。

## 📋 最優先ルール

1. **`.cursorrules`を最初に確認**
   - リポジトリルート直下の `.cursorrules` に、全エージェント共通のルールが定義されています
   - JSON First アーキテクチャ、編集可能/禁止レイヤーなどの重要な情報が含まれます
   - **このファイルと `.cursorrules` が矛盾する場合は、`.cursorrules` を優先**

2. **最新ドキュメントを確認**
   - `docs/CURRENT_STATE.md` - プロジェクトの最新状態（必読）
   - `docs/START_HERE.md` - 作業開始時の必須確認事項
   - `docs/UI_REDESIGN_URGENT.md` - UI再設計の進捗状況

## 🔗 参照リンク

- [共通ルール: `.cursorrules`](../.cursorrules)
- [プロジェクト状態: `docs/CURRENT_STATE.md`](../docs/CURRENT_STATE.md)
- [作業開始ガイド: `docs/START_HERE.md`](../docs/START_HERE.md)
- [アーキテクチャ: `docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)

---

*このファイルは簡略化されました。詳細は上記のドキュメントを参照してください。*
*最終更新: 2025年12月22日*
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
