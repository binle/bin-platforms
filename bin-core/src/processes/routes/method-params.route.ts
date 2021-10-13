/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiRequestParamInjectedData, ExRequest, ExResponse } from 'src/definitions';

export class MethodParamsRoute {
  static defineMethodParamValue(
    req: ExRequest,
    res: ExResponse,
    type: ApiRequestParamInjectedData
  ): {
    canValidate: boolean;
    value: any;
  } {
    const { from } = type;
    let canValidate = true;
    let returnedData;
    switch (from) {
      case 'request': {
        returnedData = req;
        canValidate = false;
        break;
      }
      case 'response': {
        returnedData = res;
        canValidate = false;
        break;
      }
      case 'body': {
        returnedData = req.body;
        break;
      }
      case 'headers': {
        returnedData = req.headers;
        break;
      }
      case 'params': {
        returnedData = req.params;
        break;
      }
      case 'query': {
        returnedData = req.query;
        break;
      }
      default: {
        returnedData = (req as any)[from];
      }
    }
    return {
      canValidate,
      value: returnedData,
    };
  }
}
