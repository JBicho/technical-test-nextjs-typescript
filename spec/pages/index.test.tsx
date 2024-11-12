import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Pokemon } from '../../common/interfaces/pokemon';
import { logger } from '../../common/utils/logger';
import { Layout } from '../../components/LayoutComponent/Layout';
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
  SearchCard: jest.fn(({ onSearch }) => (
    <div data-testid="mock-search-card">
      <button onClick={() => onSearch('Bulbasaur', '50')}>Search</button>
    </div>
  )),
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

describe('Test HomePage Component', () => {
  const mockPokemonList: Pokemon[] = [
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

  const setupComponent = () =>
    render(<HomePage pokemonList={mockPokemonList} />);

  describe('Component Rendering', () => {
    it('Renders the HomePage with all components', () => {
      setupComponent();

      expect(screen.getByText('Pokemon list')).toBeInTheDocument();
      expect(screen.getByTestId('mock-search-card')).toBeInTheDocument();
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    });

    it('Renders with an empty pokemon list', () => {
      setupComponent();

      expect(screen.getByText('Pokemon list')).toBeInTheDocument();
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    });

    it('Renders correct meta tags and title', () => {
      setupComponent();

      const head = screen.getByTestId('mock-head');

      expect(head).toContainHTML(
        '<meta name="description" content="A simple Pokedex, Explore a list of Pokemons, search by name, and filter them by power threshold in this interactive Pokemon list app."'
      );
      expect(head).toContainHTML('<title>Pokemon List</title>');
      expect(head).toContainHTML('<link rel="icon" href="/favicon.ico"');
    });
  });

  describe('Search Functionality', () => {
    it('Displays error message when search fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      setupComponent();

      await act(async () => {
        fireEvent.click(screen.getByText('Search'));
      });

      const errorMessage = await screen.findByText('Pokemon not found');
      expect(errorMessage).toBeInTheDocument();
    });

    it('Displays search results on successful search', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          pokemonList: [mockPokemonList[0]],
          count: 1,
          min: 49,
          max: 49,
        }),
      });

      setupComponent();

      await act(async () => {
        fireEvent.click(screen.getByText('Search'));
      });

      expect(await screen.findByTestId('mock-table')).toBeInTheDocument();
    });

    it('Resets search results if no search criteria are provided', async () => {
      setupComponent();

      await act(async () => {
        fireEvent.click(screen.getByText('Search'));
      });

      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/pokemon/search?name=Bulbasaur&powerThreshold=50`
      );
    });
  });

  describe('Test getServerSideProps Function', () => {
    beforeEach(() => {
      process.env.BASE_URL = 'http://localhost:3000';
    });

    it('Fetches and returns pokemon data successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonList,
      });

      const response = await getServerSideProps();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/pokemon'
      );
      expect(response).toEqual({
        props: { pokemonList: mockPokemonList },
      });
    });

    it('Handles fetch error and returns notFound', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Fetch failed')
      );

      const response = await getServerSideProps();

      expect(logger.error).toHaveBeenCalledWith(
        'Error while fetching Pokemon data'
      );
      expect(response).toEqual({ notFound: true });
    });

    it('Handles JSON parsing error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('JSON parse error');
        },
      });

      const response = await getServerSideProps();

      expect(logger.error).toHaveBeenCalledWith(
        'Error while fetching Pokemon data'
      );
      expect(response).toEqual({ notFound: true });
    });

    it('Uses the correct base URL from environment', async () => {
      process.env.BASE_URL = 'https://custom-domain.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonList,
      });

      await getServerSideProps();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://custom-domain.com/api/pokemon'
      );
    });
  });

  describe('Layout Integration', () => {
    it('should have Layout assigned to getLayout', () => {
      expect(HomePage.getLayout).toBe(Layout);
    });
  });

  it('Should match snapshot', () => {
    const { container } = render(<HomePage pokemonList={mockPokemonList} />);
    expect(container).toMatchSnapshot();
  });
});
