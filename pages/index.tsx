import Head from 'next/head';
import { Pokemon } from '../common/interfaces/pokemon';
import { Layout } from '../components/LayoutComponent/Layout';
import { SearchCard } from '../components/SearchCard/SearchCard';
import { Table } from '../components/Table/Table';
import { logger } from '../common/utils/logger';

const HomePage = ({ pokemonList }: { pokemonList: Pokemon[] }) => {
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
      <SearchCard />
      <Table pokemonList={pokemonList}></Table>
    </>
  );
};

export const getServerSideProps = async (p0: Pokemon[]) => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/pokemon`);
    const data = await res.json();

    return { props: { pokemonList: data as Pokemon[] } };
  } catch (error) {
    logger.error('Error while fetching Pokemon data');

    return { notFound: true };
  }
};

HomePage.getLayout = Layout;

export default HomePage;
