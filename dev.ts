import { spawn } from 'bun';

const spawnOptions = {
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
} as const;

const run = async () => {
  // Start database first
  const dbProcess = spawn(['bun', 'run', 'start:db'], {
    ...spawnOptions,
    cwd: './apps/api',
  });

  // Start Prisma Studio
  const prismaStudioProcess = spawn(['bun', 'run', 'prisma', 'studio'], {
    ...spawnOptions,
    cwd: './apps/api',
  });

  // Wait for database to be ready
  console.log('Waiting for database to be ready...');
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Start API after delay
  const apiProcess = spawn(['bun', 'run', 'dev'], {
    ...spawnOptions,
    cwd: './apps/api',
  });

  // Start frontend
  const frontendProcess = spawn(['bun', 'run', 'dev'], {
    ...spawnOptions,
    cwd: './apps/frontend',
  });

  const processes = [
    dbProcess,
    prismaStudioProcess,
    apiProcess,
    frontendProcess,
  ];

  // Handle cleanup on SIGINT
  process.on('SIGINT', () => {
    for (const process of processes) {
      process.kill();
    }
    process.exit(0);
  });

  // Wait for all processes to finish (if needed)
  await Promise.all(processes.map((process) => process.exited));
};

run();
