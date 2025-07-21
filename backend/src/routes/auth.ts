import express from 'express';
import { PrismaClient } from '../../generated/prisma/client';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
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
});

export default router;