import { router, publicProcedure } from '../trpc';
import { RegisterSchema, LoginSchema } from '@crash-game-nx/shared-types';
import { isAuthed } from '../middleware/isAuthed';

export const authRouter = router({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.authService.register(input);
    }),

  login: publicProcedure.input(LoginSchema).mutation(async ({ input, ctx }) => {
    const { token, refreshToken } = await ctx.authService.login(input, ctx);

    ctx.res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 3600000,
    });
    ctx.res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 86400000,
    });

    return { success: true };
  }),

  refreshToken: publicProcedure.mutation(async ({ ctx }) => {
    const refreshToken = ctx.req.cookies['refresh_token'];

    const { accessToken } = await ctx.authService.refreshToken(refreshToken);

    ctx.res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    return { success: true };
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    const refreshToken = ctx.req.cookies['refresh_token'];
    await ctx.authService.logout(refreshToken);
    ctx.res.clearCookie('access_token');
    ctx.res.clearCookie('refresh_token');

    return { success: true };
  }),

  me: publicProcedure.use(isAuthed).query(async ({ ctx }) => {
    const userId = ctx.user.userId;
    const { user } = await ctx.authService.me(userId)
    return user;
  }),
});
