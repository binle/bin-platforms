import { ApiProperty } from '@bachle/bin-core';

export class Car {
  @ApiProperty({ description: 'name of car', type: 'string', validation: { isRequired: true } })
  name: string;

  @ApiProperty({ description: 'expired of car', type: 'date', validation: { isRequired: true } })
  expired: Date;
}
