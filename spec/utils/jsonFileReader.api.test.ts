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
    fs.promises.readFile = jest
      .fn()
      .mockRejectedValue(new Error('File not found'));

    await expect(readJsonFile(mockFilePath)).rejects.toThrowError(
      'Failed to read or parse the JSON file.'
    );

    expect(logger.error).toHaveBeenCalledWith(
      'Error reading JSON file:',
      expect.any(Error)
    );
  });

  it('Should throw an error if the JSON is malformed', async () => {
    const malformedJson = '{"name": "Pikachu", "power": }';
    fs.promises.readFile = jest.fn().mockResolvedValue(malformedJson);

    await expect(
      readJsonFile<typeof mockParsedData>(mockFilePath)
    ).rejects.toThrowError('Failed to read or parse the JSON file.');

    expect(logger.error).toHaveBeenCalledWith(
      'Error reading JSON file:',
      expect.any(SyntaxError)
    );
  });

  it('Should correctly handle an empty JSON file', async () => {
    const emptyJson = '{}';
    fs.promises.readFile = jest.fn().mockResolvedValue(emptyJson);

    const data = await readJsonFile<typeof mockParsedData>(mockFilePath);

    expect(data).toEqual({});
  });
});
