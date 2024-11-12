import { NextApiRequest, NextApiResponse } from 'next';
import { fetchJsonFileHandler } from '../handlers/fetchJsonFileHandler';
import { errorMiddleware } from '../middleware/errorMiddleware';

const getPokemonData = async (req: NextApiRequest, res: NextApiResponse) =>
  errorMiddleware(['GET'], fetchJsonFileHandler)(req, res);

export default getPokemonData;
