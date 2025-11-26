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
