import { render, screen } from '@testing-library/react';
import { Counter, CounterProps } from '../../components/Counter/Counter';
import '../setupTests';

describe('Test Counter Component', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const counterProps: CounterProps = {
    count: 239,
    max: 235,
    min: 100,
  };

  const setupComponent = () => render(<Counter {...counterProps} />);

  it('Renders correctly and matches the snapshot', () => {
    const { asFragment } = setupComponent();
    
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render the component with the correct props', () => {
    setupComponent();

    expect(
      screen.getByText('Count:').closest('p')?.querySelector('span > strong')
    ).toHaveTextContent(counterProps.count.toString());

    expect(
      screen.getByText('Min:').closest('p')?.querySelector('span > strong')
    ).toHaveTextContent(counterProps.min.toString());

    expect(
      screen.getByText('Max:').closest('p')?.querySelector('span > strong')
    ).toHaveTextContent(counterProps.max.toString());
  });
});
