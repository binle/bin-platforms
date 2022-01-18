/* eslint-disable @typescript-eslint/no-explicit-any */
export enum Level {
  debug,
  info,
  warn,
  error,
}

export interface LoggerOptions {
  level: LogFunctionNames;
  folderPath: string;
  filename: string;
  maxFileSize?: number;
  maxNumberFile?: number;
}

export type LogFunctionNames = 'error' | 'info' | 'warn' | 'debug';

export interface ILogger {
  error(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  debug(message: string, data?: any): void;
}
