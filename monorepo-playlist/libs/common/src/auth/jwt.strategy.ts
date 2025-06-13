// libs/common/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../jwt/constants';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          console.log(request.cookies);
          return request?.cookies?.accessToken;
        }
      ]),
      secretOrKey: jwtConstants.accessSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
