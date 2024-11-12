import { act, fireEvent, render, waitFor } from '@testing-library/react';
import * as lodash from 'lodash';
import {
  SearchCard,
  SearchCardProps,
} from '../../components/SearchCard/SearchCard';
import '../setupTests';

type DebouncedFunction = {
  (...args: any[]): void;
  cancel: () => void;
};

type MockedDebouncedFunction = jest.Mock & DebouncedFunction;

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: jest.fn((fn) => {
    const debouncedFn = jest.fn(fn) as MockedDebouncedFunction;
    debouncedFn.cancel = jest.fn();
    return debouncedFn;
  }),
  throttle: jest.fn((fn) => {
    const throttledFn = jest.fn(fn) as MockedDebouncedFunction;
    throttledFn.cancel = jest.fn();
    return throttledFn;
  }),
}));

describe('SearchCard', () => {
  const defaultProps: SearchCardProps = {
    onSearch: jest.fn(),
    displayCount: true,
    countObject: {
      count: 0,
      min: 0,
      max: 100,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders both search inputs with correct labels and placeholders', () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <SearchCard {...defaultProps} />
    );

    expect(getByLabelText('Search')).toBeInTheDocument();
    expect(getByLabelText('Power threshold')).toBeInTheDocument();
    expect(getByPlaceholderText('Search a Pokemon Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Write a Power Threshold')).toBeInTheDocument();
  });

  it('Shows Counter component when count is greater than 0', () => {
    const props = {
      ...defaultProps,
      countObject: {
        count: 5,
        min: 0,
        max: 100,
      },
    };

    const { getByText } = render(<SearchCard {...props} />);

    expect(getByText('5')).toBeInTheDocument();
  });

  it('Does not show Counter component when count is 0', () => {
    const { queryByText } = render(<SearchCard {...defaultProps} />);

    expect(queryByText('0')).not.toBeInTheDocument();
  });

  it('Calls onSearch with debounce when pokemon name changes', async () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchCard {...defaultProps} onSearch={onSearch} />
    );
    const nameInput = getByPlaceholderText('Search a Pokemon Name');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Pikachu' } });
    });

    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledWith('Pikachu', '');
      },
      { timeout: 400 }
    );
  });

  it('Calls onSearch with debounce when power threshold changes', async () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchCard {...defaultProps} onSearch={onSearch} />
    );
    const powerInput = getByPlaceholderText('Write a Power Threshold');

    await act(async () => {
      fireEvent.change(powerInput, { target: { value: '100' } });
    });

    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledWith('', '100');
      },
      { timeout: 400 }
    );
  });

  it('Applies throttling to search calls', async () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchCard {...defaultProps} onSearch={onSearch} />
    );
    const nameInput = getByPlaceholderText('Search a Pokemon Name');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'P' } });
      fireEvent.change(nameInput, { target: { value: 'Pi' } });
      fireEvent.change(nameInput, { target: { value: 'Pik' } });
      fireEvent.change(nameInput, { target: { value: 'Pika' } });
    });

    expect(lodash.throttle).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  it('Cleans up debounce on unmount', () => {
    const { unmount } = render(<SearchCard {...defaultProps} />);
    const debouncedFn = (lodash.debounce as jest.Mock).mock.results[0]
      .value as MockedDebouncedFunction;

    unmount();

    expect(debouncedFn.cancel).toHaveBeenCalled();
  });

  it('Updates both search terms together', async () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchCard {...defaultProps} onSearch={onSearch} />
    );
    const nameInput = getByPlaceholderText('Search a Pokemon Name');
    const powerInput = getByPlaceholderText('Write a Power Threshold');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Pikachu' } });
      fireEvent.change(powerInput, { target: { value: '100' } });
    });

    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledWith('Pikachu', '100');
      },
      { timeout: 400 }
    );
  });
});
