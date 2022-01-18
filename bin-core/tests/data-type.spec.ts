/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  TypeConstructor,
  getInjectedPramsOfPropertyTypeInObject,
  ApiRequest,
  ApiPropertyKey,
  ApiProperty,
  getSchemaOfType,
  getSchemaOfInstance,
  IArraySchema,
} from './../src';

export enum PersonStatus {
  FINE,
  OK = 'OK',
  NOK = 'NOK',
}
export class Person {
  /**
   * Name of person
   */
  @ApiProperty({ type: 'string', description: 'description name' })
  name: string;

  @ApiProperty({ type: 'number', description: 'description age' })
  age: number;

  @ApiProperty({ type: 'date', description: 'description bod' })
  bod: Date;

  @ApiProperty({ type: 'boolean', description: 'description gender' })
  gender: boolean;

  @ApiProperty({ type: 'enum', description: 'description status' })
  status: PersonStatus;
}

export class Car {
  /**
   * Name of person
   */
  @ApiProperty({
    type: 'string',
    validation: { isRequired: true },
    description: 'description manufactory',
  })
  manufactory: string;
}

export class TestData {
  /**
   * Name of person
   */
  @ApiProperty({ type: 'object', description: 'description person' })
  person: Person;

  @ApiProperty({
    description: 'description cars',
    type: 'array',
    itemSchema: { propertyType: Car },
  } as IArraySchema)
  cars: Car[];
}

export class ControllerTest {
  @ApiRequest()
  doSomeThing(data: TestData) {
    console.log('Hello', data.person.name);
  }
}

describe('singleton injection', () => {
  test('exist in container and field is set', () => {
    const instance = new ControllerTest();

    // const prototype = Object.getPrototypeOf(instance);
    // console.log('run 1', { prototype });

    // const targetCallback = prototype['doSomeThing'];
    // console.log('run 3', { targetCallback });

    const types: TypeConstructor[] = Reflect.getMetadata(
      'design:paramtypes',
      instance,
      'doSomeThing'
    );
    const firstParamsType = types[0];
    const testDataInstance = firstParamsType.prototype;
    // console.log('testDataInstance', testDataInstance.constructor);

    const personType = getInjectedPramsOfPropertyTypeInObject(testDataInstance, 'person');
    // console.log('personType', personType, personType.propertyType.constructor);

    const personInstance = personType.propertyType[ApiPropertyKey]();
    console.log(
      '================================',
      JSON.stringify(getSchemaOfType(testDataInstance.constructor), null, 2)
    );

    console.log(
      '22222222222222222222222222222222222',
      JSON.stringify(getSchemaOfInstance(new Car()), null, 2)
    );

    const nameType = getInjectedPramsOfPropertyTypeInObject(personInstance, 'name');
    console.log('nameType', nameType.propertyType.name);

    const ageType = getInjectedPramsOfPropertyTypeInObject(personInstance, 'age');
    console.log('ageType', ageType.propertyType.name);

    const bodType = getInjectedPramsOfPropertyTypeInObject(personInstance, 'bod');
    console.log('bodType', bodType.propertyType.name);

    const genderType = getInjectedPramsOfPropertyTypeInObject(personInstance, 'gender');
    console.log('genderType', genderType.propertyType.name);

    const statusType = getInjectedPramsOfPropertyTypeInObject(personInstance, 'status');
    console.log('statusType', statusType.propertyType.name);

    // const carsType = getInjectedPramsOfPropertyTypeInObject(testDataInstance, 'cars');
    // console.log('carsType', carsType, carsType.propertyType);
    // console.log(
    //   'carsType constructor',
    //   carsType.constructor,
    //   carsType.constructor === personType.constructor,
    // carsType.propertyType.constructor === personType.propertyType.constructor
    // );

    // console.log('carInstance', carsType.propertyType);

    // const carInstance = carsType.propertyType[ApiPropertyKey]();
    // // console.log('carInstance', carInstance);

    // const manufactoryType = getInjectedPramsOfPropertyTypeInObject(carInstance, 'manufactory');
    // // console.log('manufactoryType', manufactoryType);

    expect(1).toEqual(1);
  });
});

// describe('test injection', () => {
//   test('test sample', () => {
//     expect(1).toEqual(1);
//   });
// });
