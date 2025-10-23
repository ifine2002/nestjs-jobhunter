import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/common/interfaces/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.rolesService.findOne(userRole._id);

        const objUser = { ...user.toObject(), permissions: temp?.permissions ?? [] };
        return objUser;
      }
    }
    return null;
  }
  async login(user: IUser, res: Response) {
    const { _id, name, email, role, permissions } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    //create refresh token
    const refresh_token = this.createRefeshToken(payload);

    //update refresh token in db
    this.usersService.updateRefreshToken(refresh_token, _id);

    //set refresh_token cookies
    res.cookie('refresh_token', refresh_token, {
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      httpOnly: true,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
        permissions,
      },
    };
  }
  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.register(registerUserDto);
    return {
      _id: user?._id,
      createdAt: user?.createdAt,
    };
  }

  createRefeshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, res: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token login',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };

        //create new refresh token
        const new_refresh_token = this.createRefeshToken(payload);

        //update refresh token in db
        this.usersService.updateRefreshToken(new_refresh_token, _id.toString());

        //fetch user's role
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.rolesService.findOne(userRole._id);

        //set refresh_token cookies
        res.cookie('refresh_token', new_refresh_token, {
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
          httpOnly: true,
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role,
            permissions: temp?.permissions ?? [],
          },
        };
      } else {
        throw new BadRequestException('Refresh token is invalid');
      }
    } catch (error) {
      throw new BadRequestException('Refresh token is invalid');
    }
  };

  logout = async (res: Response, user: IUser) => {
    await this.usersService.updateRefreshToken('', user._id);
    res.clearCookie('refresh_token');
    return 'ok';
  };
}
