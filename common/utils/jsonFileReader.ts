import path from 'path';
import fs from 'fs';
import { logger } from './logger';

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  try {
    const jsonFilePath = path.join(process.cwd(), filePath);
    const jsonData = await fs.promises.readFile(jsonFilePath, 'utf-8');

    return JSON.parse(jsonData);
  } catch (error) {
    logger.error('Error reading JSON file:', error);

    throw new Error('Failed to read or parse the JSON file.');
  }
};
