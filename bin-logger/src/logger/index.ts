/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { ILogger, LogFunctionNames, LoggerOptions } from 'src/definitions';
import { ILogObject, Logger } from 'tslog';

export class BinLogger implements ILogger {
  private filename = 'data.log';
  private folderPath = __dirname;
  private level: LogFunctionNames;
  private maxFileSize?: number;
  private maxNumberFile?: number;

  private tsLogger = new Logger();

  private fileCount = 1;
  private rootFilePath: string;

  constructor({ filename, folderPath, level, maxFileSize, maxNumberFile }: LoggerOptions) {
    this.filename = filename || this.filename;
    this.folderPath = folderPath;
    this.level = level;
    this.maxFileSize = maxFileSize;
    this.maxNumberFile = maxNumberFile;
    this.validate();
    this.rootFilePath = path.join(this.folderPath, this.filename);
    this.logToTransport = this.logToTransport.bind(this);
    this.tsLogger.attachTransport(
      {
        silly: this.logToTransport,
        debug: this.logToTransport,
        trace: this.logToTransport,
        info: this.logToTransport,
        warn: this.logToTransport,
        error: this.logToTransport,
        fatal: this.logToTransport,
      },
      this.level
    );
  }

  public error(message: string, data?: any) {
    this.tsLogger.error(message, data);
  }
  public info(message: string, data?: any) {
    this.tsLogger.info(message, data);
  }
  public warn(message: string, data?: any) {
    this.tsLogger.warn(message, data);
  }
  public debug(message: string, data?: any) {
    this.tsLogger.debug(message, data);
  }

  private validate(): void {
    if (!this.folderPath) throw new Error('Folder path is required!');
    fs.accessSync(this.folderPath, fs.constants.W_OK);

    if (this.maxFileSize && (!this.maxNumberFile || this.maxNumberFile < 0)) {
      throw new Error('Option maxFileSize required option maxNumberFile!');
    }
  }
  private logToTransport(data: ILogObject) {
    if (!fs.existsSync(this.rootFilePath)) {
      fs.writeFileSync(this.rootFilePath, '');
    }
    if (!this.maxFileSize || !this.maxNumberFile) {
      return fs.appendFileSync(this.rootFilePath, JSON.stringify(data) + 'r\n');
    }

    const currentFileSizeInMB = fs.statSync(this.rootFilePath).size;
    if (currentFileSizeInMB > this.maxFileSize) {
      for (let i = Math.min(this.fileCount, this.maxNumberFile); i > 0; i--) {
        fs.renameSync(this.getFilePathAt(i - 1), this.getFilePathAt(i));
      }
      this.fileCount = Math.min(this.fileCount + 1, this.maxNumberFile);
      fs.writeFileSync(this.rootFilePath, '');
    }
    return fs.appendFileSync(this.rootFilePath, this.format(data));
  }

  private format(data: ILogObject) {
    const message = data.argumentsArray[0];
    const remainData = data.argumentsArray.filter((_item, index) => index > 0);
    let result = `[${data.date.toISOString()}] ${data.logLevel.toUpperCase()} - ${message} \r\n`;
    remainData.forEach((item) => item && (result += `${JSON.stringify(item, null, 2)} \r\n`));
    return result;
  }

  private getFilePathAt(index: number) {
    if (index === 0) {
      return path.join(this.folderPath, this.filename);
    }
    const ext = path.extname(this.filename);
    const basename = path.basename(this.filename, ext);
    return path.join(this.folderPath, `${basename}_${index}`) + ext;
  }
}

export const createLogger = (opt: LoggerOptions): BinLogger => {
  return new BinLogger(opt);
};
