import { Logger, logger } from '../../common/utils/logger';

describe('Test Logger', () => {
  let logger: Logger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('formatMessage', () => {
    it('Should correctly format a log message', () => {
      const message = 'Test message';
      const data = { key: 'value' };
      const level = 'info';
      const logMessage = (logger as any).formatMessage(level, message, data);

      expect(logMessage).toHaveProperty('timestamp');
      expect(logMessage.timestamp).toMatch(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      );
      expect(logMessage.level).toBe(level);
      expect(logMessage.message).toBe(message);
      expect(logMessage.data).toBe(data);
    });
  });

  describe('Info', () => {
    it('Should log info messages in development or server environment', () => {
      const message = 'Info message';
      const data = { key: 'value' };

      (logger as any).isDev = true;
      logger.info(message, data);

      const expectedLog = {
        level: 'info',
        message,
        data,
        timestamp: expect.any(String),
      };

      const receivedLog = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(receivedLog).toEqual(expect.objectContaining(expectedLog));
    });

    it('should not log info messages if not in development or server environment', () => {
      (logger as any).isDev = false;
      (logger as any).isServer = false;
      logger.info('Info message');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('Error', () => {
    it('Should log error messages regardless of environment', () => {
      const message = 'Error message';
      const data = { error: 'Test error' };

      logger.error(message, data);

      const expectedLog = {
        level: 'error',
        message,
        data,
        timestamp: expect.any(String),
      };

      const receivedLog = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(receivedLog).toEqual(expect.objectContaining(expectedLog));
    });
  });

  describe('Warn', () => {
    it('Should log warning messages regardless of environment', () => {
      const message = 'Warning message';
      const data = { warning: 'Test warning' };

      logger.warn(message, data);

      const expectedLog = {
        level: 'warn',
        message,
        data,
        timestamp: expect.any(String),
      };

      const receivedLog = JSON.parse(consoleWarnSpy.mock.calls[0][0]);

      expect(receivedLog).toEqual(expect.objectContaining(expectedLog));
    });
  });

  describe('Debug', () => {
    it('Should log debug messages in development environment', () => {
      (logger as any).isDev = true;
      const message = 'Debug message';
      const data = { debug: 'Test debug' };

      logger.debug(message, data);

      const expectedLog = {
        level: 'debug',
        message,
        data,
        timestamp: expect.any(String),
      };

      const receivedLog = JSON.parse(consoleDebugSpy.mock.calls[0][0]);
      expect(receivedLog).toEqual(expect.objectContaining(expectedLog));
    });

    it('Should not log debug messages if not in development environment', () => {
      (logger as any).isDev = false;
      logger.debug('Debug message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });
});
