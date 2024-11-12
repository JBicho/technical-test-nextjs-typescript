import { createMocks } from 'node-mocks-http';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../../../../common/utils/logger';
import getPokemonData from '../../../../pages/api/pokemon';
import { calculatePokemonPower } from '../../../../common/utils/calculatePokemonPower';
import { Pokemon } from '../../../../common/interfaces/pokemon';

jest.mock('../../../../common/utils/logger');
jest.mock('fs');
jest.mock('.../../../../common/utils/calculatePokemonPower');

(calculatePokemonPower as jest.Mock).mockReturnValue(100);

const mockData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Pokemon ${i + 1}`,
  attack: 10,
  defense: 10,
  hp: 10,
  special_attack: 10,
  special_defense: 10,
  speed: 10,
}));

describe('GET /api/pokemon', () => {
  beforeAll(() => {
    (fs.promises.readFile as jest.Mock).mockImplementation(
      (filePath: string) => {
        const expectedPath = path.join(
          process.cwd(),
          'pages',
          'api',
          'data',
          'pokemon.json'
        );
        if (filePath === expectedPath) {
          return Promise.resolve(JSON.stringify(mockData));
        }
        return Promise.reject(new Error('File not found'));
      }
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return paginated data with default page and limit', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '1', limit: '10' },
    });
    await getPokemonData(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = res._getJSONData();
    expect(json.data).toHaveLength(10);
    expect(json.pagination.currentPage).toBe(1);
    expect(json.pagination.totalItems).toBe(mockData.length);
  });

  it('Should return paginated data with specified page and limit', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '2', limit: '5' },
    });
    await getPokemonData(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = res._getJSONData();
    expect(json.data).toHaveLength(5);
    expect(json.pagination.currentPage).toBe(2);
    expect(json.pagination.itemsPerPage).toBe(5);
  });

  it('Should handle invalid page numbers gracefully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '100', limit: '5' },
    });
    await getPokemonData(req, res);

    expect(res._getStatusCode()).toBe(400);
    const json = res._getJSONData();
    expect(json.message).toBe('Page 100 does not exist. Total pages: 6');
  });

  it('Should return a 405 error for unsupported methods', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });
    await getPokemonData(req, res);

    expect(res._getStatusCode()).toBe(405);
    const json = res._getJSONData();
    expect(json.message).toBe('Method Not Allowed');
  });

  it('Should return 500 if there is an unexpected error', async () => {
    (fs.promises.readFile as jest.Mock).mockRejectedValueOnce(
      new Error('Unexpected error')
    );

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '1', limit: '10' },
    });

    await getPokemonData(req, res);

    expect(res._getStatusCode()).toBe(500);
    const json = res._getJSONData();
    expect(json.message).toBe('Internal Server Error');
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to fetch Pokemon data',
      expect.any(Error)
    );
  });

  it('Should return filtered data based on name query', async () => {
    const exactPokemonName = 'Pokemon 1';
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        page: '1',
        limit: '10',
        name: exactPokemonName,
      },
    });

    await getPokemonData(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = res._getJSONData();
    expect(json.data).toHaveLength(10);
    expect(json.pagination.totalItems).toBe(11);
  });

  it('Should return filtered data based on power threshold', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        page: '1',
        limit: '10',
        powerThreshold: '50',
      },
    });

    await getPokemonData(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = res._getJSONData();
    expect(json.data.length).toBeGreaterThan(0);

    json.data.forEach((pokemon: Pokemon) => {
      const power = calculatePokemonPower(pokemon);
      expect(power).toBeGreaterThan(50);
    });
  });

  it('Should return empty data if no pokemons match the filter', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        page: '1',
        limit: '10',
        name: 'Nonexistent Pokemon',
      },
    });

    await getPokemonData(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = res._getJSONData();
    expect(json.data).toHaveLength(0);
    expect(json.pagination.totalItems).toBe(0);
    expect(json.pagination.totalPages).toBe(0);
    expect(json.pagination.hasNextPage).toBe(false);
  });
});
