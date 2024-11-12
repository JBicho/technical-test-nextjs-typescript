import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import fs from 'fs';
import path from 'path';
import { logger } from '../../../common/utils/logger';
import fetchPokemonById from '../../../pages/api/handlers/fetchByIdHandler';

interface MockNextApiResponse extends NextApiResponse {
  _getStatusCode(): number;
  _getData(): string;
}

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

describe('Test fetchByIdHandler', () => {
  let mockReq: NextApiRequest;
  let mockRes: MockNextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    mockReq = req;
    mockRes = res as MockNextApiResponse;

    (path.join as jest.Mock).mockReturnValue('/mock/path/pokemon.json');
  });

  it('Should successfully read and return JSON data', async () => {
    const mockPokemonData = [
      { id: 1, name: 'Bulbasaur' },
      { id: 2, name: 'Ivysaur' },
    ];

    mockReq.query = { id: '1' };

    (fs.promises.readFile as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockPokemonData)
    );

    await fetchPokemonById(mockReq, mockRes);

    expect(path.join).toHaveBeenCalledWith(
      process.cwd(),
      'pages',
      'api',
      'data',
      'pokemon.json'
    );

    expect(fs.promises.readFile).toHaveBeenCalledWith(
      '/mock/path/pokemon.json',
      'utf-8'
    );

    expect(mockRes._getStatusCode()).toBe(200);
    expect(JSON.parse(mockRes._getData())).toEqual(mockPokemonData[0]);
  });

  it('Should handle file read errors', async () => {
    mockReq.query = { id: '1' };

    (fs.promises.readFile as jest.Mock).mockRejectedValueOnce(
      new Error('File read error')
    );

    await fetchPokemonById(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith(
      'Failed to fetch the single Pokemon data'
    );
    expect(mockRes._getStatusCode()).toBe(500);
    expect(JSON.parse(mockRes._getData())).toEqual({
      message: 'Internal Server Error',
    });
  });

  it('Should handle JSON parsing errors', async () => {
    mockReq.query = { id: '1' };
    (fs.promises.readFile as jest.Mock).mockResolvedValueOnce('invalid json');

    await fetchPokemonById(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith(
      'Failed to fetch the single Pokemon data'
    );
    expect(mockRes._getStatusCode()).toBe(500);
    expect(JSON.parse(mockRes._getData())).toEqual({
      message: 'Internal Server Error',
    });
  });

  it('Should use correct file path', async () => {
    mockReq.query = { id: '1' };

    (fs.promises.readFile as jest.Mock).mockResolvedValueOnce('[]');

    await fetchPokemonById(mockReq, mockRes);

    expect(path.join).toHaveBeenCalledWith(
      process.cwd(),
      'pages',
      'api',
      'data',
      'pokemon.json'
    );
  });

  it('Should handle empty JSON array', async () => {
    mockReq.query = { id: '1' };

    (fs.promises.readFile as jest.Mock).mockResolvedValueOnce('[]');

    await fetchPokemonById(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(404);
    expect(JSON.parse(mockRes._getData())).toEqual({
      message: 'Pokemon not found',
    });
  });
});
