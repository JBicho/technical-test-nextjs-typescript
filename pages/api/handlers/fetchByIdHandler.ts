import { NextApiRequest, NextApiResponse } from 'next';
import { Pokemon } from '../../../common/interfaces/pokemon';
import { readJsonFile } from '../../../common/utils/jsonFileReader';
import { logger } from '../../../common/utils/logger';
import path from 'path';

const fetchPokemonById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const dataPath =
      process.env.POKEMON_DATA_PATH || 'pages/api/data/pokemon.json';
    const jsonData = await readJsonFile(dataPath);
    const pokemonList = jsonData as Pokemon[];
    const { id: queryId } = req.query;
    const pokemon = pokemonList.find(
      ({ id }: Pokemon) => id === Number(queryId as string)
    );

    if (!pokemon) {
      const message = 'Pokemon not found';

      logger.error(message);

      return res.status(404).json({ message });
    }

    res.status(200).json(pokemon);
  } catch (error) {
    logger.error('Failed to fetch the single Pokemon data');

    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default fetchPokemonById;
