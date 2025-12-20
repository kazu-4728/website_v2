# 🤖 AI エージェント マスターガイド

**最終更新**: 2025年12月20日  
**対象**: すべてのAIエージェント（このファイルを最初に読んでください）  
**言語**: 🇯🇵 **すべての対応は日本語で行ってください**

---

## 🎯 このプロジェクトの最優先目標

### 1. 画像収集と最適表示 🖼️ **（最優先）**
- Wikimedia Commons APIを使用した温泉画像の自動収集
- 実在の温泉が映っている高品質な画像のみを使用
- ビルド時最適化による表示パフォーマンスの向上

### 2. ベンチマークサイト風のUI実現 🎨 **（最優先）**
- 「あえの風」レベルの視覚的クオリティ
- 大胆な画像使用（画面全体を活用）
- シネマティックなアニメーション

### 3. TypeScript型安全性の向上 ✅ **（進行中）**
- `noImplicitAny: true` 有効化済み
- strict mode への段階的移行

---

## 📁 ドキュメント構造（整理済み）

### 🟢 必読ドキュメント（エージェントはこれだけ読めばOK）

| ファイル | 目的 | 読了時間 |
|---------|------|---------|
| **このファイル** | マスターガイド（全体像の把握） | 5分 |
| `ACCELERATED_ROADMAP.md` | 2週間実装プラン（タスク管理） | 10分 |
| `SECURITY_REQUIREMENTS.md` | セキュリティ要件（必須確認） | 5分 |

### 🟡 参照用ドキュメント（必要に応じて参照）

| ファイル | 用途 |
|---------|------|
| `IMAGE_OPTIMIZATION_GUIDE.md` | 画像最適化の詳細手順 |
| `ARCHITECTURE.md` | アーキテクチャ全体像 |
| `IMPLEMENTATION_GUIDE.md` | 実装コードサンプル集 |

### 🔴 廃止予定・読まないでください

以下のファイルは内容が古いか重複しているため、**読まないでください**：
- `ANALYSIS_SUMMARY.md` → このファイルに統合
- `PHASE_TRANSITION_REPORT.md` → ACCELERATED_ROADMAPに統合
- `IMPLEMENTATION_PLAN_V3.md` → ACCELERATED_ROADMAPに統合
- `BEST_PRACTICES_RECOMMENDATIONS.md` → 必要な部分のみ他に統合
- `START_HERE.md` → このファイルに統合

---

## 🚀 エージェント別の役割と開始タスク

### エージェントA: 画像システム担当 🖼️ **（最優先）**

**責任範囲**:
- Wikimedia Commons APIからの画像取得
- 画像の品質チェック（実在の温泉が映っているか）
- ビルド時画像最適化システムの実装

**初日タスク（4時間）**:
1. `scripts/fetch-wikimedia-images.js` の確認と改善
2. 画像取得の実行と品質チェック
3. `IMAGE_OPTIMIZATION_GUIDE.md` に従った最適化スクリプト作成

**読むべきドキュメント**:
- `IMAGE_OPTIMIZATION_GUIDE.md`
- `ACCELERATED_ROADMAP.md` の画像最適化セクション

---

### エージェントB: UI/UX担当 🎨 **（最優先・緊急）**

**🚨 緊急タスク**: [`UI_REDESIGN_URGENT.md`](./UI_REDESIGN_URGENT.md) を**すぐに**確認してください

**責任範囲**:
- ベンチマークサイト（あえの風）レベルのUI実装
- 大胆な画像使用とシネマティックアニメーション
- レスポンシブデザインの最適化

**緊急対応が必要な理由**:
- 既存コンポーネントが変更されておらず、ベンチマークレベルに到達していない
- ビジュアル面の改善が停滞している
- ユーザーから早急な対応が求められている

**初日タスク（4時間）**:
1. **Phase 1**: Hero コンポーネントの完全刷新
   - 画面全体（100vh）を使用
   - タイポグラフィを text-6xl 以上に
   - パララックス効果の追加
2. ビルド検証とスクリーンショット撮影
3. コミット（日本語で）

**読むべきドキュメント**:
- **[`UI_REDESIGN_URGENT.md`](./UI_REDESIGN_URGENT.md)** - 緊急実施計画（必読）
- `WORK_LOG.md` の「あえの風」レベルのデザイン実装セクション
- `ACCELERATED_ROADMAP.md` のUI改善タスク

---

### エージェントC: TypeScript担当 ⚙️

**責任範囲**:
- TypeScript strict mode への段階的移行
- 型エラーの修正
- コード品質の向上

**初日タスク（2時間）**:
1. ✅ `noImplicitAny: true` 有効化（完了済み）
2. `strictNullChecks: true` への移行準備
3. 型エラーの洗い出しと修正計画

**読むべきドキュメント**:
- `ACCELERATED_ROADMAP.md` のTypeScriptセクション

---

### エージェントD: SEO/パフォーマンス担当 📈

**責任範囲**:
- メタデータの最適化
- 構造化データ（JSON-LD）の実装
- パフォーマンス最適化

**初日タスク（2時間）**:
1. ✅ robots.txt 強化（完了済み）
2. メタデータユーティリティの作成
3. Open Graph / Twitter Card の実装

**読むべきドキュメント**:
- `ACCELERATED_ROADMAP.md` のSEOセクション

---

## 🔧 技術スタック

```javascript
{
  "framework": "Next.js 16.0.10",
  "language": "TypeScript",
  "styling": "Tailwind CSS 4.0",
  "animation": "Framer Motion",
  "testing": "Vitest",
  "deployment": "GitHub Pages (静的エクスポート)"
}
```

---

## 📊 現在の進捗状況

### ✅ 完了済み
- [x] Next.js 16.0.10 へ更新（セキュリティ対応）
- [x] `noImplicitAny: true` 有効化
- [x] エラーページ（error.tsx, not-found.tsx, loading.tsx）実装
- [x] robots.txt 強化

### 🔄 進行中
- [ ] 画像収集システムの改善
- [ ] ビルド時画像最適化の実装
- [ ] ベンチマークサイト風UIの実装

### 📋 未着手（優先度順）
1. **画像システム** 🖼️ - 最優先
2. **UI/UX改善** 🎨 - 最優先
3. TypeScript strict mode
4. SEO完全実装
5. パフォーマンス最適化

---

## 🔧 MCP サーバー設定（オプション）

GitHub Copilot の機能を拡張するため、MCP (Model Context Protocol) サーバーを設定しています。

### 設定済みのMCPサーバー

1. **Filesystem Server** 📁
   - ドキュメント、テーマ、データ、画像へのアクセス
   
2. **Brave Search Server** 🔍
   - Web検索機能（最新情報、ベンチマークサイト調査）
   - 環境変数 `BRAVE_API_KEY` が必要
   
3. **Fetch Server** 🌐
   - Wikimedia Commons API からの画像取得
   - 外部APIの呼び出し

### セットアップ方法

詳細は **[`.github/MCP_SETUP.md`](../.github/MCP_SETUP.md)** を参照してください。

**クイックスタート**:
```bash
# .env.local を作成
cp .env.example .env.local

# Brave API キーを設定（任意）
echo "BRAVE_API_KEY=your_api_key" >> .env.local
```

---

## 🔑 重要な API と設定

### Wikimedia Commons API

**エンドポイント**:
```
https://commons.wikimedia.org/w/api.php
```

**使用方法**:
- スクリプト: `scripts/fetch-wikimedia-images.js`
- レート制限: 1秒あたり200リクエスト
- APIキー: 不要（匿名アクセス可能）

**検索クエリ例**:
```javascript
{
  action: 'query',
  format: 'json',
  generator: 'search',
  gsrsearch: '箱根温泉 露天風呂 outdoor bath',
  gsrnamespace: 6,
  gsrlimit: 50,
  prop: 'imageinfo',
  iiprop: 'url|extmetadata'
}
```

### 画像最適化設定

**sharp の設定**:
```javascript
{
  sizes: [640, 1024, 1920],  // レスポンシブサイズ
  formats: ['webp', 'avif', 'jpg'],  // 出力フォーマット
  quality: { webp: 80, avif: 75, jpg: 85 }
}
```

---

## ⚠️ 注意事項

### 画像の使用について（最重要）

1. **自動反映禁止**: 取得した画像は `data/wikimedia-images.json` に保存するだけ
2. **ユーザー確認必須**: サイトへの反映はユーザーの承認後のみ
3. **品質チェック**: 実在の温泉（湯船・露天風呂）が映っている画像のみ
4. **ライセンス確認**: CC BY / CC BY-SA / Public domain のみ使用可

### セキュリティ

- ✅ Next.js 16.0.10 以上（必須）
- ✅ ESLint 9.39.2 以上（必須）
- ❌ npm audit で脆弱性があればコミット禁止

---

## 📝 作業フロー

```bash
# 1. 環境確認
npm audit  # 0 vulnerabilities であることを確認
npm list next eslint  # バージョン確認

# 2. 依存関係インストール
npm install

# 3. 開発サーバー起動
npm run dev

# 4. ビルドテスト
SKIP_CHECK=true npm run build

# 5. タスク実行
# 各エージェントの初日タスクを実行

# 6. 検証
npm run test:images  # 画像関連テスト
npx tsc --noEmit  # 型チェック
```

---

## 🎓 ベストプラクティス

### コード変更時

1. **最小限の変更**: 必要最小限の修正のみ
2. **型安全性**: 明示的な型注釈を追加
3. **JSON First**: コンテンツは `content.json` で管理
4. **テスト実行**: 変更後は必ずテスト実行

### コミット時

1. **わかりやすいメッセージ**: `feat:`, `fix:`, `chore:` などのプレフィックス
2. **小さなコミット**: 1つの変更につき1つのコミット
3. **ビルド確認**: コミット前に必ずビルド成功を確認

---

## 🆘 困ったときは

### エラーが発生したら

1. `npm audit` で脆弱性チェック
2. `npm list next eslint` でバージョン確認
3. `SKIP_CHECK=true npm run build` でビルドテスト
4. エラーログを確認して該当箇所を修正

### ドキュメントが見つからない

このファイル（AGENT_MASTER_GUIDE.md）に全体像があります。
他のファイルを読む必要はありません。

---

**次のアクション**: あなたの役割（エージェントA-D）を確認し、初日タスクを開始してください。
