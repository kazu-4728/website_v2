# アーカイブコンポーネント

このディレクトリには、現在使用されていないが将来再利用する可能性のあるコンポーネントが保存されています。

## 保存されているコンポーネント

### Badge.tsx
汎用バッジコンポーネント。タグやラベル表示に使用可能。

**特徴:**
- variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
- カスタムスタイリング対応

**使用例:**
```tsx
import { Badge } from '../_archive/Badge';

<Badge variant="primary">New</Badge>
```

### Container.tsx
コンテンツコンテナコンポーネント。レスポンシブな幅制御に使用可能。

**特徴:**
- size: 'sm' | 'md' | 'lg' | 'xl'
- 自動センタリング
- レスポンシブ対応

**使用例:**
```tsx
import { Container } from '../_archive/Container';

<Container size="lg">
  {/* コンテンツ */}
</Container>
```

### Grid.tsx
グリッドレイアウトコンポーネント。カード一覧などに使用可能。

**特徴:**
- cols: 1 | 2 | 3 | 4
- gap: カスタムギャップサイズ
- レスポンシブ対応

**使用例:**
```tsx
import { Grid } from '../_archive/Grid';

<Grid cols={3} gap={8}>
  <Card />
  <Card />
  <Card />
</Grid>
```

## 使用方法

これらのコンポーネントを使用する場合は、`_archive` から必要な場所にコピーまたは移動してください。
直接 `_archive` からインポートすることも可能ですが、長期的には適切な場所に移動することを推奨します。

## 削除について

これらのコンポーネントが6ヶ月以上使用されない場合は、削除を検討してください。
