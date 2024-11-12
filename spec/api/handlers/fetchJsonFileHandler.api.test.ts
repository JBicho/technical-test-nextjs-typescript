import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { logger } from '../../../common/utils/logger';
import { dataFecthHandler } from '../../../pages/api/handlers/fetchDataHandler';
import { calculatePokemonPower } from '../../../common/utils/calculatePokemonPower';
import { findMinPower } from '../../../common/utils/findMinValue';
import { findMaxPower } from '../../../common/utils/findMaxValue';
import { readJsonFile } from '../../../common/utils/jsonFileReader';
import { MAX_LIMIT } from '../../../common/constants';

jest.mock('../../../common/utils/logger');
jest.mock('../../../common/utils/calculatePokemonPower');
jest.mock('../../../common/utils/findMinValue');
jest.mock('../../../common/utils/findMaxValue');
jest.mock('../../../common/utils/jsonFileReader');

describe('dataFetchHandler', () => {
  const mockPokemonData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Pokemon ${i + 1}`,
    attack: 10,
    defense: 10,
    hp: 10,
    special_attack: 10,
    special_defense: 10,
    speed: 10,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    (readJsonFile as jest.Mock).mockResolvedValue(mockPokemonData);
    (calculatePokemonPower as jest.Mock).mockReturnValue(100);
    (findMinPower as jest.Mock).mockReturnValue(50);
    (findMaxPower as jest.Mock).mockReturnValue(150);
  });

  it('Should require page and limit parameters', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await dataFecthHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: "'page' and 'limit' are required.",
    });
  });

  it('Should validate positive integers for page and limit', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '-1', limit: '0' },
    });

    await dataFecthHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: "'page' and 'limit' must be valid positive integers.",
    });
  });

  it('Should return paginated data with valid parameters', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '1', limit: '10' },
    });

    await dataFecthHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const response = JSON.parse(res._getData());
    expect(response.data).toHaveLength(10);
    expect(response.countData).toEqual({
      count: mockPokemonData.length,
      min: 50,
      max: 150,
    });
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 3,
      totalItems: 30,
      itemsPerPage: 10,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('Should handle page out of range', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '100', limit: '10' },
    });

    await dataFecthHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Page 100 does not exist. Total pages: 3',
    });
  });

  it('Should handle name filtering', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        page: '1',
        limit: '10',
        name: 'Pokemon 1',
      },
    });

    await dataFecthHandler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const response = JSON.parse(res._getData());

    expect(response.data).toHaveLength(10);
    expect(response.pagination.totalItems).toBe(11);
  });

  it('Should handle power threshold filtering', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        page: '1',
        limit: '10',
        powerThreshold: '90',
      },
    });

    await dataFecthHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const response = JSON.parse(res._getData());
    expect(response.data.length).toBeGreaterThan(0);
    expect(calculatePokemonPower).toHaveBeenCalled();
  });

  it('Should return empty result for no matches', async () => {
    (readJsonFile as jest.Mock).mockResolvedValue([]);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '1', limit: '10' },
    });

    await dataFecthHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it('Should handle internal server error', async () => {
    (readJsonFile as jest.Mock).mockRejectedValue(
      new Error('Failed to read file')
    );

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '1', limit: '10' },
    });

    await dataFecthHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Internal Server Error',
    });
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to fetch Pokemon data',
      expect.any(Error)
    );
  });

  it('Should respect MAX_LIMIT constant', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { page: '1', limit: '1000' },
    });

    await dataFecthHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const response = JSON.parse(res._getData());
    expect(response.pagination.itemsPerPage).toBeLessThanOrEqual(MAX_LIMIT);
  });
});
