#!/bin/bash

# リポジトリ状態検証スクリプト
# すべてのエージェントが実行して、リポジトリの状態を確認する

echo "🔍 リポジトリ状態検証スクリプト"
echo "================================"
echo ""

# カウンター
PASS=0
FAIL=0
WARN=0

# 1. ビルドチェック
echo "📦 1. ビルドチェック..."
if npm run build > /dev/null 2>&1; then
  echo "   ✅ ビルド成功"
  ((PASS++))
else
  echo "   ❌ ビルド失敗"
  ((FAIL++))
fi
echo ""

# 2. 必須ドキュメント存在確認
echo "📄 2. 必須ドキュメント存在確認..."
REQUIRED_DOCS=(
  "docs/START_HERE.md"
  "docs/CURRENT_STATE.md"
  "docs/REPOSITORY_GUIDE.md"
  ".github/AGENT_RULES.md"
  ".cursorrules"
)

for doc in "${REQUIRED_DOCS[@]}"; do
  if [ -f "$doc" ]; then
    echo "   ✅ $doc 存在"
    ((PASS++))
  else
    echo "   ❌ $doc 未作成"
    ((FAIL++))
  fi
done
echo ""

# 3. 新コンポーネント使用状況
echo "🔎 3. 新コンポーネント使用状況..."
if grep -r "from './components/modern" app/page.tsx > /dev/null 2>&1; then
  echo "   ✅ 新コンポーネントが使用されています"
  ((PASS++))
else
  echo "   ⚠️  新コンポーネントが使用されていません（Phase 2で実装予定）"
  ((WARN++))
fi
echo ""

# 4. レガシーコンポーネント残存確認
echo "🔎 4. レガシーコンポーネント残存確認..."
legacy_count=$(grep -r "from './components/_legacy" app/page.tsx 2>/dev/null | wc -l)
if [ "$legacy_count" -gt 0 ]; then
  echo "   ⚠️  レガシーコンポーネント: ${legacy_count}個（Phase 2で段階的に移行予定）"
  ((WARN++))
else
  echo "   ✅ レガシーコンポーネントなし"
  ((PASS++))
fi
echo ""

# 5. モダンコンポーネント存在確認
echo "🔎 5. モダンコンポーネント存在確認..."
MODERN_COMPONENTS=(
  "app/components/modern/Navigation/PremiumNav.tsx"
  "app/components/modern/Hero/OceanViewHero.tsx"
  "app/components/modern/Cards/PremiumCard.tsx"
)

for comp in "${MODERN_COMPONENTS[@]}"; do
  if [ -f "$comp" ]; then
    echo "   ✅ $(basename $comp) 作成済み"
    ((PASS++))
  else
    echo "   ❌ $(basename $comp) 未作成"
    ((FAIL++))
  fi
done
echo ""

# 6. アーカイブディレクトリ確認
echo "📁 6. アーカイブディレクトリ確認..."
ARCHIVE_DIRS=(
  "docs/archive"
  "docs/archive/analysis"
  "docs/archive/guides"
  "docs/archive/reports"
)

for dir in "${ARCHIVE_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "   ✅ $dir 存在"
    ((PASS++))
  else
    echo "   ❌ $dir 未作成"
    ((FAIL++))
  fi
done
echo ""

# 7. TypeScript型チェック
echo "🔧 7. TypeScript型チェック..."
if npx tsc --noEmit > /dev/null 2>&1; then
  echo "   ✅ 型エラーなし"
  ((PASS++))
else
  echo "   ⚠️  型エラーあり（要確認）"
  ((WARN++))
fi
echo ""

# 結果サマリー
echo "================================"
echo "📊 検証結果サマリー"
echo "================================"
echo "✅ 合格: $PASS"
echo "⚠️  警告: $WARN"
echo "❌ 失敗: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 リポジトリは良好な状態です"
  exit 0
else
  echo "⚠️  改善が必要な項目があります"
  exit 1
fi
