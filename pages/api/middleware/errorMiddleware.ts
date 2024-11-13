import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../../../common/utils/logger';
import { ApiError } from 'next/dist/server/api-utils';

const methodCheckMiddleware = (allowedMethods: string[]) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    if (!allowedMethods.includes(req.method as string)) {
      res.status(405).json({ message: 'Method Not Allowed' });
      return true;
    }
    return false;
  };
};

const errorMiddleware =
  (allowedMethods: string[], ...handlers: Function[]) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const methodNotAllowed = methodCheckMiddleware(allowedMethods)(req, res);

    if (methodNotAllowed) {
      return;
    }

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

export { errorMiddleware, methodCheckMiddleware };
