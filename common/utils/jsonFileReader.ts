import path from 'path';
import fs from 'fs';
import { logger } from './logger';

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    const jsonData = await fs.promises.readFile(absolutePath, 'utf-8');
    try {
      return JSON.parse(jsonData);
    } catch (parseErr) {
      const syntaxError =
        parseErr instanceof SyntaxError
          ? parseErr
          : new SyntaxError(String(parseErr));

      logger.error('Error reading JSON file:', syntaxError);
      throw syntaxError;
    }
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));

    logger.error('Error reading JSON file:', error);

    if (error instanceof SyntaxError) {
      throw error;
    }

    throw new Error(`Failed to read or parse the JSON file: ${error.message}`);
  }
};
