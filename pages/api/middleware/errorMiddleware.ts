import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { logger } from '../../../common/utils/logger';

export const errorMiddleware =
  (...handlers: Function[]) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      for (const handler of handlers) {
        await handler(req, res);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      } else {
        logger.error('Unexpected problem occurred');

        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };
