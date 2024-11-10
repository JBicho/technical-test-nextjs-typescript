import '@testing-library/jest-dom'; // Add this import
import { render, screen } from '@testing-library/react';
import { Pokemon } from '../../common/interfaces/pokemon';
import { logger } from '../../common/utils/logger';
import { Layout } from '../../components/LayoutComponent/Layout';
import { Table } from '../../components/Table/Table';
import HomePage, { getServerSideProps } from '../../pages';

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-head">{children}</div>
    ),
  };
});

jest.mock('../../components/SearchCard/SearchCard', () => ({
  SearchCard: jest.fn(() => <div data-testid="mock-search-card" />),
}));

jest.mock('../../components/Table/Table', () => ({
  Table: jest.fn(() => <div data-testid="mock-table" />),
}));

jest.mock('../../common/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe('HomePage Component', () => {
  const mockPokemonList = [
    {
      id: 1,
      name: 'Bulbasaur',
      type: ['Grass', 'Poison'],
      hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
    },
    {
      id: 2,
      name: 'Ivysaur',
      type: ['Grass', 'Poison'],
      hp: 60,
      attack: 62,
      defense: 63,
      special_attack: 80,
      special_defense: 80,
      speed: 60,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Component Rendering', () => {
    it('should render the HomePage with all components', () => {
      render(<HomePage pokemonList={mockPokemonList} />);

      expect(screen.getByText('Pokemon list')).toBeInTheDocument();
      expect(screen.getByTestId('mock-search-card')).toBeInTheDocument();
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
      expect(Table).toHaveBeenCalledWith(
        { pokemonList: mockPokemonList },
        expect.any(Object)
      );
    });

    it('Should render with empty pokemon list', () => {
      render(<HomePage pokemonList={[]} />);

      expect(screen.getByText('Pokemon list')).toBeInTheDocument();
      expect(Table).toHaveBeenCalledWith(
        { pokemonList: [] },
        expect.any(Object)
      );
    });

    it('Should render correct meta tags and title', () => {
      render(<HomePage pokemonList={mockPokemonList} />);

      const head = screen.getByTestId('mock-head');

      expect(head).toContainHTML(
        '<meta name="description" content="A simple Pokedex, Explore a list of Pokemons, search by name, and filter them by power threshold in this interactive Pokemon list app."'
      );

      expect(head).toContainHTML('<title>Pokemon List</title>');
      expect(head).toContainHTML('<link rel="icon" href="/favicon.ico"');
    });
  });

  describe('Test getServerSideProps', () => {
    beforeEach(() => {
      process.env.BASE_URL = 'http://localhost:3000';
    });

    it('Should fetch and return pokemon data successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonList),
      });

      const response = await getServerSideProps({} as Pokemon[]);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/pokemon'
      );
      expect(response).toEqual({
        props: {
          pokemonList: mockPokemonList,
        },
      });
    });

    it('Should handle fetch error and return notFound', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch')
      );

      const response = await getServerSideProps({} as Pokemon[]);

      expect(logger.error).toHaveBeenCalledWith(
        'Error while fetching Pokemon data'
      );
      expect(response).toEqual({ notFound: true });
    });

    it('Should handle json parsing error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const response = await getServerSideProps({} as any);

      expect(logger.error).toHaveBeenCalledWith(
        'Error while fetching Pokemon data'
      );
      expect(response).toEqual({ notFound: true });
    });

    it('Should use correct base URL from environment', async () => {
      process.env.BASE_URL = 'https://custom-domain.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockPokemonList),
      });

      await getServerSideProps({} as any);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://custom-domain.com/api/pokemon'
      );
    });
  });

  describe('Test Layout Integration', () => {
    it('Should have Layout assigned to getLayout', () => {
      expect(HomePage.getLayout).toBeDefined();
      expect(HomePage.getLayout).toBe(Layout);
    });
  });

  it('Should match snapshot', () => {
    const { container } = render(<HomePage pokemonList={mockPokemonList} />);
    expect(container).toMatchSnapshot();
  });
});
