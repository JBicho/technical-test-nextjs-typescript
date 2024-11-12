import { useState } from 'react';
import Head from 'next/head';
import { Pokemon } from '../common/interfaces/pokemon';
import { Layout } from '../components/LayoutComponent/Layout';
import { SearchCard } from '../components/SearchCard/SearchCard';
import { Table } from '../components/Table/Table';
import { logger } from '../common/utils/logger';

interface SearchResponse {
  pokemonList: Pokemon[];
  count: number;
  min: number;
  max: number;
}

const HomePage = ({ pokemonList }: { pokemonList: Pokemon[] }) => {
  const [state, setState] = useState({
    filteredPokemonList: [] as Pokemon[], // Start empty to indicate no filtering yet
    count: 0,
    minPower: 0,
    maxPower: 0,
    errorMessage: null as string | null,
    searchPerformed: false, // New flag to track if a search was performed
  });

  const handleSearch = async (name: string, powerThreshold: string) => {
    try {
      if (!name && !powerThreshold) {
        // Reset state if no search criteria
        setState({
          filteredPokemonList: [],
          count: 0,
          minPower: 0,
          maxPower: 0,
          errorMessage: null,
          searchPerformed: false, // Reset the search flag
        });
        return;
      }

      const response = await fetch(
        `/api/pokemon/search?name=${name}&powerThreshold=${powerThreshold}`
      );

      if (!response.ok) throw new Error('Pokemon not found');

      const data: SearchResponse = await response.json();

      setState({
        filteredPokemonList: data.pokemonList,
        count: data.count,
        minPower: data.min,
        maxPower: data.max,
        errorMessage: null,
        searchPerformed: true, // Set search flag to true
      });
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
        onSearch={handleSearch}
      />
      {state.errorMessage && (
        <p style={{ color: 'red' }}>{state.errorMessage}</p>
      )}
      <Table
        pokemonList={
          state.searchPerformed ? state.filteredPokemonList : pokemonList
        }
      />
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/pokemon`);
    if (!res.ok) {
      return { notFound: true };
    }
    const pokemonList: Pokemon[] = await res.json();
    return { props: { pokemonList } };
  } catch (error) {
    logger.error('Error while fetching Pokemon data');
    return { notFound: true };
  }
};

HomePage.getLayout = Layout;

export default HomePage;
