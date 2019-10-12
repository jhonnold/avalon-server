const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf } = format;
const logger = createLogger({
  level: 'debug',
  transports: [ new transports.Console() ],
  exitOnError: false,
  format: combine(
    timestamp({ format: 'HH:mm:ss' }),
    printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`),
  ),
});

module.exports = logger;