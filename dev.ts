import { spawn } from 'bun';

const spawnOptions = {
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
} as const;

const run = async () => {
  // Run all scripts in parallel
  const processes = [
    spawn(['bun', 'run', 'prisma', 'dev'], {
      ...spawnOptions,
      cwd: './apps/api',
    }),
    spawn(['bun', 'run', 'dev'], { ...spawnOptions, cwd: './apps/api' }),
    spawn(['bun', 'run', 'prisma', 'studio'], {
      ...spawnOptions,
      cwd: './apps/api',
    }),
    spawn(['bun', 'run', 'dev'], { ...spawnOptions, cwd: './apps/frontend' }),
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
