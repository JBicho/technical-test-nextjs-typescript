import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { logger } from '../../../common/utils/logger';
import { Pokemon } from '../../../common/interfaces/pokemon';

const fetchPokemonById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const jsonFilePath = path.join(
      process.cwd(),
      'pages',
      'api',
      'data',
      'pokemon.json'
    );
    const jsonData = await fs.promises.readFile(jsonFilePath, 'utf-8');
    const pokemonList = JSON.parse(jsonData);

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
