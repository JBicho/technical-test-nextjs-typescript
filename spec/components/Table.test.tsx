import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useRouter } from 'next/router';
import { Pokemon } from '../../common/interfaces/pokemon';
import { Table } from '../../components/Table/Table';
import '../setupTests';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Test Table Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      isFallback: false,
      push: jest.fn(),
    });
  });

  it('Should match snapshot with empty list', () => {
    const paginationData = {
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
    };

    const { asFragment } = render(
      <Table
        pokemonList={[]}
        paginationData={paginationData}
        handlePagination={() => {}}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Should match snapshot with non empty list', () => {
    const handlePagination = jest.fn();

    const paginationData = {
      currentPage: 1,
      hasNextPage: true,
      hasPreviousPage: false,
      itemsPerPage: 10,
      totalItems: 20,
      totalPages: 2,
    };

    const pokemonList = [
      {
        id: 1,
        name: 'Pikachu',
        type: ['Electric'],
        hp: 35,
        attack: 55,
        defense: 40,
        special_attack: 50,
        special_defense: 50,
        speed: 90,
      },
    ];

    const { asFragment } = render(
      <Table
        pokemonList={pokemonList}
        paginationData={paginationData}
        handlePagination={handlePagination}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Should handle row click and navigate', async () => {
    const mockPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      isFallback: false,
    });

    const pokemonList = [
      {
        id: 1,
        name: 'Pikachu',
        type: ['Electric'],
        hp: 35,
        speed: 90,
        attack: 55,
        special_attack: 50,
        defense: 40,
        special_defense: 50,
      },
    ];

    const paginationData = {
      currentPage: 1,
      hasNextPage: true,
      hasPreviousPage: false,
      itemsPerPage: 10,
      totalItems: 1,
      totalPages: 1,
    };

    const handlePagination = jest.fn();

    render(
      <Table
        pokemonList={pokemonList}
        paginationData={paginationData}
        handlePagination={handlePagination}
      />
    );

    const row = screen.getByText('Pikachu').closest('tr');

    if (row) {
      await act(async () => {
        fireEvent.click(row);
      });
    } else {
      throw new Error('Row not found');
    }

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/pokemon/1');
    });
  });

  it('Should handle page change and trigger pagination', async () => {
    const handlePagination = jest.fn();

    const paginationData = {
      currentPage: 1,
      hasNextPage: true,
      hasPreviousPage: false,
      itemsPerPage: 10,
      totalItems: 20,
      totalPages: 2,
    };

    const pokemonList = [
      {
        id: 1,
        name: 'Pikachu',
        type: ['Electric'],
        hp: 35,
        attack: 55,
        defense: 40,
        special_attack: 50,
        special_defense: 50,
        speed: 90,
      },
    ];

    render(
      <Table
        pokemonList={pokemonList}
        paginationData={paginationData}
        handlePagination={handlePagination}
      />
    );

    const nextPageButton = screen.getByText('Next');

    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(handlePagination).toHaveBeenCalledWith(2);
    });
  });

  it('Should display "No pokemon found" when the pokemon list is empty', () => {
    const pokemonList: Pokemon[] = [];
    const paginationData = {
      currentPage: 1,
      hasNextPage: true,
      hasPreviousPage: false,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
    };
    const handlePagination = jest.fn();

    render(
      <Table
        pokemonList={pokemonList}
        paginationData={paginationData}
        handlePagination={handlePagination}
      />
    );

    expect(screen.getByText('No pokemon found')).toBeInTheDocument();
  });

  it('Should display loading state when router is in fallback mode', () => {
    (useRouter as jest.Mock).mockReturnValue({
      isFallback: true,
      push: jest.fn(),
    });

    const pokemonList: Pokemon[] = [];
    const paginationData = {
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
    };

    const handlePagination = jest.fn();

    render(
      <Table
        pokemonList={pokemonList}
        paginationData={paginationData}
        handlePagination={handlePagination}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
