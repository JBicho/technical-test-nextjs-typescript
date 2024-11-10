import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { logger } from '../../../common/utils/logger';

export const fetchJsonFileHandler = async (
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

    res.status(200).json(JSON.parse(jsonData));
  } catch (error) {
    const message = 'Failed to fetch the JSON file';

    logger.error(message);

    res.status(500).json({ message });
  }
};
