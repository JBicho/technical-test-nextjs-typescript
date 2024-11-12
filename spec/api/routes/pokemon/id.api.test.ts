import fs from 'fs';
import { createMocks } from 'node-mocks-http';
import getPokemonById from '../../../../pages/api/pokemon/[id]';

jest.mock('fs');

jest.mock('../../../../common/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('GET /api/pokemon/[id]', () => {
  it('Should return 200 and the Pokemon data if found', async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([{ id: 1, name: 'Bulbasaur' }])
    );

    const { req, res } = createMocks({
      method: 'GET',
      query: { id: '1' },
    });

    await getPokemonById(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getData()).toEqual(
      JSON.stringify({ id: 1, name: 'Bulbasaur' })
    );
  });

  it('Should return 404 if the Pokemon is not found', async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([])
    );

    const { req, res } = createMocks({
      method: 'GET',
      query: { id: '999' },
    });

    await getPokemonById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getData()).toEqual(
      JSON.stringify({ message: 'Pokemon not found' })
    );
  });

  it('Should return 500 if there is an unexpected error', async () => {
    (fs.promises.readFile as jest.Mock).mockRejectedValueOnce(
      new Error('File read error')
    );

    const { req, res } = createMocks({
      method: 'GET',
      query: { id: '1' },
    });

    await getPokemonById(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual(
      JSON.stringify({ message: 'Internal Server Error' })
    );
  });
});
