import type { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/client';
import { AuthService } from '../services/authService';

const prisma = new PrismaClient();

const authService = new AuthService(prisma)

export function createContext({ req, res }: { req: Request; res: Response }) {
  return {
    req,
    res,
    authService,
  };
}

export type Context = ReturnType<typeof createContext> extends Promise<infer T> ? T : ReturnType<typeof createContext>;