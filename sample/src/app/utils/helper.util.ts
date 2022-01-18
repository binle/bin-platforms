/* eslint-disable @typescript-eslint/no-explicit-any */
import fsExtra from 'fs-extra';
import { merge } from 'lodash';
import path from 'path';
import * as uuid from 'uuid';

export class HelperUtil {
  static getFileExtensions(folderPath: string): string[] {
    const getAllExtensions = (folderPath: string) => {
      let results: { [key: string]: boolean } = {};
      const listItem = fsExtra.readdirSync(folderPath);
      for (const item of listItem) {
        const itemPath = path.join(folderPath, item);
        const stat = fsExtra.statSync(itemPath);
        if (stat.isFile()) {
          results[path.extname(item).substring(1)] = true;
        } else if (stat.isDirectory()) {
          results = merge(results, getAllExtensions(itemPath));
        }
      }
      return results;
    };
    return Object.keys(getAllExtensions(folderPath));
  }
}

export const uuidV4 = (): string => uuid.v4();
