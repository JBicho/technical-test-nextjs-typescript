import { useRouter } from 'next/router';
import { useState } from 'react';
import { Pagination } from '../../common/interfaces/pagination';
import { Pokemon } from '../../common/interfaces/pokemon';
import { calculatePokemonPower } from '../../common/utils/calculatePokemonPower';
import {
  EmptyListTd,
  StyledTable,
  TableBody,
  TableFooter,
  TableHeader,
} from './Styles';

export interface TableProps {
  pokemonList: Pokemon[];
  paginationData: Pagination;
  handlePagination: (page: number) => void;
}

export const Table = ({
  pokemonList = [],
  handlePagination,
  paginationData: {
    currentPage,
    hasNextPage,
    hasPreviousPage,
    itemsPerPage,
    totalItems,
    totalPages,
  },
}: TableProps) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleRowClick = async (id: number) => {
    if (isNavigating) return;

    try {
      setIsNavigating(true);
      await router.push(`/pokemon/${id}`);
    } catch (err: unknown) {
      const error = err as Error;

      if (error?.message !== 'Loading initial props cancelled') {
        console.error('Navigation error:', error);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (isNavigating) return;

    try {
      setIsNavigating(true);

      await handlePagination(page);
    } catch (err: unknown) {
      const error = err as Error;

      if (error?.message !== 'Loading initial props cancelled') {
        console.error('Pagination error:', error);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <StyledTable>
      <TableHeader>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Type</th>
          <th colSpan={6}>Stats</th>
          <th>Power</th>
        </tr>
      </TableHeader>
      <TableBody>
        {!pokemonList.length && (
          <tr>
            <EmptyListTd colSpan={10}>No pokemon found</EmptyListTd>
          </tr>
        )}
        {pokemonList.map(
          (
            {
              id,
              name,
              type,
              hp,
              speed,
              attack,
              special_attack,
              defense,
              special_defense,
            },
            index
          ) => (
            <tr
              key={`${name}${index}`}
              onClick={() => handleRowClick(id)}
              style={{ cursor: isNavigating ? 'wait' : 'pointer' }}
            >
              <td>{id}</td>
              <td>{name}</td>
              <td>{type.join(', ')}</td>
              <td>{hp}</td>
              <td>{speed}</td>
              <td>{attack}</td>
              <td>{special_attack}</td>
              <td>{defense}</td>
              <td>{special_defense}</td>
              <td>
                {calculatePokemonPower({
                  attack,
                  defense,
                  hp,
                  special_attack,
                  special_defense,
                  speed,
                })}
              </td>
            </tr>
          )
        )}
      </TableBody>
      <TableFooter>
        <tr>
          <td colSpan={10}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage || currentPage === 1 || isNavigating}
            >
              <strong>Prev</strong>
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                !hasNextPage || currentPage === totalPages || isNavigating
              }
            >
              <strong>Next</strong>
            </button>
          </td>
        </tr>
      </TableFooter>
    </StyledTable>
  );
};
