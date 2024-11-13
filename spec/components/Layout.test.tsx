import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Layout } from '../../components/LayoutComponent/Layout';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    <img src={src} alt={alt} width={width} height={height} />
  ),
}));

describe('Layout Component', () => {
  const mockRouter = {
    pathname: '/some-page',
    push: jest.fn(),
  };

  const mockPage: ReactElement = <div>Mock Page Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const setupComponent = () => {
    return render(<>{Layout(mockPage)}</>);
  };

  it('Should match snapshot with a mock page', () => {
    const { asFragment } = setupComponent();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Should match snapshot when on homepage', () => {
    (useRouter as jest.Mock).mockReturnValue({
      ...mockRouter,
      pathname: '/',
    });

    const { asFragment } = setupComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render the page content', () => {
    const { getByText } = setupComponent();
    const content = getByText('Mock Page Content');

    expect(content).toBeInTheDocument();
  });

  it('Should render the home link and image', () => {
    const { getByAltText, getByText } = setupComponent();
    const image = getByAltText('Pokeball Image');
    const link = getByText('Home');

    expect(image).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });

  it('Should render with proper attributes', () => {
    const { getByAltText, getByRole } = setupComponent();
    const image = getByAltText('Pokeball Image');
    const link = getByRole('link', { name: /home/i });

    expect(image).toHaveAttribute('width', '60');
    expect(image).toHaveAttribute('height', '60');
    expect(link).toHaveAttribute('href', '/');
  });
});
