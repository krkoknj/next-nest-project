import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import { jwtConstants } from "../jwt/constants";
import { ClientProxy } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    console.log(request.cookies);
                    return request?.cookies?.refreshToken;
                }
            ]),
            secretOrKey: jwtConstants.refreshSecret,
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.cookies?.refreshToken;
        const result = this.userService.send('compareUserRefreshToken', { refreshToken, email: payload.email });

        if (!result) throw new UnauthorizedException('Invalid refresh token');

        return { id: payload.id, email: payload.email };
    }
}