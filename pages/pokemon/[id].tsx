import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  MAX_ID,
  MAX_METER_VALUE,
  NAVIGATE_NEXT,
  NAVIGATE_PREV,
} from '../../common/constants';
import { Pokemon } from '../../common/interfaces/pokemon';
import { logger } from '../../common/utils/logger';
import { Card } from '../../components/Card/Card';
import { Layout } from '../../components/LayoutComponent/Layout';
import { Meter } from '../../components/Meter/Meter';
import {
  DetailView,
  DetailViewNavigation,
  Details,
  ImageContainer,
  NameAndImage,
  NavAndDetails,
  TypesList,
} from '../../components/Pokemon/Styles';
import { useEffect } from 'react';
import Link from 'next/link';

const shimmer = (w: number, h: number): string => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#eee" offset="20%" />
      <stop stop-color="#f5f5f5" offset="50%" />
      <stop stop-color="#eee" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#eee" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
</svg>`;

const toBase64 = (str: string): string =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  return process.env.BASE_URL || 'http://localhost:3000';
};

interface PokemonPageProps extends Pokemon {
  error?: string;
}

const PokemonPage = (props: PokemonPageProps) => {
  const router = useRouter();
  const { id } = router.query;

  if (props.error) {
    return (
      <Card>
        <DetailView>
          <h1>Error</h1>
          <p>{props.error}</p>
        </DetailView>
      </Card>
    );
  }

  const handleNavigation = async (direction: 'next' | 'prev') => {
    try {
      let newId = Number(id as string);

      if (direction === 'next') {
        newId += 1;
      }

      if (direction === 'prev') {
        newId -= 1;
      }

      if (newId < 1 || newId > MAX_ID) {
        return;
      }

      await router.push(`/pokemon/${newId}`);
    } catch (error) {
      logger.error('Navigation error:', error);
    }
  };

  return (
    <>
      <Head>
        <title>{props.name} - Pokemon Details</title>
        <meta
          name="description"
          content={`Details for ${props.name}, a ${props.type.join('/')} type Pokemon`}
        />
      </Head>
      <Card>
        <DetailView>
          <NameAndImage>
            <h1>{props.name}</h1>

            <ImageContainer>
              <Image
                src={`/images/${props.name.toLowerCase()}.jpg`}
                alt={`${props.name} Pokemon`}
                width={250}
                height={250}
                quality={85}
                priority
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(250, 250))}`}
              />
            </ImageContainer>
            <h2>Type</h2>
            <TypesList>
              {props.type.map((type) => (
                <li key={type}>
                  <strong>{type}</strong>
                </li>
              ))}
            </TypesList>
          </NameAndImage>

          <NavAndDetails>
            <Details>
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
              <Link
                href={`/pokemon/${Number(id) - 1}`}
                prefetch={true}
                aria-label="View previous Pokemon"
              >
                <button
                  disabled={Number(id) === 1}
                  aria-label="View previous Pokemon"
                >
                  Previous
                </button>
              </Link>
              <Link
                href={`/pokemon/${Number(id) + 1}`}
                prefetch={true}
                aria-label="View next Pokemon"
              >
                <button
                  disabled={Number(id) === MAX_ID}
                  aria-label="View next Pokemon"
                >
                  Next
                </button>
              </Link>
            </DetailViewNavigation>
          </NavAndDetails>
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
    if (!id || isNaN(Number(id)) || Number(id) < 1 || Number(id) > MAX_ID) {
      return {
        props: {
          error: 'Invalid Pokemon ID',
        },
      };
    }

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/pokemon/${id}`);

    if (!res.ok) {
      logger.error('Failed to fetch Pokemon data:', {
        statusCode: res.status,
        statusText: res.statusText,
        id,
      });

      return {
        props: {
          error: 'Pokemon not found',
        },
      };
    }

    const pokemon: Pokemon = await res.json();

    if (!pokemon) {
      return {
        props: {
          error: 'Pokemon data is invalid',
        },
      };
    }

    return {
      props: {
        ...pokemon,
      },
    };
  } catch (error) {
    logger.error('Error while fetching Pokemon data:', {
      error,
      id,
      url: process.env.BASE_URL,
    });

    return {
      props: {
        error: 'Failed to load Pokemon data',
      },
    };
  }
}

export default PokemonPage;
