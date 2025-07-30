import { router, publicProcedure } from './trpc';
import { RegisterSchema, LoginSchema } from '@crash-game-nx/shared-types';
import { isAuthed } from './middleware/isAuthed';
import { AuthService } from '../services/authService';

export const authRouter = router({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input }) => {
      return AuthService.register(input);
    }),

  login: publicProcedure.input(LoginSchema).mutation(async ({ input, ctx }) => {
    return AuthService.login(input, ctx);
  }),

  refreshToken: publicProcedure
    .mutation(async ({ ctx }) => {
      return AuthService.refreshToken(ctx);
    }),

  logout: publicProcedure
    .mutation(async ({ ctx }) => {
      return AuthService.logout(ctx);
    }),

  me: publicProcedure.use(isAuthed).query(async ({ ctx }) => {
    const userId = ctx.user.userId;
    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true },
    });
    if (!user) throw new Error('User not found');
    return user;
  }),
});
