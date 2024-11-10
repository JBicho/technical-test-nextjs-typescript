import { fireEvent, render, screen } from '@testing-library/react';
import {
  SearchInput,
  SearchInputProps,
} from '../../components/SearchInput/SearchInput';
import '../setupTests';

describe('Test Search Input Component', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const searchInputProps: SearchInputProps = {
    id: 'someID',
    label: 'someLabel',
    placeholder: 'somePlaceHolder',
    onSearch: jest.fn(),
  };

  const setupComponent = () => {
    return render(<SearchInput {...searchInputProps} />);
  };

  it('renders correctly and matches the snapshot', () => {
    const { asFragment } = setupComponent();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with the correct label and placeholder', () => {
    setupComponent();

    expect(screen.getByLabelText(searchInputProps.label)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(searchInputProps.placeholder)
    ).toBeInTheDocument();
  });

  it('calls onSearch with the correct query on input change', () => {
    setupComponent();

    const input = screen.getByPlaceholderText(searchInputProps.placeholder);

    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(searchInputProps.onSearch).toHaveBeenCalledWith('Hello');

    fireEvent.change(input, { target: { value: 'Hello World' } });

    expect(searchInputProps.onSearch).toHaveBeenCalledWith('Hello World');
  });

  it('calls onSearch with an empty string when input is cleared', () => {
    setupComponent();

    const input = screen.getByPlaceholderText(searchInputProps.placeholder);

    fireEvent.change(input, { target: { value: 'Search Term' } });

    expect(searchInputProps.onSearch).toHaveBeenCalledWith('Search Term');

    fireEvent.change(input, { target: { value: '' } });

    expect(searchInputProps.onSearch).toHaveBeenCalledWith('');
  });
});
