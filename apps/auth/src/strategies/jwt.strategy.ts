import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly userService: UsersService,
    ) {
        const secret = configService.get("JWT_SECRET");
        if (!secret) {
            throw new Error("JWT_SECRET is not set");
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request?.cookies?.Authentication,
            ]),
            secretOrKey: secret,
        });
    }

    async validate({userId}: TokenPayload ) {
        return this.userService.getUser({ _id: userId });
    }
}