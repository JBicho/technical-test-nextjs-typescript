import Head from 'next/head';
import Image from 'next/image';
import { Pokemon } from '../../common/interfaces/pokemon';
import { Card } from '../../components/Card/Card';
import { Layout } from '../../components/LayoutComponent/Layout';
import { Meter } from '../../components/Meter/Meter';
import {
  DetailView,
  DetailViewNavigation,
  Details,
  ImageContainer,
  TypesList,
} from '../../components/Pokemon/Styles';
import {
  MAX_ID,
  MAX_METER_VALUE,
  NAVIGATE_NEXT,
  NAVIGATE_PREV,
} from '../../common/constants';
import { logger } from '../../common/utils/logger';
import { useRouter } from 'next/router';

const PokemonPage = (props: Pokemon) => {
  const router = useRouter();

  const { id } = router.query;

  const handleNavigation = (direction: 'next' | 'prev') => {
    let newId = Number(id as string);

    if (direction === 'next') {
      newId += 1;
    }

    if (direction === 'prev') {
      newId -= 1;
    }

    if (newId < 1) return;
    if (newId > MAX_ID) return;

    router.push(`/pokemon/${newId}`);
  };

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

            <Meter
              id="hp-meter"
              label="HP"
              value={props.hp}
              max={MAX_METER_VALUE}
            />
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
            <button
              disabled={Number(id) === 1}
              onClick={() => handleNavigation(NAVIGATE_PREV)}
            >
              Previous
            </button>
            <button
              disabled={Number(id) === MAX_ID}
              onClick={() => handleNavigation(NAVIGATE_NEXT)}
            >
              Next
            </button>
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
  params: { id: string };
}) {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/pokemon/${id}`);

    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    const pokemon: Pokemon = await res.json();

    return { props: pokemon };
  } catch (error) {
    logger.error('Error while fetching Pokemon data');

    return {
      notFound: true,
    };
  }
}
export default PokemonPage;
