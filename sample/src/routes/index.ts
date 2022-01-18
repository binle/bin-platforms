/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponseDataSuccess, express, Express, ExRequest, ExResponse, routeApp } from '@bachle/bin-core';
import fse from 'fs-extra';
import path from 'path';
import { HelperUtil } from 'src/app';
import './controllers';

const routeClient = (app: Express): void => {
  const { configs } = global.applicationContexts;
  if (!configs.client_path || !fse.existsSync(configs.client_path)) {
    return;
  }
  const fileExtensions = HelperUtil.getFileExtensions(configs.client_path);
  app.get(new RegExp(`^.+.(${fileExtensions.join('|')})$`), express.static(configs.client_path));
  app.use('/*', async (req: ExRequest, res: ExResponse) => {
    const user = req?.user;
    res.render(path.join(configs.client_path, 'index.html'), {
      config: configs.client_configs,
      title: 'Server sample',
      user: user || {
        displayName: 'Anonymous',
      },
    });
  });
};

const routeServer = (app: Express): void => {
  routeApp(app, {
    prefix: 'api',
    docPath: 'doc',
    logger: global.applicationContexts.logger,
    dataHandlerOptions: {
      dataHandler: (data: any, res: ExResponse) => {
        res.send(data);
      },
      getSuccessSchema: (response?: ApiResponseDataSuccess) =>
        response?.data || {
          description: 'Response in success case:',
        },
    },
  });
};

export const route = (app: Express): void => {
  routeServer(app);
  routeClient(app);
};

export * from './middleware';
