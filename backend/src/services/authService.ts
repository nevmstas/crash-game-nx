import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/client';
import { LoginInput, RegisterInput } from '@crash-game-nx/shared-types';
import { Context } from '../trpc/context';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(input: RegisterInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existingUser) throw new Error('Email already registered');
    const hashed = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashed,
      },
    });
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }

  async login(input: LoginInput, ctx: Context) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new Error('Invalid email or password');
    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) throw new Error('Invalid email or password');
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '2h',
    });
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return { token, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const dbToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      if (!dbToken) throw new Error('Invalid refresh token');
      if (dbToken.expiresAt < new Date())
        throw new Error('Refresh token expired');

      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (!user) throw new Error('User not found');

      await this.prisma.refreshToken.delete({ where: { token: refreshToken } });

      const newRefreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await this.prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
          expiresAt,
        },
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      return { accessToken: token };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
    }

    return { success: true };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true },
    });
    if (!user) throw new Error('User not found');

    return { user }
  }
}
