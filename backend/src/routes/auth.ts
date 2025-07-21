import express from 'express';
import { PrismaClient } from '../../generated/prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth';
import { LoginRequest, RegisterRequest } from '../types/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/register',
  async (req: express.Request<{}, {}, RegisterRequest>, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, username, password: hashed },
    });

    return res.status(201).json({
      message: 'User registered',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  }
);

router.post(
  '/login',
  async (req: express.Request<{}, {}, LoginRequest>, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Missing credentials' });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    );

    return res.json({ token });
  }
);

router.get('/me', authenticate, async (req, res) => {
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
});

export default router;
