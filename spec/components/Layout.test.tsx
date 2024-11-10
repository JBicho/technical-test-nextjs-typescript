import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Layout } from '../../components/LayoutComponent/Layout';

describe('Test Layout Component', () => {
  it('should match snapshot with a mock page', () => {
    const mockPage: ReactElement = <div>Mock Page Content</div>;

    const { asFragment } = render(<>{Layout(mockPage)}</>);

    expect(asFragment()).toMatchSnapshot();
  });
});
