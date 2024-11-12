import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import getPokemonData from '../../../../pages/api/pokemon';

describe('Test getPokemonData API endpoint', () => {
  let mockedResponseSend: jest.Mock<any, any>;
  let mockedResponse: NextApiResponse;

  beforeEach(() => {
    mockedResponseSend = jest.fn();
    mockedResponse = {
      status: jest.fn().mockReturnThis(),
      json: mockedResponseSend,
    } as unknown as NextApiResponse;
  });

  it('Should return 200 status and JSON data', async () => {
    const readFileSpy = jest.spyOn(fs.promises, 'readFile').mockResolvedValue(
      JSON.stringify([
        { name: 'Pikachu', type: 'Electric' },
        { name: 'Bulbasaur', type: 'Grass/Poison' },
      ])
    );

    const mockedRequest = {
      method: 'GET',
      url: '/api/pokemon-data',
    } as NextApiRequest;

    await getPokemonData(mockedRequest, mockedResponse);

    expect(readFileSpy).toHaveBeenCalledWith(
      expect.stringContaining('pokemon.json'),
      'utf-8'
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(200);
    expect(mockedResponseSend).toHaveBeenCalledWith([
      { name: 'Pikachu', type: 'Electric' },
      { name: 'Bulbasaur', type: 'Grass/Poison' },
    ]);
  });

  it('Should handle errors and return a 500 status', async () => {
    const readFileSpy = jest
      .spyOn(fs.promises, 'readFile')
      .mockRejectedValue(new Error('Internal Server Error'));

    const mockedRequest = {
      method: 'GET',
      url: '/api/pokemon-data',
    } as NextApiRequest;

    await getPokemonData(mockedRequest, mockedResponse);

    expect(readFileSpy).toHaveBeenCalledWith(
      expect.stringContaining('pokemon.json'),
      'utf-8'
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(500);
    expect(mockedResponseSend).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  it('Should return 405 status for unsupported HTTP methods', async () => {
    const mockedRequest = {
      method: 'POST',
      url: '/api/pokemon-data',
    } as NextApiRequest;

    await getPokemonData(mockedRequest, mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(405);
    expect(mockedResponseSend).toHaveBeenCalledWith({
      message: 'Method Not Allowed',
    });
  });
});
