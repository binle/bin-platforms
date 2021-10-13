export * from 'pg';

declare module 'pg' {
  export interface PoolClient {
    txStatus?: boolean;
    poolKey?: string;
  }
}
