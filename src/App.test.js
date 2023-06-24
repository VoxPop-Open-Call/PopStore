import { render, screen } from '@testing-library/react';
import App from './App';

test('Validate popstore', () => {
  render(<App />);
  const divElements = screen.getAllByText(/Crie uma PoPstore a partir de uma lista/i);
  expect(divElements[0]).toBeInTheDocument();
});
