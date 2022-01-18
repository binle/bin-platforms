/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express } from '@bachle/bin-core';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { initialization } from './app';
import { createApp } from './server';

// const stopServer = (server?: http.Server | https.Server) => {
//   if (server) {
//     server.close(() => {
//       process.exit(0);
//     });
//   } else {
//     process.exit(0);
//   }
// };

const startServer = (app: Express, ssl?: boolean): http.Server | https.Server => {
  if (!ssl) {
    return http.createServer(app);
  }
  return https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, '../ssl', 'server.key')),
      cert: fs.readFileSync(path.join(__dirname, '../ssl', 'server.crt')),
    },
    app
  );
};

let server: http.Server | https.Server;
(async () => {
  await initialization();
  const { configs, logger } = global.applicationContexts;
  const app = createApp();
  server = startServer(app);
  // server = startServer(app, true);
  server.listen(+configs.port, configs.host as string);
  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    logger.info('Listening on ', bind);
  });

  server.on('error', (error: any) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = configs.port === 'string' ? `Pipe ${configs.port}` : `Port ${configs.port}`;
    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        break;
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        break;
      default:
        throw error;
    }
  });
})().catch((error) => {
  const { logger } = global.applicationContexts;
  (logger ? logger : console).error('server error ========', error);
  // stopServer(server);
});
