import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';
import jwt from 'jsonwebtoken';

export const isAuthed = middleware(async ({ ctx, next }) => {
  const token = ctx.req.cookies['access_token'];

  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
    };

    return next({
      ctx: {
        ...ctx,
        user: decoded,
      },
    });
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'jwt expired' });
    }
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid token' });
  }
});
