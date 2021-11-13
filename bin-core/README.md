# 1. Install

`npm install @bachle/bin-core`

`yarn add @bachle/bin-core`

# 2. Use

## 2.1 Routing

```
import {routeApp } from '@bachle/bin-core';


routeApp(
  app: Express,
  options?: {
    prefix?: string;
    docPath?: string;
    logger?: any;
    dataHandlerOptions?: {
      dataHandler: TypeDataHandler;
      getSuccessSchema?: TypeGetSuccessSchema;
    };
    notFoundHandle?: ExRequestHandler;
    errorHandlerOptions?: {
      errorHandler: ExErrorRequestHandler;
      getFailedSchema?: TypeGetFailedSchema;
    };
  }
)
```

| name                                        | type                                             | value/sample                       | description                                                                                                                                               |
| :------------------------------------------ | :----------------------------------------------- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app                                         | Express                                          | required- `const app = express();` | router from **express**                                                                                                                                   |
| options                                     | object                                           | optional                           | setting for routing                                                                                                                                       |
| options.prefix                              | string                                           | default: ''- should be: 'api'      | prefix of API server `domain.com/[prefix/]{apiPath}` .                                                                                                    |
| options.docPath                             | string                                           | default:''                         | empty mean don't need document api. Sample: docPath: 'doc' => api document :`domain.com/doc/`, detail API: `domain.com/doc/#{method}_/[prefix/]{apiPath}` |
| options.logger                              | object                                           | default:undefined                  | at least exist error function with two params `logger.error(message, error) `                                                                             |
| options.dataHandlerOptions                  | object                                           |                                    | process with data when API success (data and document)                                                                                                    |
| options.dataHandlerOptions.dataHandler      | Function: (data: any, res: ExResponse) => void   |                                    | default: `(data: any, res: ExResponse) => { res.send({ data }); }`                                                                                        |
| options.dataHandlerOptions.getSuccessSchema | Function: (responseData?: T) => IObjectSchema<T> |                                    | default success schema: ```{                                                                                                                              |

type: 'object',
description: response?.description || 'Response in success case:',
properties: {
data: response?.data || ({ type: undefined } as ISchemaCore),
},
}``` |

### 2.1.1 Controller

```
@ApiController({
  name: Symbol('HomeController'),
  path: HomeController.path,
})
export class HomeControllerImpl {
  @Get(HomeController.children.hello, 'Hello Api')
  @ApiResponseSuccess({ type: 'string' } as IStringSchema, 'Return message welcome!')
  helloAnonymous(@Queries(querySchema) queries: { name: string }): string {
    return `hello ${queries.name || 'anonymous'}! Welcome to my service.`;
  }
}

```

### 2.1.2 Request Method

### 2.1.3 MiddleWare

### 2.1.4 Parameter

### 2.1.5 Response

## 2.2 Injection
