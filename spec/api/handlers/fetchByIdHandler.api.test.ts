import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { logger } from '../../../common/utils/logger';
import { readJsonFile } from '../../../common/utils/jsonFileReader';
import fetchPokemonById from '../../../pages/api/handlers/fetchByIdHandler';

jest.mock('../../../common/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));
jest.mock('../../../common/utils/jsonFileReader');

describe('fetchPokemonById', () => {
  const mockPokemonData = [
    {
      id: 1,
      name: 'Bulbasaur',
      attack: 49,
      defense: 49,
      hp: 45,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
    },
    {
      id: 2,
      name: 'Ivysaur',
      attack: 62,
      defense: 63,
      hp: 60,
      special_attack: 80,
      special_defense: 80,
      speed: 60,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (readJsonFile as jest.Mock).mockResolvedValue(mockPokemonData);
  });

  it('Should successfully fetch a Pokemon by ID', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: '1' },
    });

    await fetchPokemonById(req, res);

    expect(readJsonFile).toHaveBeenCalledWith('pages/api/data/pokemon.json');
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockPokemonData[0]);
  });

  it('Should return 404 when Pokemon is not found', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: '999' },
    });

    await fetchPokemonById(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Pokemon not found',
    });
    expect(logger.error).toHaveBeenCalledWith('Pokemon not found');
  });

  it('Should handle internal server error when file reading fails', async () => {
    (readJsonFile as jest.Mock).mockRejectedValue(new Error('File read error'));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: '1' },
    });

    await fetchPokemonById(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Internal Server Error',
    });
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to fetch the single Pokemon data'
    );
  });

  it('Should handle empty data array', async () => {
    (readJsonFile as jest.Mock).mockResolvedValue([]);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: '1' },
    });

    await fetchPokemonById(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Pokemon not found',
    });
    expect(logger.error).toHaveBeenCalledWith('Pokemon not found');
  });

  it('Should handle non-numeric ID', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: 'abc' },
    });

    await fetchPokemonById(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Pokemon not found',
    });
    expect(logger.error).toHaveBeenCalledWith('Pokemon not found');
  });
});
