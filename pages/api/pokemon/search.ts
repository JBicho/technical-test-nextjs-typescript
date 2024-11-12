import { NextApiRequest, NextApiResponse } from 'next';
import { errorMiddleware } from '../middleware/errorMiddleware';
import searchPokemonHandler from '../handlers/searchHandler';

const searchPokemon = async (req: NextApiRequest, res: NextApiResponse) =>
  errorMiddleware(['GET'], searchPokemonHandler)(req, res);

export default searchPokemon;
