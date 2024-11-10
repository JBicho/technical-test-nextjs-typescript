import { render, screen } from '@testing-library/react';
import { Counter, CounterProps } from '../../components/Counter/Counter';
import '../setupTests';

describe('Test Counter Component', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const counterProps: CounterProps = {
    countOverThreshold: 239,
    max: 235,
    min: 100,
  };

  const setupComponent = () => render(<Counter {...counterProps} />);

  it('renders correctly and matches the snapshot', () => {
    const { asFragment } = setupComponent();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render the component with the correct props', () => {
    setupComponent();

    expect(
      screen
        .getByText('Count over threshold:')
        .closest('p')
        ?.querySelector('span > strong')
    ).toHaveTextContent(counterProps.countOverThreshold.toString());

    expect(
      screen.getByText('Min:').closest('p')?.querySelector('span > strong')
    ).toHaveTextContent(counterProps.min.toString());

    expect(
      screen.getByText('Max:').closest('p')?.querySelector('span > strong')
    ).toHaveTextContent(counterProps.max.toString());
  });
});
