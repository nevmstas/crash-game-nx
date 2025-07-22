import type { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient();

export function createContext({ req, res }: { req: Request; res: Response }) {
  return {
    req,
    res,
    prisma,
  };
}

export type Context = ReturnType<typeof createContext> extends Promise<infer T> ? T : ReturnType<typeof createContext>;