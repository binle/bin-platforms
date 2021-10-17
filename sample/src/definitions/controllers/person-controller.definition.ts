import { ApiProperty, ApiPropertyOptional, IArraySchema, IStringSchema } from '@bachle/bin-core';
import { Car as Car2 } from './test';

/* eslint-disable @typescript-eslint/no-explicit-any */
export declare namespace PersonController {}

export class Car {
  @ApiProperty({ description: 'name of car', type: 'string' })
  name: string;
}

export class Profile {
  @ApiProperty({ description: 'identity number', type: 'string' })
  identity: string;
}

export class Person {
  @ApiProperty()
  name: string;

  @ApiProperty({
    validation: { format: 'isEmail' },
  } as IStringSchema)
  email: string;

  @ApiPropertyOptional({
    itemSchema: { propertyType: Car },
  } as IArraySchema)
  car: Car[];

  @ApiPropertyOptional({ description: ' Main car ' })
  mainCar: Car2;

  @ApiProperty()
  profile: Profile;

  @ApiProperty()
  temp: { [key: string]: string };

  @ApiPropertyOptional()
  marriedPerson: Person;
}

export class Header {
  @ApiProperty({ description: 'key to detect server', type: 'string' })
  apiKey: string;
}

export const PersonController = {
  path: 'api/person',
  children: {
    create: '',
    update: '',
    list: '',
    detail: ':id',
    delete: ':id',
  },
};
