import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';
import jwt from 'jsonwebtoken';

export const isAuthed = middleware(async ({ ctx, next }) => {
  const authHeader = ctx.req?.headers?.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
    };

    return next({
      ctx: {
        user: decoded,
      },
    });
  } catch {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid token' });
  }
});
