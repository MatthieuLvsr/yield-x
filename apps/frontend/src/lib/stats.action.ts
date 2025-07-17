'use server';

import { treaty } from '@elysiajs/eden';
import type { App } from '@yield-x/api';

export const app = treaty<App>(process.env.NEXT_PUBLIC_API_BASE_URL as string);
