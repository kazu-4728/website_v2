#!/usr/bin/env node

/**
 * ページ自動生成スクリプト
 * 使い方: node scripts/generate-page.js [template] [slug] [title]
 * 例: node scripts/generate-page.js docs getting-started "Getting Started"
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('使い方: node scripts/generate-page.js [template] [slug] [title]');
  console.error('例: node scripts/generate-page.js docs getting-started "Getting Started"');
  process.exit(1);
}

const [template, slug, title] = args;

const templates = {
  docs: `import { PageHeader } from '@/app/components/ui/PageHeader';
import { Container } from '@/app/components/ui/Container';
import { ContentSection } from '@/app/components/layouts/ContentSection';

export default function ${toPascalCase(slug)}Page() {
  return (
    <>
      <PageHeader
        title="${title}"
        description="ページの説明をここに記載"
      />
      
      <ContentSection>
        <div className="prose prose-invert max-w-none">
          <p>コンテンツをここに追加してください。</p>
        </div>
      </ContentSection>
    </>
  );
}
`,
  
  landing: `import { HeroSection } from '@/app/components/layouts/HeroSection';
import { ContentSection } from '@/app/components/layouts/ContentSection';
import { Grid } from '@/app/components/ui/Grid';
import { FeatureCard } from '@/app/components/cards/FeatureCard';

export default function ${toPascalCase(slug)}Page() {
  return (
    <>
      <HeroSection
        title="${title}"
        description="魅力的な説明文をここに追加"
        primaryCta={{ text: '始める', href: '/guides' }}
        secondaryCta={{ text: '詳しく見る', href: '/docs' }}
      />
      
      <ContentSection
        title="主な機能"
        subtitle="Features"
        centered
      >
        <Grid cols={3}>
          {/* FeatureCardを追加 */}
        </Grid>
      </ContentSection>
    </>
  );
}
`,
  
  blog: `import { PageHeader } from '@/app/components/ui/PageHeader';
import { ContentSection } from '@/app/components/layouts/ContentSection';
import { Grid } from '@/app/components/ui/Grid';
import { ContentCard } from '@/app/components/cards/ContentCard';

export default function ${toPascalCase(slug)}Page() {
  return (
    <>
      <PageHeader
        title="${title}"
        description="最新の記事とニュース"
      />
      
      <ContentSection>
        <Grid cols={3}>
          {/* ContentCardを追加 */}
        </Grid>
      </ContentSection>
    </>
  );
}
`,
};

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const pageContent = templates[template];
if (!pageContent) {
  console.error(`テンプレート "${template}" が見つかりません`);
  console.error('利用可能なテンプレート:', Object.keys(templates).join(', '));
  process.exit(1);
}

// ページファイルのパス
const pagePath = path.join(__dirname, '..', 'app', slug, 'page.tsx');
const pageDir = path.dirname(pagePath);

// ディレクトリ作成
if (!fs.existsSync(pageDir)) {
  fs.mkdirSync(pageDir, { recursive: true });
}

// ファイル書き込み
fs.writeFileSync(pagePath, pageContent);

console.log('✅ ページを生成しました:', pagePath);
console.log('📝 コンテンツを編集してカスタマイズしてください。');
