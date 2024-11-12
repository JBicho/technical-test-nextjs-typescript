import { render, screen } from '@testing-library/react';
import { Meter, MeterProps } from '../../components/Meter/Meter';
import '../setupTests';

describe('Test Meter Component', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const meterProps: MeterProps = {
    id: 'someID',
    label: 'Some Label',
    max: 100,
    min: 0,
    value: 50,
  };

  const setupComponent = () => render(<Meter {...meterProps} />);

  it('Renders correctly and matches the snapshot', () => {
    const { asFragment } = setupComponent();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders with correct label', () => {
    setupComponent();

    expect(screen.getByText(meterProps.label)).toBeInTheDocument();
  });

  it('Renders meter with correct min, max, and value attributes', () => {
    setupComponent();

    const meterElement = screen.getByRole('meter');

    expect(meterElement).toHaveAttribute('min', '0');
    expect(meterElement).toHaveAttribute('max', '100');
    expect(meterElement).toHaveAttribute('value', '50');
  });
});
