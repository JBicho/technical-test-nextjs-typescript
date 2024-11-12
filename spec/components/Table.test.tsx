import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { calculatePokemonPower } from '../../common/utils/calculatePokemonPower';
import { Table, TableProps } from '../../components/Table/Table';
import '../setupTests';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../common/utils/calculatePokemonPower');

describe('Test Table Component', () => {
  const mockPush = jest.fn();
  const mockHandlePagination = jest.fn();

  const defaultPaginationData = {
    currentPage: 1,
    totalPages: 3,
    totalItems: 25,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPreviousPage: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (calculatePokemonPower as jest.Mock).mockReturnValue(100);
  });

  const defaultProps: TableProps = {
    pokemonList: [
      {
        id: 1,
        name: 'Bulbasaur',
        type: ['Grass', 'Poison'],
        hp: 45,
        attack: 49,
        defense: 55,
        special_attack: 65,
        special_defense: 61,
        speed: 41,
      },
    ],
    paginationData: defaultPaginationData,
    handlePagination: mockHandlePagination,
  };

  const setupComponent = (props = defaultProps) => render(<Table {...props} />);

  describe('Basic Rendering', () => {
    it('Renders table headers correctly', () => {
      setupComponent();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Stats')).toBeInTheDocument();
      expect(screen.getByText('Power')).toBeInTheDocument();
    });

    it('Renders pokemon data correctly', () => {
      setupComponent();
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('Grass, Poison')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('Renders empty state when no pokemon are found', () => {
      setupComponent({
        ...defaultProps,
        pokemonList: [],
      });
      expect(screen.getByText('No pokemon found')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('Handles Pokemon with empty type array', () => {
      setupComponent({
        ...defaultProps,
        pokemonList: [
          {
            ...defaultProps.pokemonList[0],
            type: [],
          },
        ],
      });

      const row = screen.getByText('Bulbasaur').closest('tr');

      expect(row).toBeInTheDocument();

      const typeTd = row!.querySelectorAll('td')[2];

      expect(typeTd.textContent).toBe('');
    });

    it('Handles Pokemon with single type correctly', () => {
      setupComponent({
        ...defaultProps,
        pokemonList: [
          {
            ...defaultProps.pokemonList[0],
            type: ['Fire'],
          },
        ],
      });

      expect(screen.getByText('Fire')).toBeInTheDocument();
    });

    it('Handles Pokemon with multiple types correctly', () => {
      setupComponent();

      expect(screen.getByText('Grass, Poison')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('Disables previous button on first page', () => {
      setupComponent();

      const prevButton = screen.getByText('Prev').closest('button');

      expect(prevButton).toBeDisabled();
    });

    it('Enables next button when hasNextPage is true', () => {
      setupComponent();

      const nextButton = screen.getByText('Next').closest('button');

      expect(nextButton).not.toBeDisabled();
    });

    it('Shows correct page information', () => {
      setupComponent();

      expect(
        screen.getByText(
          `Page ${defaultPaginationData.currentPage} of ${defaultPaginationData.totalPages}`
        )
      ).toBeInTheDocument();
    });

    it('Calls handlePagination with correct page number', () => {
      setupComponent();

      const nextButton = screen.getByText('Next').closest('button');

      fireEvent.click(nextButton!);

      expect(mockHandlePagination).toHaveBeenCalledWith(2);
    });
  });

  describe('Navigation', () => {
    it('Navigates to pokemon detail page when row is clicked', () => {
      setupComponent();

      const row = screen.getByText('Bulbasaur').closest('tr');

      fireEvent.click(row!);

      expect(mockPush).toHaveBeenCalledWith('/pokemon/1');
    });
  });

  describe('Power Calculation', () => {
    it('Calls calculatePokemonPower with correct parameters', () => {
      setupComponent();

      expect(calculatePokemonPower).toHaveBeenCalledWith({
        attack: defaultProps.pokemonList[0].attack,
        defense: defaultProps.pokemonList[0].defense,
        hp: defaultProps.pokemonList[0].hp,
        special_attack: defaultProps.pokemonList[0].special_attack,
        special_defense: defaultProps.pokemonList[0].special_defense,
        speed: defaultProps.pokemonList[0].speed,
      });
    });
  });
});
