import Elysia from 'elysia';
import { prismaErrorPlugin } from '../plugins/prisma.plugin';

export const statRouter = new Elysia({
  name: 'stats',
  prefix: '/stats',
  tags: ['Stats'],
}).use(prismaErrorPlugin('Stat'));
