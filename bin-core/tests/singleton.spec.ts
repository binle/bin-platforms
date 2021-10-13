import { Injectable, InjectToProperty, singletonContainer } from '../src';

@Injectable('test1')
class Test1 {
  public sum(a: number, b: number) {
    return a + b;
  }
}

@Injectable('test2')
class Test2 {
  @InjectToProperty('test1')
  private test1!: Test1;
  private tempData: number;

  constructor() {
    this.tempData = this.test1.sum(1, 1);
  }

  public getTempData() {
    return this.tempData;
  }

  public double(a: number) {
    return this.test1.sum(a, a);
  }
}

class Test3 {
  @InjectToProperty('test1')
  private test1!: Test1;
  private tempData: number;

  constructor() {
    this.tempData = this.test1.sum(2, 2);
  }

  public getTempData() {
    return this.tempData;
  }
}

describe('singleton injection', () => {
  test('exist in container and field is set', () => {
    const test3: Test3 = new Test3();
    expect(test3.getTempData()).toEqual(4);

    const test1: Test1 = singletonContainer.get('test1');
    const test2: Test2 = singletonContainer.get('test2');
    expect(test1).not.toEqual(null);
    expect(test2).not.toEqual(null);
    expect(test1).not.toEqual(undefined);
    expect(test2).not.toEqual(undefined);
    expect(test1.sum(1, 2)).toEqual(3);
    expect(test2.double(2)).toEqual(4);
    expect(test2.getTempData()).toEqual(2);
  });
});
