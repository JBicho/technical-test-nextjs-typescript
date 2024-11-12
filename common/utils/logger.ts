type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface LogMessage {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

export class Logger {
  private isServer = typeof window === 'undefined';
  private isDev = process.env.NODE_ENV === 'development';

  private formatMessage(
    level: LogLevel,
    message: string,
    data?: unknown
  ): LogMessage {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  info(message: string, data?: unknown): void {
    const logMessage = this.formatMessage('info', message, data);
    if (this.isDev || this.isServer) {
      console.log(JSON.stringify(logMessage, null, 2));
    }
  }

  error(message: string, data?: unknown): void {
    const logMessage = this.formatMessage('error', message, data);

    console.error(JSON.stringify(logMessage, null, 2));
  }

  warn(message: string, data?: unknown): void {
    const logMessage = this.formatMessage('warn', message, data);

    console.warn(JSON.stringify(logMessage, null, 2));
  }

  debug(message: string, data?: unknown): void {
    if (this.isDev) {
      const logMessage = this.formatMessage('debug', message, data);
      
      console.debug(JSON.stringify(logMessage, null, 2));
    }
  }
}

export const logger = new Logger();
