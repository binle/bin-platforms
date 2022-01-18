/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';

export class ValidationUtil {
  private static emailRegExp = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$');

  static isValidEmail(email: string): boolean {
    return ValidationUtil.emailRegExp.test(email);
  }
  static isSameDateTime(d1?: Date, d2?: Date): boolean {
    if (d1 && d2) {
      const m1 = moment(d1);
      const m2 = moment(d2);
      if (m1.isValid() && m2.isValid() && m1.toDate().getTime() === m2.toDate().getTime()) {
        return true;
      }
    }
    return false;
  }
}
