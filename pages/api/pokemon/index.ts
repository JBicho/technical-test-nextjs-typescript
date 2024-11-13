import { NextApiRequest, NextApiResponse } from 'next';
import { dataFecthHandler } from '../handlers/fetchDataHandler';
import { errorMiddleware } from '../middleware/errorMiddleware';

const getPokemonData = async (req: NextApiRequest, res: NextApiResponse) =>
  errorMiddleware(['GET'], dataFecthHandler)(req, res);

export default getPokemonData;
