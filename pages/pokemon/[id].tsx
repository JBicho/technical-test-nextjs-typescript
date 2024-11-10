import Head from "next/head";
import Image from "next/image";
import { Pokemon } from "../../common/interfaces/pokemon";
import { Card } from "../../components/Card/Card";
import { Layout } from "../../components/LayoutComponent/Layout";
import { Meter } from "../../components/Meter/Meter";
import {
  DetailView,
  DetailViewNavigation,
  Details,
  ImageContainer,
  TypesList,
} from "./Styles";
import { MAX_METER_VALUE } from "../../common/constants";

const PokemonPage = (props: Pokemon) => {
  return (
    <>
      <Head>
        <title>{props.name}</title>
      </Head>
      <Card>
        <DetailView>
          <h1>{props.name}</h1>

          <ImageContainer>
            <Image
              src={`/images/${props.name.toLowerCase()}.jpg`}
              alt={`${props.name} image`}
              width={250}
              height={250}
            />
          </ImageContainer>

          <Details>
            <h2>Type</h2>
            <TypesList>
              {props.type.map((type) => (
                <li key={type}>
                  <strong>{type}</strong>
                </li>
              ))}
            </TypesList>

            <Meter id="hp-meter" label="HP" value={props.hp} max={MAX_METER_VALUE} />
            <Meter
              id="attack-meter"
              label="Attack"
              value={props.attack}
              max={MAX_METER_VALUE}
            />
            <Meter
              id="defense-meter"
              label="Defense"
              value={props.defense}
              max={MAX_METER_VALUE}
            />
            <Meter
              id="special_attack-meter"
              label="Special Attack"
              value={props.special_attack}
              max={MAX_METER_VALUE}
            />
            <Meter
              id="special_defense-meter"
              label="Special Defense"
              value={props.special_defense}
              max={MAX_METER_VALUE}
            />
            <Meter
              id="speed-meter"
              label="Speed"
              value={props.speed}
              max={MAX_METER_VALUE}
            />
          </Details>

          <DetailViewNavigation>
            <button>Previous</button>
            <button>Next</button>
          </DetailViewNavigation>
        </DetailView>
      </Card>
    </>
  );
};

PokemonPage.getLayout = Layout;

export async function getServerSideProps({
  params: { id },
}: {
  params: { id: number };
}) {
  try {
    // Implement new endpoint in /api/pokemon/[id].ts and use it here
    const pokemonExample: Pokemon = {
      id: id,
      name: "Bulbasaur",
      type: ["Grass", "Poison"],
      hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
    };
    return { props: pokemonExample };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default PokemonPage;
