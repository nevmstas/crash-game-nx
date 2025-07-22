import { router, publicProcedure } from './trpc';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterSchema, LoginSchema } from '@crash-game-nx/shared-types';
import { isAuthed } from './middleware/isAuthed';

export const authRouter = router({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existingUser) throw new Error('Email already registered');

      const hashed = await bcrypt.hash(input.password, 10);

      const user = await ctx.prisma.user.create({
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
    }),

  login: publicProcedure.input(LoginSchema).mutation(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new Error('Invalid email or password');

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    );

    return { token };
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

  log: publicProcedure.query(() => 'hello')
});
