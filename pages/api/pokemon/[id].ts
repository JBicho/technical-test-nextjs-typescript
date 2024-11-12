import { NextApiRequest, NextApiResponse } from 'next';
import fetchPokemonById from '../handlers/fetchByIdHandler';
import { errorMiddleware } from '../middleware/errorMiddleware';

const getPokemonById = async (req: NextApiRequest, res: NextApiResponse) => {
  return errorMiddleware(['GET'], fetchPokemonById)(req, res);
};

export default getPokemonById;
