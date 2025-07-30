import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext } from './trpc/context';
import { appRouter } from './trpc';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3333;

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);
app.use(cookieParser())
app.use(bodyParser.json());
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(port, () => {
  console.log(`🚀 tRPC backend running at http://localhost:${port}/trpc`);
});
