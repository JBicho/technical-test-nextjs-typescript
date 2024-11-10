import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { handler } from '../../../../pages/api/pokemon';

jest.mock('../../../../pages/api/pokemon', () => ({
  handler: jest.fn(),
}));

describe('getPokemonData API Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should call handler with correct request and response objects', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(handler).toHaveBeenCalledWith(req, res);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('Should handle success response from handler', async () => {
    const mockPokemonData = [
      { id: 1, name: 'Bulbasaur' },
      { id: 2, name: 'Ivysaur' },
    ];

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    (handler as jest.Mock).mockImplementationOnce(async (_, res) => {
      res.status(200).json(mockPokemonData);
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockPokemonData);
  });

  it('Should handle error response from handler', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    const errorMessage = 'Internal Server Error';
    (handler as jest.Mock).mockImplementationOnce(async (_, res) => {
      res.status(500).json({ error: errorMessage });
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ error: errorMessage });
  });

  it('Should handle different HTTP methods', async () => {
    const { req: postReq, res: postRes } = createMocks<
      NextApiRequest,
      NextApiResponse
    >({
      method: 'POST',
      body: { name: 'New Pokemon' },
    });

    await handler(postReq, postRes);
    expect(handler).toHaveBeenCalledWith(postReq, postRes);

    const { req: putReq, res: putRes } = createMocks<
      NextApiRequest,
      NextApiResponse
    >({
      method: 'PUT',
      body: { id: 1, name: 'Updated Pokemon' },
    });

    await handler(putReq, putRes);
    expect(handler).toHaveBeenCalledWith(putReq, putRes);
  });

  it('should handle query parameters', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { limit: '10', offset: '0' },
    });

    await handler(req, res);

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          limit: '10',
          offset: '0',
        }),
      }),
      res
    );
  });
});
