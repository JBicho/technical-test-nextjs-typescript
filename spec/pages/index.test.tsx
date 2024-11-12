import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

import HomePage from '../../pages';

describe('HomePage Component', () => {
  const mockRouter = {
    push: jest.fn(),
    query: {},
    pathname: '/',
  };

  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const defaultPagination = {
    currentPage: 1,
    totalPages: 3,
    totalItems: 25,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPreviousPage: false,
  };

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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => mockRouter);
  });

  const setupComponent = async (initialPage = 1) => {
    let rendered;
    await act(async () => {
      rendered = render(
        <HomePage
          initialPokemonList={mockPokemonList}
          initialPagination={{
            ...defaultPagination,
            currentPage: initialPage,
          }}
        />
      );
    });
    return rendered!;
  };

  describe('Pagination', () => {
    it('preserves existing query parameters during pagination', async () => {
      const initialQuery = { name: 'Bulbasaur', powerThreshold: '50' };
      mockRouter.query = initialQuery;

      const mockResponse = {
        data: [mockPokemonList[0]],
        countData: { count: 1, min: 49, max: 49 },
        pagination: {
          ...defaultPagination,
          currentPage: 1,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await setupComponent(1);

      await act(async () => {
        const nextButton = screen.getByText('Next');

        fireEvent.click(nextButton);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockRouter.push).toHaveBeenCalledWith(
        {
          pathname: '/',
          query: {
            ...initialQuery,
            page: 2,
          },
        },
        undefined,
        { shallow: true }
      );
    });
  });
});
