import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { createMocks } from 'node-mocks-http';
import { logger } from '../../../common/utils/logger';
import { errorMiddleware } from '../../../pages/api/middleware/errorMiddleware';

// Mock the logger to prevent actual logging during tests
jest.mock('../../../common/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('errorMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute all handlers successfully when no errors occur', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    const handler1 = jest.fn().mockResolvedValue(undefined);
    const handler2 = jest.fn().mockResolvedValue(undefined);

    await errorMiddleware(handler1, handler2)(req, res);

    expect(handler1).toHaveBeenCalledWith(req, res);
    expect(handler2).toHaveBeenCalledWith(req, res);
    expect(res._getStatusCode()).toBe(200);
  });

  it('should handle ApiError with correct status code and message', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    const errorHandler = jest
      .fn()
      .mockRejectedValue(new ApiError(404, 'Resource not found'));

    await errorMiddleware(errorHandler)(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Resource not found',
    });
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors with 500 status code', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    const errorHandler = jest
      .fn()
      .mockRejectedValue(new Error('Unexpected error'));

    await errorMiddleware(errorHandler)(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Internal Server Error',
    });
    expect(logger.error).toHaveBeenCalledWith('Unexpected problem occurred');
  });

  it('should stop execution chain when an error occurs', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    const handler1 = jest
      .fn()
      .mockRejectedValue(new ApiError(400, 'Bad Request'));
    const handler2 = jest.fn().mockResolvedValue(undefined);

    await errorMiddleware(handler1, handler2)(req, res);

    expect(handler1).toHaveBeenCalledWith(req, res);
    expect(handler2).not.toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Bad Request',
    });
  });

  it('should handle async handlers properly', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    const handler1 = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    const handler2 = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

    await errorMiddleware(handler1, handler2)(req, res);

    expect(handler1).toHaveBeenCalledWith(req, res);
    expect(handler2).toHaveBeenCalledWith(req, res);
    expect(res._getStatusCode()).toBe(200);
  });

  it('should handle rejection in async handlers', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    const handler = jest
      .fn()
      .mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new ApiError(403, 'Forbidden')), 100)
          )
      );

    await errorMiddleware(handler)(req, res);

    expect(handler).toHaveBeenCalledWith(req, res);
    expect(res._getStatusCode()).toBe(403);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Forbidden',
    });
  });
});
