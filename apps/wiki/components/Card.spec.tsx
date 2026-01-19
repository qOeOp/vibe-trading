import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders correctly', () => {
    render(
      <Card
        title="Test Title"
        description="Test Description"
        href="/test-link"
      />
    );

    expect(screen.getByText('Test Title')).toBeTruthy();
    expect(screen.getByText('Test Description')).toBeTruthy();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/test-link');
  });
});
