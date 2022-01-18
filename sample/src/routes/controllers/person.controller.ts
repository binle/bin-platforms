/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiController,
  ApiResponseError,
  ApiResponseSuccess,
  Body,
  Headers,
  HttpCodeStatuses,
  IStringSchema,
  newBinHttpError,
  Post,
} from '@bachle/bin-core';
import { BinHttpErrorCodes, Header, Person, PersonController } from 'src/definitions';

@ApiController({
  name: Symbol('PersonController'),
  path: PersonController.path,
})
export class PersonControllerImpl {
  @Post(PersonController.children.create, 'Create a person')
  @ApiResponseSuccess({ type: 'string' } as IStringSchema, 'Return create success response')
  @ApiResponseError([
    newBinHttpError(HttpCodeStatuses[401]),
    newBinHttpError({ ...BinHttpErrorCodes.invalid_authorized_state, ...HttpCodeStatuses[403] }),
  ])
  helloAnonymous(@Headers() { apiKey }: Header, @Body() person: Person): string {
    console.log({ apiKey });
    return `hello ${person || 'anonymous'}! Welcome to my service.`;
  }
}
