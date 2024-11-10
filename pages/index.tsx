import Head from "next/head";
import { Pokemon } from "../common/interfaces/pokemon";
import { Layout } from "../components/LayoutComponent/Layout";
import { SearchInput } from "../components/SearchInput/SearchInput";
import { Counter } from "../components/Counter/Counter";
import { Card } from "../components/Card/Card";
import { Table } from "../components/Table/Table";
import { SearchCard } from "../components/SearchCard/SearchCard";

const HomePage = ({ pokemons }: { pokemons: Pokemon[] }) => {
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
      <Table pokemonList={[]}></Table>
    </>
  );
};

HomePage.getLayout = Layout;

export default HomePage;
