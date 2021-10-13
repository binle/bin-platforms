/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiController,
  ApiResponseError,
  ApiResponseSuccess,
  Body,
  Headers,
  IStringSchema,
  newHttpError,
  Post,
} from '@bachle/bin-core';
import { Header, Person, PersonController } from 'src/definitions';

@ApiController({
  name: Symbol('PersonController'),
  path: PersonController.path,
})
export class PersonControllerImpl {
  @Post(PersonController.children.create, 'Create a person')
  @ApiResponseSuccess({ type: 'string' } as IStringSchema, 'Return create success response')
  @ApiResponseError(newHttpError({ message: 'invalid user', status: 401 }))
  helloAnonymous(@Body() person: Person, @Headers() { apiKey }: Header): string {
    console.log({ apiKey });
    return `hello ${person || 'anonymous'}! Welcome to my service.`;
  }
}
