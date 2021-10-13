/* eslint-disable @typescript-eslint/no-explicit-any */
import { express, Express, ExRequest, ExResponse } from '@bachle/bin-core';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';
import { route } from './routes';
import { corsMiddleware } from './routes/middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

ejs.delimiter = '@';

export const createApp = (): Express => {
  const app = express();
  app.engine('html', ejs.renderFile);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.disable('x-powered-by');

  app.use(corsMiddleware());
  app.get('/home', (_req: ExRequest, res: ExResponse) => {
    res.status(200).send('Home page');
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  route(app);
  return app;
};
