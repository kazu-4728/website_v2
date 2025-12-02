/**
 * ページ自動生成ユーティリティ
 */

import { PageTemplate, pageTemplates } from './page-templates';

interface PageConfig {
  template: PageTemplate;
  title: string;
  description?: string;
  sections: {
    type: string;
    props: Record<string, any>;
  }[];
}

export function generatePageStructure(config: PageConfig) {
  const template = pageTemplates[config.template];
  
  return {
    metadata: {
      title: config.title,
      description: config.description,
    },
    layout: template.layout,
    sections: config.sections,
  };
}

export function validatePageConfig(config: PageConfig): boolean {
  const template = pageTemplates[config.template];
  const requiredSections = template.sections
    .filter(s => s.required)
    .map(s => s.type);
  
  const providedSections = config.sections.map(s => s.type);
  
  return requiredSections.every(required =>
    providedSections.includes(required)
  );
}
