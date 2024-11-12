import { NextApiRequest, NextApiResponse } from 'next';
import searchPokemon from '../../../../pages/api/pokemon/search';

jest.mock('../../../../pages/api/handlers/searchHandler', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import searchHandler from '../../../../pages/api/handlers/searchHandler';

describe('Test Search Endpoint', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockResponse: any;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockReq = {
      method: 'GET',
      query: {},
    };

    mockResponse = {
      pokemonList: [
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
      ],
      count: 1,
      min: 318,
      max: 318,
    };

    jest.clearAllMocks();

    (searchHandler as jest.Mock).mockImplementation(
      async (req: NextApiRequest, res: NextApiResponse) => {
        res.status(200).json(mockResponse);
      }
    );
  });

  it('Should successfully return pokemon data when found', async () => {
    mockReq.query = { name: 'bulb' };

    await searchPokemon(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });

  it('Should return 404 if no matching Pokémon found', async () => {
    mockReq.query = { name: 'nonexistentpokemon' };

    (searchHandler as jest.Mock).mockImplementation(
      async (req: NextApiRequest, res: NextApiResponse) => {
        res.status(404).json({ error: 'No Pokémon found' });
      }
    );

    await searchPokemon(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'No Pokémon found',
    });
  });

  it('Should successfully return filtered results when powerThreshold is provided', async () => {
    mockReq.query = { powerThreshold: '300' };

    await searchPokemon(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });

  it('Should handle search with multiple query parameters', async () => {
    mockReq.query = { name: 'bulb', powerThreshold: '300' };

    await searchPokemon(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });

  it('Should handle empty query parameters', async () => {
    mockReq.query = {};

    await searchPokemon(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });

  it('Should return 405 for non-GET methods', async () => {
    mockReq.method = 'POST';

    await searchPokemon(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Method Not Allowed',
    });
  });

  it('Should handle internal server errors', async () => {
    mockReq.query = { name: 'bulb' };

    (searchHandler as jest.Mock).mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    await searchPokemon(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });
});
