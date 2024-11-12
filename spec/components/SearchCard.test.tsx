import { act, fireEvent, render, screen, within } from '@testing-library/react';
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

describe('SearchCard Component', () => {
  const defaultProps: SearchCardProps = {
    onSearch: jest.fn(),
    displayCount: false,
    countObject: {
      count: 0,
      min: 0,
      max: 100,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('Should render both search inputs with correct labels and placeholders', () => {
      render(<SearchCard {...defaultProps} />);

      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      expect(screen.getByLabelText('Power threshold')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search a Pokemon Name')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Write a Power Threshold')
      ).toBeInTheDocument();
    });

    it('Should render counter section when displayCount is true and count > 0', () => {
      render(
        <SearchCard
          {...defaultProps}
          displayCount={true}
          countObject={{
            count: 5,
            min: 10,
            max: 100,
          }}
        />
      );

      const counterSection = screen.getByRole('status');
      expect(within(counterSection).getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Min:')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Max:')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('Should not render counter section when displayCount is false', () => {
      render(<SearchCard {...defaultProps} displayCount={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('Should render counter with zero values when displayCount is true and count is 0', () => {
      render(
        <SearchCard
          {...defaultProps}
          displayCount={true}
          countObject={{
            count: 0,
            min: 0,
            max: 0,
          }}
        />
      );

      const counterSection = screen.queryByRole('status');

      expect(counterSection).toBeInTheDocument();


      expect(screen.getByText('Count:')).toBeInTheDocument();

      const countValue = within(screen.getByRole('status')).getByText('0');

      expect(countValue).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('Should call onSearch with debounce when pokemon name changes', async () => {
      const onSearch = jest.fn();

      render(<SearchCard {...defaultProps} onSearch={onSearch} />);

      const nameInput = screen.getByPlaceholderText('Search a Pokemon Name');

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'Pikachu' } });
      });

      expect(lodash.debounce).toHaveBeenCalledWith(expect.any(Function), 300);
    });

    it('Should call onSearch with debounce when power threshold changes', async () => {
      const onSearch = jest.fn();

      render(<SearchCard {...defaultProps} onSearch={onSearch} />);

      const powerInput = screen.getByPlaceholderText('Write a Power Threshold');

      await act(async () => {
        fireEvent.change(powerInput, { target: { value: '100' } });
      });

      expect(lodash.debounce).toHaveBeenCalledWith(expect.any(Function), 300);
    });

    it('Should use throttle for rapid input changes', async () => {
      const onSearch = jest.fn();
      render(<SearchCard {...defaultProps} onSearch={onSearch} />);

      const nameInput = screen.getByPlaceholderText('Search a Pokemon Name');

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'P' } });
        fireEvent.change(nameInput, { target: { value: 'Pi' } });
        fireEvent.change(nameInput, { target: { value: 'Pik' } });
      });

      expect(lodash.throttle).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it('Should preserve both search values during updates', async () => {
      const onSearch = jest.fn();

      render(<SearchCard {...defaultProps} onSearch={onSearch} />);

      const nameInput = screen.getByPlaceholderText('Search a Pokemon Name');
      const powerInput = screen.getByPlaceholderText('Write a Power Threshold');

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'Pikachu' } });
        fireEvent.change(powerInput, { target: { value: '100' } });
      });

      expect(nameInput).toHaveValue('Pikachu');
      expect(powerInput).toHaveValue('100');
    });
  });

  describe('Cleanup', () => {
    it('Should cancel debounce on unmount', () => {
      const { unmount } = render(<SearchCard {...defaultProps} />);

      const debouncedFn = (lodash.debounce as jest.Mock).mock.results[0]
        .value as MockedDebouncedFunction;

      unmount();

      expect(debouncedFn.cancel).toHaveBeenCalled();
    });
  });
});
