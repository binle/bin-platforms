import { ExRequestHandler, HttpStatusCodes, newBinHttpError } from '@bachle/bin-core';
import cors, { CorsOptions } from 'cors';
import { BinHttpErrorCodes } from 'src/definitions';

export const corsMiddleware = (): ExRequestHandler => {
  const { configs } = global.applicationContexts;
  const whitelist = configs.allowed_origin_urls;
  const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(newBinHttpError(HttpStatusCodes.METHOD_NOT_ALLOWED, BinHttpErrorCodes.invalid_cors));
      }
    },
  };
  return cors(corsOptions);
};
