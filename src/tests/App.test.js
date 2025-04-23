import { render, screen } from '@testing-library/react';
import PrincipalLogin from '../pages/PrincipalLogin';

test('renders learn react link', () => {
  render(<PrincipalLogin />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
