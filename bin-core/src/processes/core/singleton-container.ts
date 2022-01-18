import { IContainer, Identifier } from 'src/definitions';

class SingletonContainer implements IContainer<Identifier> {
  private map: Map<Identifier, any> = new Map<Identifier, any>();

  bind<T>(key: Identifier, instance: T): void {
    if (this.map.get(key)) {
      throw new Error(`${key as string} is already bind.`);
    }
    this.map.set(key, instance);
  }
  unbind(key: Identifier): void {
    this.map.delete(key);
  }
  get<T>(key: Identifier): T {
    return this.map.get(key);
  }
}
export const singletonContainer: SingletonContainer = new SingletonContainer();
