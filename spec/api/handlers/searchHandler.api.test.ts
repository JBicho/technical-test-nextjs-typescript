import 'jest';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import searchPokemonHandler from '../../../pages/api/handlers/searchHandler';
import { SearchResponse } from '../../../common/interfaces/apiResponse';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
  existsSync: jest.fn().mockReturnValue(true),
  stat: jest
    .fn()
    .mockResolvedValue({ isFile: jest.fn().mockReturnValue(true) }),
}));

describe('Test searchPokemonHandler', () => {
  let mockReq: NextApiRequest;
  let mockRes: Partial<NextApiResponse>;

  beforeEach(() => {
    mockReq = {
      query: {},
    } as NextApiRequest;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return 200 and a list of pokemons when query is empty', async () => {
    const jsonData = JSON.stringify([
      {
        id: 1,
        name: 'Pikachu',
        hp: 35,
        attack: 55,
        defense: 40,
        special_attack: 50,
        special_defense: 50,
        speed: 90,
        type: ['Electric'],
      },
    ]);
    (fs.promises.readFile as jest.Mock).mockResolvedValue(jsonData);

    mockReq.query = {};

    const mockResponse: SearchResponse = {
      pokemonList: [
        {
          id: 1,
          name: 'Pikachu',
          hp: 35,
          attack: 55,
          defense: 40,
          special_attack: 50,
          special_defense: 50,
          speed: 90,
          type: ['Electric'],
        },
      ],
      count: 1,
      min: 320,
      max: 320,
    };

    await searchPokemonHandler(mockReq, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });

  it('Should return 404 when no pokemon matches the query', async () => {
    const jsonData = JSON.stringify([
      {
        id: 1,
        name: 'Pikachu',
        hp: 35,
        attack: 55,
        defense: 40,
        special_attack: 50,
        special_defense: 50,
        speed: 90,
        type: ['Electric'],
      },
    ]);
    (fs.promises.readFile as jest.Mock).mockResolvedValue(jsonData);

    mockReq.query = { name: 'Charmander' };

    await searchPokemonHandler(mockReq, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Pokemon not found' });
  });

  it('Should return 500 when there is an error reading the file', async () => {
    (fs.promises.readFile as jest.Mock).mockRejectedValue(
      new Error('Failed to read file')
    );

    await searchPokemonHandler(mockReq, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  it('Should return filtered pokemons when query has name', async () => {
    const jsonData = JSON.stringify([
      {
        id: 1,
        name: 'Pikachu',
        hp: 35,
        attack: 55,
        defense: 40,
        special_attack: 50,
        special_defense: 50,
        speed: 90,
        type: ['Electric'],
      },
      {
        id: 2,
        name: 'Charmander',
        hp: 39,
        attack: 52,
        defense: 43,
        special_attack: 60,
        special_defense: 50,
        speed: 65,
        type: ['Fire'],
      },
    ]);
    (fs.promises.readFile as jest.Mock).mockResolvedValue(jsonData);

    mockReq.query = { name: 'Pikachu' };

    const mockResponse: SearchResponse = {
      pokemonList: [
        {
          id: 1,
          name: 'Pikachu',
          hp: 35,
          attack: 55,
          defense: 40,
          special_attack: 50,
          special_defense: 50,
          speed: 90,
          type: ['Electric'],
        },
      ],
      count: 1,
      min: 320,
      max: 320,
    };

    await searchPokemonHandler(mockReq, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });

  it('Should return filtered pokemons when query has powerThreshold', async () => {
    const jsonData = JSON.stringify([
      {
        id: 1,
        name: 'Pikachu',
        hp: 35,
        attack: 55,
        defense: 40,
        special_attack: 50,
        special_defense: 50,
        speed: 90,
        type: ['Electric'],
      },
      {
        id: 2,
        name: 'Charmander',
        hp: 39,
        attack: 52,
        defense: 43,
        special_attack: 60,
        special_defense: 50,
        speed: 65,
        type: ['Fire'],
      },
    ]);
    (fs.promises.readFile as jest.Mock).mockResolvedValue(jsonData);

    mockReq.query = { powerThreshold: '310' };

    const mockResponse: SearchResponse = {
      pokemonList: [
        {
          id: 1,
          name: 'Pikachu',
          hp: 35,
          attack: 55,
          defense: 40,
          special_attack: 50,
          special_defense: 50,
          speed: 90,
          type: ['Electric'],
        },
      ],
      count: 1,
      min: 320,
      max: 320,
    };

    await searchPokemonHandler(mockReq, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });

  it('Should return filtered pokemons when query has both name and powerThreshold', async () => {
    const jsonData = JSON.stringify([
      {
        id: 1,
        name: 'Pikachu',
        hp: 35,
        attack: 55,
        defense: 40,
        special_attack: 50,
        special_defense: 50,
        speed: 90,
        type: ['Electric'],
      },
      {
        id: 2,
        name: 'Charmander',
        hp: 39,
        attack: 52,
        defense: 43,
        special_attack: 60,
        special_defense: 50,
        speed: 65,
        type: ['Fire'],
      },
    ]);
    (fs.promises.readFile as jest.Mock).mockResolvedValue(jsonData);

    mockReq.query = { name: 'Pikachu', powerThreshold: '300' };

    const mockResponse: SearchResponse = {
      pokemonList: [
        {
          id: 1,
          name: 'Pikachu',
          hp: 35,
          attack: 55,
          defense: 40,
          special_attack: 50,
          special_defense: 50,
          speed: 90,
          type: ['Electric'],
        },
      ],
      count: 1,
      min: 320,
      max: 320,
    };

    await searchPokemonHandler(mockReq, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
  });
});
