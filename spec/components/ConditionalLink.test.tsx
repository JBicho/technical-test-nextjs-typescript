import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ConditionalLink } from '../../components/ConditionalLink/ConditionalLink';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next/link', () => {
  return ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: any;
  }) => {
    return (
      <a href={href} data-testid="mock-link" {...props}>
        {children}
      </a>
    );
  };
});

describe('ConditionalLink Component', () => {
  const mockRouter = {
    pathname: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('Should render children content', () => {
    render(
      <ConditionalLink href="/test">
        <span>Test Link</span>
      </ConditionalLink>
    );

    const element = screen.getByText('Test Link');
    expect(element).toBeInTheDocument();
  });

  it('Should render actual href when not on homepage', () => {
    mockRouter.pathname = '/some-other-page';
    const testHref = '/test-link';

    render(
      <ConditionalLink href={testHref}>
        <span>Test Link</span>
      </ConditionalLink>
    );

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', testHref);
  });

  it('Should render # as href when on homepage', () => {
    mockRouter.pathname = '/';

    render(
      <ConditionalLink href="/test-link">
        <span>Test Link</span>
      </ConditionalLink>
    );

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '#');
  });

  it('Should not have disabled state when not on homepage', () => {
    mockRouter.pathname = '/other-page';

    render(
      <ConditionalLink href="/test-link">
        <span>Test Link</span>
      </ConditionalLink>
    );

    const linkElement = screen.getByTestId('mock-link');
    expect(linkElement).not.toHaveAttribute('aria-disabled');
  });

  it('Should render complex children correctly', () => {
    render(
      <ConditionalLink href="/test">
        <div>
          <span>Test</span>
          <img alt="test" src="test.jpg" />
        </div>
      </ConditionalLink>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByAltText('test')).toBeInTheDocument();
  });

  it('Should handle empty href gracefully', () => {
    mockRouter.pathname = '/';

    render(
      <ConditionalLink href="">
        <span>Test Link</span>
      </ConditionalLink>
    );

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '#');
  });
});
