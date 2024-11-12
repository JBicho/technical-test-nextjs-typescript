import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Pokemon } from '../common/interfaces/pokemon';
import { Layout } from '../components/LayoutComponent/Layout';
import { SearchCard } from '../components/SearchCard/SearchCard';
import { Table } from '../components/Table/Table';
import { Pagination } from '../common/interfaces/pagination';
import { logger } from '../common/utils/logger';
import { PaginatedResponse } from '../common/interfaces/apiResponse';

const HomePage = ({
  initialPokemonList,
  initialPagination,
}: {
  initialPokemonList: Pokemon[];
  initialPagination: Pagination;
}) => {
  const router = useRouter();
  const [state, setState] = useState({
    filteredPokemonList: initialPokemonList,
    count: 0,
    minPower: 0,
    maxPower: 0,
    errorMessage: null as string | null,
    searchPerformed: false,
  });
  const [pagination, setPagination] = useState(initialPagination);

  const handleSearch = async (
    name: string,
    powerThreshold: string,
    page = 1,
    limit = 10
  ) => {
    try {
      const response = await fetch(
        `/api/pokemon?page=${page}&limit=${limit}&name=${name}&powerThreshold=${powerThreshold}`
      );

      if (!response.ok) throw new Error('Pokemon not found');

      const {
        data,
        countData: { count, max, min },
        pagination,
      }: PaginatedResponse<Pokemon> = await response.json();

      setState({
        filteredPokemonList: data,
        count: count,
        minPower: min,
        maxPower: max,
        errorMessage: null,
        searchPerformed: !!name || !!powerThreshold,
      });
      setPagination(pagination);
    } catch (error) {
      setState({
        filteredPokemonList: [],
        count: 0,
        minPower: 0,
        maxPower: 0,
        errorMessage:
          error instanceof Error ? error.message : 'An error occurred',
        searchPerformed: true,
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    if (newPage === pagination.currentPage) return;

    setPagination((prevPagination: Pagination) => ({
      ...prevPagination,
      hasPreviousPage: newPage !== 1,
      currentPage: newPage,
    }));

    router.push(
      {
        pathname: '/',
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: true }
    );

    const name = (router.query.name as string) || '';
    const powerThreshold = (router.query.powerThreshold as string) || '';

    handleSearch(name, powerThreshold, newPage, pagination.itemsPerPage);
  };

  const handleFilterChange = (name: string, powerThreshold: string) => {
    router.push(
      {
        pathname: '/',
        query: { ...router.query, name, powerThreshold, page: 1 },
      },
      undefined,
      { shallow: true }
    );

    handleSearch(name, powerThreshold, 1, pagination.itemsPerPage);
  };

  useEffect(() => {
    const {
      name = '',
      powerThreshold = '',
      page = 1,
      limit = 10,
    } = router.query;

    handleSearch(
      name as string,
      powerThreshold as string,
      Number(page),
      Number(limit)
    );
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Pokemon List</title>
        <meta
          name="description"
          content="A simple Pokedex, Explore a list of Pokemons, search by name, and filter them by power threshold in this interactive Pokemon list app."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Pokemon list</h1>
      <SearchCard
        displayCount={
          state.searchPerformed && state.filteredPokemonList.length > 0
        }
        countObject={{
          count: state.count,
          min: state.minPower,
          max: state.maxPower,
        }}
        onSearch={handleFilterChange}
      />
      <Table
        pokemonList={
          state.filteredPokemonList.length
            ? state.filteredPokemonList
            : initialPokemonList
        }
        paginationData={pagination}
        handlePagination={handlePageChange}
      />

      {state.errorMessage && <p>{state.errorMessage}</p>}
    </>
  );
};

export const getServerSideProps = async ({ query }: { query: any }) => {
  try {
    const { name = '', powerThreshold = '', page = 1, limit = 10 } = query;

    const res = await fetch(
      `${process.env.BASE_URL}/api/pokemon?page=${page}&limit=${limit}&name=${name}&powerThreshold=${powerThreshold}`
    );

    if (!res.ok) {
      return {
        props: {
          initialPokemonList: [],
          initialPagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      };
    }

    const data = await res.json();

    const initialPokemonList = Array.isArray(data.data) ? data.data : [];
    const initialPagination = data.pagination || {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return {
      props: {
        initialPokemonList,
        initialPagination,
      },
    };
  } catch (error) {
    logger.error('Error fetching data:', error);

    return {
      props: {
        initialPokemonList: [],
        initialPagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    };
  }
};

HomePage.getLayout = Layout;

export default HomePage;
