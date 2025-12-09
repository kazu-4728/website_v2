# C分類コンポーネントの再分類レポート

## 調査概要

C分類（削除候補）のコンポーネントを、再利用可能性に基づいてC1/C2に再分類しました。

**分類基準**:
- **C1**: 将来別テーマで再利用できそうな"派手コンポーネント"やユーティリティ
- **C2**: 古いブランド前提・設計も古く、ほぼ再利用しなさそうなもの

---

## 📊 C1: 再利用可能なコンポーネント・ユーティリティ

### 1. インタラクティブUIコンポーネント（Stripe風）

#### `app/components/stripe/AnimatedBackground.tsx`
- **役割**: Canvasベースのパーティクルアニメーション + Framer Motionのグラデーション背景
- **再利用可能性**: ⭐⭐⭐⭐ (高)
- **特徴**: 
  - Canvas APIとFramer Motionを使用した汎用的なアニメーション背景
  - 色はprimary-500などがハードコードされているが、propsで受け取れるように改修可能
  - SaaS系・モダンなWebサイトで再利用可能
- **改修ポイント**: 色をprops化、パーティクル数を調整可能に

#### `app/components/stripe/InteractiveCard.tsx`
- **役割**: マウス追従の3D傾斜効果を持つカードコンポーネント
- **再利用可能性**: ⭐⭐⭐⭐⭐ (非常に高)
- **特徴**:
  - Framer Motionの`useMotionValue`, `useSpring`, `useTransform`を使用
  - Stripeブランドに特化していない、完全に汎用的なインタラクティブUI
  - 任意の子要素をラップするだけで3D効果を付与可能
- **改修ポイント**: ほぼそのまま再利用可能

#### `app/components/stripe/StatCounter.tsx`
- **役割**: 数値がアニメーションでカウントアップする統計表示コンポーネント
- **再利用可能性**: ⭐⭐⭐⭐⭐ (非常に高)
- **特徴**:
  - Framer Motionの`useSpring`, `useTransform`を使用
  - ビューポートに入ったときに自動的にカウントアップ
  - prefix/suffix対応で柔軟な表示が可能
- **改修ポイント**: ほぼそのまま再利用可能

### 2. ページ生成ユーティリティ

#### `app/templates/page-templates.tsx`
- **役割**: ページ構造のテンプレート定義（landing, docs, blog, portfolio, faq）
- **再利用可能性**: ⭐⭐⭐ (中)
- **特徴**:
  - 現在のJSONベースの実装とは異なるアプローチ
  - 将来的にページ生成の自動化・CLIツール化に使える可能性
  - テンプレートベースのページ生成システムの基盤として有用
- **改修ポイント**: JSONベースの実装と統合するか、別の用途で活用

#### `app/templates/generate-page.ts`
- **役割**: テンプレートからページ構造を生成するユーティリティ
- **再利用可能性**: ⭐⭐⭐ (中)
- **特徴**:
  - `page-templates.tsx`とセットで使用
  - ページ構造の検証機能も含む
  - CLIツールやビルドスクリプトでの自動ページ生成に使える
- **改修ポイント**: JSONベースの実装と統合するか、別の用途で活用

---

## 🗑️ C2: 廃棄候補（古い設計・再利用困難）

### `app/config/theme.config.ts`
- **役割**: TypeScriptベースのテーマ定義システム（GitHub Docsテーマ、Stripeテーマ）
- **廃棄候補と判断した理由**:
  1. **現在の実装と完全に異なる**: 現在は`themes/onsen-kanto/content.json`と`texts.json`でテーマを管理しており、TypeScriptベースのテーマ定義は使用されていない
  2. **設計が古い**: JSON Firstアーキテクチャが確立されており、TypeScriptベースのテーマ定義は時代遅れ
  3. **実際に使用されていない**: `currentTheme`や`availableThemes`はどこからも参照されていない
  4. **統合困難**: JSONベースの実装と統合するには大幅な改修が必要で、コストが高い
  5. **重複**: `themes/github-docs/theme.config.ts`が存在する可能性がある（確認が必要）

**確認事項**:
- `themes/github-docs/theme.config.ts`との重複を確認
- 他のテーマ（portfolio等）で使用されているか確認

---

## 📁 C1コンポーネントの移動提案

### 提案ディレクトリ構成

```
app/
├── components/
│   └── labs/                    # 実験的・将来再利用可能なコンポーネント
│       ├── interactive/         # インタラクティブUIコンポーネント
│       │   ├── AnimatedBackground.tsx
│       │   ├── InteractiveCard.tsx
│       │   └── StatCounter.tsx
│       └── README.md           # 使用方法と注意事項
│
└── lib/
    └── templates/              # ページ生成ユーティリティ
        ├── page-templates.tsx
        ├── generate-page.ts
        └── README.md          # 使用方法と将来の統合計画
```

### 代替案1: テーマ配下に配置

```
themes/
└── experimental/              # 実験的テーマ・コンポーネント
    ├── components/
    │   ├── AnimatedBackground.tsx
    │   ├── InteractiveCard.tsx
    │   └── StatCounter.tsx
    └── README.md
```

### 代替案2: 完全に外部化

```
experimental/                 # リポジトリルートに配置
├── components/
│   ├── AnimatedBackground.tsx
│   ├── InteractiveCard.tsx
│   └── StatCounter.tsx
├── templates/
│   ├── page-templates.tsx
│   └── generate-page.ts
└── README.md
```

---

## 🎯 推奨構成案: `app/components/labs/` + `app/lib/templates/`

### メリット

1. **明確な分離**: `labs/`ディレクトリで「実験的・将来再利用可能」であることを明示
2. **ビルドへの影響なし**: `app/`配下に配置することで、Next.jsのビルドシステムからは認識されるが、実際のページでは使用されない
3. **インポートパスが明確**: `@/components/labs/interactive/`として明確に識別可能
4. **段階的な統合**: 将来的に正式なコンポーネントとして昇格する際の移行パスが明確
5. **ドキュメント化しやすい**: 各ディレクトリにREADME.mdを配置して使用方法を記載可能

### 移動リスト

#### インタラクティブUIコンポーネント
```
app/components/stripe/AnimatedBackground.tsx
  → app/components/labs/interactive/AnimatedBackground.tsx

app/components/stripe/InteractiveCard.tsx
  → app/components/labs/interactive/InteractiveCard.tsx

app/components/stripe/StatCounter.tsx
  → app/components/labs/interactive/StatCounter.tsx
```

#### ページ生成ユーティリティ
```
app/templates/page-templates.tsx
  → app/lib/templates/page-templates.tsx

app/templates/generate-page.ts
  → app/lib/templates/generate-page.ts
```

### 追加で作成すべきファイル

1. **`app/components/labs/README.md`**
   - 実験的コンポーネントの説明
   - 使用方法と注意事項
   - 正式コンポーネントへの昇格基準

2. **`app/components/labs/interactive/README.md`**
   - 各コンポーネントの詳細な使用方法
   - propsの説明
   - 使用例

3. **`app/lib/templates/README.md`**
   - ページ生成ユーティリティの説明
   - 現在のJSONベース実装との関係
   - 将来の統合計画

---

## 🗑️ C2: 廃棄候補リスト

### `app/config/theme.config.ts`

**削除前に確認すべき事項**:
- [ ] `themes/github-docs/theme.config.ts`との重複確認
- [ ] `themes/portfolio/theme.config.ts`との重複確認
- [ ] 他のテーマで使用されているか確認
- [ ] ビルドスクリプトやCI/CDでの参照確認

**削除理由**:
1. 現在のJSON Firstアーキテクチャと完全に異なる設計
2. 実際に使用されていない
3. 統合コストが高すぎる
4. 重複の可能性が高い

**削除後の影響**:
- ビルドエラー: なし（参照されていない）
- 機能への影響: なし（使用されていない）

---

## 📋 次のステップ

### フェーズ1: C1コンポーネントの移動
1. `app/components/labs/interactive/`ディレクトリを作成
2. Stripeコンポーネントを移動
3. `app/lib/templates/`ディレクトリを作成
4. テンプレートユーティリティを移動
5. README.mdファイルを作成

### フェーズ2: C2コンポーネントの確認と削除
1. 重複確認
2. 使用状況の最終確認
3. 削除実行

---

**作成日**: 2025-12-02  
**調査者**: Composer (Cursor AI)
