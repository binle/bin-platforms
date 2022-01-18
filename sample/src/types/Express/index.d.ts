import { IJWTUser } from 'src/definitions';

declare global {
  namespace Express {
    interface Request {
      user?: IJWTUser;
    }
  }
}
