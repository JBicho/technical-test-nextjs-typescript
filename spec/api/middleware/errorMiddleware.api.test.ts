import { NextApiRequest, NextApiResponse } from 'next';
import { errorMiddleware } from '../../../pages/api/middleware/errorMiddleware';

const createMockResponse = (): NextApiResponse => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
    end: jest.fn(),
  };
  return mockRes as unknown as NextApiResponse;
};

describe('Test errorMiddleware', () => {
  it('Should reject unsupported HTTP methods and not call handlers', async () => {
    const mockedRequest = { method: 'DELETE' } as NextApiRequest;
    const mockedResponse = createMockResponse();
    const handlerMock = jest.fn();

    await errorMiddleware(['GET'], handlerMock)(mockedRequest, mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(405);
    expect(mockedResponse.json).toHaveBeenCalledWith({
      message: 'Method Not Allowed',
    });
    expect(handlerMock).not.toHaveBeenCalled();
  });

  it('Should call the handler if the method is supported', async () => {
    const mockedRequest = { method: 'GET' } as NextApiRequest;
    const mockedResponse = createMockResponse();
    const handlerMock = jest.fn();

    await errorMiddleware(['GET'], handlerMock)(mockedRequest, mockedResponse);

    expect(handlerMock).toHaveBeenCalled();
  });

  it('Should handle errors thrown by handlers and return 500', async () => {
    const mockedRequest = { method: 'GET' } as NextApiRequest;
    const mockedResponse = createMockResponse();
    const handlerMock = jest
      .fn()
      .mockRejectedValue(new Error('Something went wrong'));

    await errorMiddleware(['GET'], handlerMock)(mockedRequest, mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(500);
    expect(mockedResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });
});
