import { ExResponse } from 'index';

export * from './api-collection.definition';
export * from './api.definition';

export type TypeDataHandler = (data: any, res: ExResponse) => void;
