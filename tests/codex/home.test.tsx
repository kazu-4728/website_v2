import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Page from '../../app/page';

describe('Homepage', () => {
  it('renders the main heading', () => {
    render(<Page />);
    // テキストが複数のspanに分かれているので、部分一致でテスト
    const heading = screen.getByRole('heading', { name: /GitHub Docs/i });
    expect(heading).toBeInTheDocument();
  });
  
  it('renders navigation links', () => {
    render(<Page />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders call-to-action buttons', () => {
    render(<Page />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
