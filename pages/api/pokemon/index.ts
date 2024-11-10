import { NextApiRequest, NextApiResponse } from 'next';
import { fetchJsonFileHandler } from '../handlers/fetchJsonFileHandler';
import { errorMiddleware } from '../middleware/errorMiddleware';

export const handler = errorMiddleware(fetchJsonFileHandler);

const getPokemonData = async (req: NextApiRequest, res: NextApiResponse) => {
  return handler(req, res);
};

export default getPokemonData;
