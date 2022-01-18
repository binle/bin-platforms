/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiController, ApiResponseSuccess, Get, IObjectSchema, IStringSchema, Queries } from '@bachle/bin-core';
import { HomeController } from 'src/definitions';

export const StringSchema: IStringSchema = { type: 'string' };

const querySchema: IObjectSchema = {
  type: 'object',
  properties: {
    name: StringSchema,
  },
};

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
