import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;