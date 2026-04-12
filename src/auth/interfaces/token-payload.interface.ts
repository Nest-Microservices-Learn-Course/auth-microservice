import { JwtPayload } from './';

export interface TokenPayload extends JwtPayload {
  iat: number;
  exp: number;
}
