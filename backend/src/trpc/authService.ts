import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/client';
import { LoginInput, RegisterInput } from '@crash-game-nx/shared-types';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingUser) throw new Error('Email already registered');
    const hashed = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
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

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new Error('Invalid email or password');
    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) throw new Error('Invalid email or password');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });
    return { token, refreshToken };
  }

  static async refreshToken(input: { refreshToken: string }) {
    try {
      const dbToken = await prisma.refreshToken.findUnique({ where: { token: input.refreshToken } });
      if (!dbToken) throw new Error('Invalid refresh token');
      if (dbToken.expiresAt < new Date()) throw new Error('Refresh token expired');
      const payload = jwt.verify(input.refreshToken, JWT_REFRESH_SECRET) as any;
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) throw new Error('User not found');
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '2h' }
      );
      return { token };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
} 