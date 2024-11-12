import { render, screen } from '@testing-library/react';
import { Card } from '../../components/Card/Card';
import '../setupTests';

describe('Test Card Component', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const childContent = 'This is some content';
  const InlineChild = () => <p>{childContent}</p>;

  const setupComponent = () =>
    render(
      <Card>
        <InlineChild />
      </Card>
    );

  it('Renders correctly and matches the snapshot', () => {
    const { asFragment } = setupComponent();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render the component with children', () => {
    setupComponent();

    expect(screen.getByText(childContent)).toBeInTheDocument();
  });
});
