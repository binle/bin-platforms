import { ApiProperty } from '@bachle/bin-core';

export declare namespace HomeController {}

export const HomeController = {
  path: '',
  children: {
    hello: 'hello',
  },
};

export class HelloQueries {
  @ApiProperty({ description: 'name of person', type: 'string', validation: { isRequired: true } })
  name: string;
}
