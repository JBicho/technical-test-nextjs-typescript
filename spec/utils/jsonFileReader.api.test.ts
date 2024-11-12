import fs from 'fs';
import path from 'path';
import { readJsonFile } from '../../common/utils/jsonFileReader';
import { logger } from '../../common/utils/logger';

jest.mock('fs');
jest.mock('../../common/utils/logger');

describe('readJsonFile', () => {
  const mockFilePath = 'pages/api/data/pokemon.json';
  const mockJsonData = '{"name": "Pikachu", "power": 50}';
  const mockParsedData = { name: 'Pikachu', power: 50 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should successfully read and parse a valid JSON file', async () => {
    fs.promises.readFile = jest.fn().mockResolvedValue(mockJsonData);

    const data = await readJsonFile<typeof mockParsedData>(mockFilePath);

    expect(fs.promises.readFile).toHaveBeenCalledWith(
      path.join(process.cwd(), mockFilePath),
      'utf-8'
    );
    expect(data).toEqual(mockParsedData);
  });

  it('Should throw an error if the file does not exist or cannot be read', async () => {
    const fileError = new Error('File not found');
    fs.promises.readFile = jest.fn().mockRejectedValue(fileError);

    await expect(readJsonFile(mockFilePath)).rejects.toThrowError(
      'Failed to read or parse the JSON file: File not found'
    );

    expect(logger.error).toHaveBeenCalledWith(
      'Error reading JSON file:',
      fileError
    );
  });

  it('Should throw an error if the JSON is malformed', async () => {
    const malformedJson = '{"name": "Pikachu", "power": }';
    fs.promises.readFile = jest.fn().mockResolvedValue(malformedJson);

    const syntaxError = new SyntaxError(
      'Unexpected token } in JSON at position 29'
    );

    const originalJSONParse = JSON.parse;
    JSON.parse = jest.fn().mockImplementation(() => {
      throw syntaxError;
    });

    try {
      await expect(
        readJsonFile<typeof mockParsedData>(mockFilePath)
      ).rejects.toThrow(syntaxError);

      const errorCall = (logger.error as jest.Mock).mock.calls[0];
      expect(errorCall[0]).toBe('Error reading JSON file:');
      expect(errorCall[1]).toBeInstanceOf(SyntaxError);
    } finally {
      JSON.parse = originalJSONParse;
    }
  });

  it('Should correctly handle an empty JSON file', async () => {
    const emptyJson = '{}';
    fs.promises.readFile = jest.fn().mockResolvedValue(emptyJson);

    const data = await readJsonFile<typeof mockParsedData>(mockFilePath);

    expect(data).toEqual({});
  });
});
