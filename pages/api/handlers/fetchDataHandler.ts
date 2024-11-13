import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Pokemon } from '../../../common/interfaces/pokemon';
import { calculatePokemonPower } from '../../../common/utils/calculatePokemonPower';
import { logger } from '../../../common/utils/logger';
import { findMinPower } from '../../../common/utils/findMinValue';
import { findMaxPower } from '../../../common/utils/findMaxValue';
import { MAX_LIMIT } from '../../../common/constants';
import { PaginatedResponse } from '../../../common/interfaces/apiResponse';
import { readJsonFile } from '../../../common/utils/jsonFileReader';

export const dataFecthHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { page, limit, name: queryName, powerThreshold } = req.query;

    if (!page || !limit) {
      return res
        .status(400)
        .json({ message: "'page' and 'limit' are required." });
    }

    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);

    if (
      isNaN(parsedPage) ||
      parsedPage <= 0 ||
      isNaN(parsedLimit) ||
      parsedLimit <= 0
    ) {
      return res.status(400).json({
        message: "'page' and 'limit' must be valid positive integers.",
      });
    }

    const currentPage = parsedPage;
    const itemsPerPage = Math.min(parsedLimit, MAX_LIMIT);
    const dataPath =
      process.env.POKEMON_DATA_PATH || 'pages/api/data/pokemon.json';
    const jsonData = await readJsonFile(dataPath);
    const pokemonList = jsonData as Pokemon[];
    let filteredPokemons = pokemonList;

    if (queryName && typeof queryName === 'string') {
      const searchName = queryName.trim();
      filteredPokemons = filteredPokemons.filter(({ name }: Pokemon) =>
        name.toLowerCase().includes(queryName.toLowerCase())
      );
    }

    if (powerThreshold) {
      const threshold = parseInt(powerThreshold as string);
      filteredPokemons = filteredPokemons.filter(
        ({
          attack,
          defense,
          hp,
          special_attack,
          special_defense,
          speed,
        }: Pokemon) =>
          calculatePokemonPower({
            attack,
            defense,
            hp,
            special_attack,
            special_defense,
            speed,
          }) > threshold
      );
    }

    const totalItems = filteredPokemons.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (totalItems === 0) {
      return res.status(200).json({
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    }

    if (currentPage > totalPages) {
      return res.status(400).json({
        message: `Page ${currentPage} does not exist. Total pages: ${totalPages}`,
      });
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedItems = filteredPokemons.slice(startIndex, endIndex);
    const response: PaginatedResponse<Pokemon> = {
      data: paginatedItems,
      countData: {
        count: filteredPokemons.length,
        min: findMinPower(filteredPokemons),
        max: findMaxPower(filteredPokemons),
      },
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Failed to fetch Pokemon data', error);

    res.status(500).json({ message: 'Internal Server Error' });
  }
};
