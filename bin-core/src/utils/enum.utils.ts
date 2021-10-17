/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export type EnumValueType = string | number;

export class EnumUtil {
  static getNamesAndValues<T extends EnumValueType>(enumType: any): { name: string; value: T }[] {
    return this.getNames(enumType).map((_name) => {
      return { name: _name, value: enumType[_name] as T };
    });
  }

  static getNames(enumType: any): string[] {
    return Object.keys(enumType).filter((key) => isNaN(+key));
  }

  static getNameFromValue<T extends EnumValueType>(enumType: any, value: T): string | null {
    const all = this.getNamesAndValues(enumType).filter((pair) => pair.value === value);
    return all.length == 1 ? all[0].name : null;
  }

  static getValues<T extends EnumValueType>(enumType: any): T[] {
    return this.getNames(enumType).map((name) => enumType[name]) as T[];
  }
}

export const getEnumValues = (enumType: any) => EnumUtil.getValues(enumType);
