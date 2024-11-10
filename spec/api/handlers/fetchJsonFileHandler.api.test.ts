import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import path from 'path';
import { logger } from '../../../common/utils/logger';
import { fetchJsonFileHandler } from '../../../pages/api/handlers/fetchJsonFileHandler';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

jest.mock('../../../common/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('fetchJsonFileHandler', () => {
  // Type the mocked functions for better IDE support
  const mockedReadFile = fs.promises.readFile as jest.MockedFunction<
    typeof fs.promises.readFile
  >;
  const mockedJoin = path.join as jest.MockedFunction<typeof path.join>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedJoin.mockReturnValue('/mock/path/to/pokemon.json');
  });

  it('should successfully fetch and return JSON data', async () => {
    const mockData = {
      pokemon: [
        { id: 1, name: 'Bulbasaur' },
        { id: 2, name: 'Ivysaur' },
      ],
    };

    mockedReadFile.mockResolvedValue(JSON.stringify(mockData));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await fetchJsonFileHandler(req, res);

    expect(mockedJoin).toHaveBeenCalledWith(
      process.cwd(),
      'pages',
      'api',
      'data',
      'pokemon.json'
    );
    expect(mockedReadFile).toHaveBeenCalledWith(
      '/mock/path/to/pokemon.json',
      'utf-8'
    );
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockData);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should handle file read errors properly', async () => {
    mockedReadFile.mockRejectedValue(new Error('File not found'));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await fetchJsonFileHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Failed to fetch the JSON file',
    });
    expect(logger.error).toHaveBeenCalledWith('Failed to fetch the JSON file');
  });

  it('should handle JSON parsing errors', async () => {
    mockedReadFile.mockResolvedValue('invalid json content');

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await fetchJsonFileHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Failed to fetch the JSON file',
    });
    expect(logger.error).toHaveBeenCalledWith('Failed to fetch the JSON file');
  });

  it('should use correct file path construction', async () => {
    const mockData = { pokemon: [] };
    mockedReadFile.mockResolvedValue(JSON.stringify(mockData));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await fetchJsonFileHandler(req, res);

    expect(mockedJoin).toHaveBeenCalledWith(
      process.cwd(),
      'pages',
      'api',
      'data',
      'pokemon.json'
    );
    expect(mockedJoin).toHaveBeenCalledTimes(1);
  });

  it('should handle empty JSON file', async () => {
    mockedReadFile.mockResolvedValue('{}');

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await fetchJsonFileHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({});
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should handle large JSON files', async () => {
    const largeMockData = {
      pokemon: Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Pokemon ${i + 1}`,
      })),
    };

    mockedReadFile.mockResolvedValue(JSON.stringify(largeMockData));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await fetchJsonFileHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(largeMockData);
    expect(logger.error).not.toHaveBeenCalled();
  });
});
