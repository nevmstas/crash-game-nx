import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext } from './trpc/context';
import { appRouter } from './trpc';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
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

