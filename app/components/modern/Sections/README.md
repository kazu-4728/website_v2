# Section Components

## 状態

これらのSectionコンポーネントは`themes/onsen-kanto/content.json`で定義されていますが、現在の`app/page.tsx`では使用されていません。

新しい実装では、`src/ui/components/OnsenCard`を直接使用しています。

## コンポーネント一覧

- `ImmersiveStorySection` - `content.json`で定義されているが未使用
- `OverlapSection` - `content.json`で定義されているが未使用
- `PremiumGridSection` - `content.json`で定義されているが未使用
- `SplitSection` - 未使用
- `GridSection` - 未使用

## 今後の対応

1. **使用する場合**: `app/page.tsx`で`content.pages.home.sections`をレンダリングするロジックを追加
2. **削除する場合**: `content.json`から該当セクションを削除し、コンポーネントも削除

現在は、将来的な使用に備えて保持していますが、実際には使用されていません。
