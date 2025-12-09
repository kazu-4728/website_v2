/**
 * @deprecated Codex エージェント用のサンプル・実験コード
 * 
 * このテストファイルは Codex（GitHub Copilot Codex）エージェント用のサンプルコードです。
 * 実際のテンプレート修正を行う際は、以下のルールに従ってください：
 * 
 * 1. [`.cursorrules`](../../.cursorrules) - 共通ルールとアーキテクチャ
 * 2. [`docs/CODEX_AGENT_RULES.md`](../../docs/CODEX_AGENT_RULES.md) - Codex 向けの補足ルール
 * 3. [`docs/START_HERE.md`](../../docs/START_HERE.md) - 作業開始時の必須確認事項
 * 
 * 注意: このファイルには古い仕様が含まれている可能性があります。
 * 参考にする場合は、内容を最新の設計に合わせて確認してください。
 * 
 * このファイルは通常のテスト実行には含まれていません。
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Page from '../../app/page';

describe('Homepage', () => {
  it('renders the main heading', async () => {
    const PageComponent = await Page();
    render(PageComponent);
    // テキストが複数のspanに分かれているので、部分一致でテスト
    const heading = screen.getByRole('heading', { name: /心と体を\s*癒す旅へ/ });
    expect(heading).toBeInTheDocument();
  });
  
  it('renders navigation links', async () => {
    const PageComponent = await Page();
    render(PageComponent);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders call-to-action buttons', async () => {
    const PageComponent = await Page();
    render(PageComponent);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
