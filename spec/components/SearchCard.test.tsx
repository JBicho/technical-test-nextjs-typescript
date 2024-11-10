import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { SearchCard } from '../../components/SearchCard/SearchCard';

describe('Test Search Card Component', () => {
  it('should match snapshot with a mock page', () => {
    expect(render(<SearchCard />)).toMatchSnapshot();
  });
});
