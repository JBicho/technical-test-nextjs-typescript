import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { Pokemon } from '../../../common/interfaces/pokemon';
import { calculatePokemonPower } from '../../../common/utils/calculatePokemonPower';
import { logger } from '../../../common/utils/logger';
import { SearchResponse } from '../../../common/interfaces/apiResponse';
import { findMinPower } from '../../../common/utils/findMinValue';
import { findMaxPower } from '../../../common/utils/findMaxValue';

const searchPokemonHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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

    const { name: queryName, powerThreshold } = req.query;

    const response: SearchResponse = {
      pokemonList: [],
      count: 0,
      min: 0,
      max: 0,
    };

    const pokemons = pokemonList.filter(
      ({
        name,
        attack,
        defense,
        hp,
        special_attack,
        special_defense,
        speed,
      }: Pokemon) => {
        const isNameMatch =
          queryName && typeof queryName === 'string'
            ? name.toLowerCase().includes(queryName.toLowerCase())
            : true;

        const isPowerThresholdMatch =
          powerThreshold && !isNaN(Number(powerThreshold))
            ? calculatePokemonPower({
                attack,
                defense,
                hp,
                special_attack,
                special_defense,
                speed,
              }) > Number(powerThreshold)
            : true;

        return isNameMatch && isPowerThresholdMatch;
      }
    );

    if (!pokemons.length) {
      const message = 'Pokemon not found';

      logger.error(message);
      return res.status(404).json({ message });
    }

    response.pokemonList = pokemons;
    response.count = pokemons.length;
    response.min = findMinPower(pokemons);
    response.max = findMaxPower(pokemons);

    res.status(200).json(response);
  } catch (error) {
    logger.error('Failed to fetch the single Pokemon data');
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default searchPokemonHandler;
