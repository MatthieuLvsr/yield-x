import { cors } from '@elysiajs/cors';
import { opentelemetry } from '@elysiajs/opentelemetry';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { startEventListener } from './contract/event.listener';
import { contractRouter } from './routes/contract.route';
import { statRouter } from './routes/stats.route';

const formattedDate = () =>
  new Date().toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

let startTime = performance.now();

const app = new Elysia()
  .use(opentelemetry())
  .use(
    cors({
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Yield-X DApp Analytics API',
          version: '1.0.0',
          description:
            'Analytics API for tracking DeFi protocol interactions, user behavior, and platform metrics',
        },
      },
    })
  )
  .onTransform(({ body, params, path, request: { method } }) => {
    startTime = performance.now();
    console.log(`${formattedDate()} - ${method} ${path}`, {
      body,
      params,
    });
  })
  .onAfterResponse(({ path, set }) => {
    console.log(`${formattedDate()} - RESPONSE ${path}`, {
      performance: `${((performance.now() - startTime) / 1000).toFixed(2)} s`,
      status: set.status,
    });
  })
  .get('/', () => ({
    message: 'Yield-X Analytics API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }))
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }))
  .use(statRouter)
  .use(contractRouter)
  .listen(process.env.API_PORT || 3005);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

startEventListener();
