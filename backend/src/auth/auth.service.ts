
import { Injectable, UnauthorizedException }  //This creates an HTTP 401 Unauthorized response.
from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';   //after a successful login, we want to create a token.
import bcrypt from 'bcrypt'; //to check whether that password matches the stored hash.
import { db } from '../prisma/db.js'; //imports the database connection

@Injectable()
export class AuthService //we put authentication-related logic here.
 {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await db.orm.public.User
      .where({ email })
      .first();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password'); //401 unauthorized
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,           //NestJS uses  JWT_SECRET to sign the token
      email: user.email,
    });

    return {
      access_token: accessToken,
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }, // frontend recieves the token
    };
  }

   async register(name: string, email: string, password: string) {
    const existingUser = await db.orm.public.User
      .where({ email })
      .first();

    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.orm.public.User.create({
      name,
      email,
      passwordHash,
    });

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}