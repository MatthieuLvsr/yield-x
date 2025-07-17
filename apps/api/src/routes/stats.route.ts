import Elysia from 'elysia';
import prisma from '../lib/prisma';
import { prismaErrorPlugin } from '../lib/prisma.plugin';

export const statRouter = new Elysia({
  name: 'stats',
  prefix: '/stats',
  tags: ['Stats'],
})
  .use(prismaErrorPlugin('Stat'))
  .get('/', async ({ status }) => {
    const stats = await prisma.stats.findUnique({ where: { id: 'global' } });
    if (!stats) {
      return status(500);
    }
    return {
      ...stats,
      tvl: Number(stats.tvl).toFixed(2),
    };
  });
