import winston from 'winston';

const createLogger = () => {
  if (typeof window !== 'undefined') {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    });
  }

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

  if (process.env.NODE_ENV === 'development') {
    logger.add(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      })
    );
    logger.add(
      new winston.transports.File({
        filename: 'logs/combined.log',
      })
    );
  }

  return logger;
};

export const logger = createLogger();
