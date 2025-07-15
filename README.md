# Yield-X

A monorepo for the Yield-X project containing a Solana smart contract, API backend, and Next.js frontend.

## Quick Start

Install dependencies and start all services:

```bash
bun install
bun dev
```

This will start:
- API server with Prisma Studio
- Frontend development server
- Database migrations

## Project Structure

- `apps/contract` - Solana smart contract (Anchor framework)
- `apps/api` - Backend API (Elysia + Prisma)
- `apps/frontend` - Web interface (Next.js + React)

## apps/contract

Solana smart contract built with Anchor framework.

### Prerequisites
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation)

### Local Development

```bash
cd apps/contract

# Start local Solana validator
solana-test-validator

# Set cluster to localhost
solana config set -ul

# Build and test
anchor build
anchor test --skip-local-validator

# Deploy locally
anchor deploy
```

### Deploy to Devnet

1. Update `Anchor.toml`:
```toml
[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"
```

2. Rebuild and deploy:
```bash
anchor build
anchor deploy
```

Available scripts:
- `bun run build` - Build the contract
- `bun run test` - Run tests with local validator
- `bun run test:unit` - Run tests without validator
- `bun run start:validator` - Start Solana test validator
- `bun run stop:validator` - Stop Solana test validator

## apps/api

Backend API built with Elysia and Prisma for database management.

### Setup

```bash
cd apps/api

# Run database migrations
bun run db:migrate

# Seed the database (optional)
bun run seed

# Start development server
bun run dev
```

Available scripts:
- `bun run dev` - Start development server with auto-reload
- `bun run db:migrate` - Run database migrations
- `bun run db:reset` - Reset database
- `bun run db:generate` - Generate Prisma client
- `bun run seed` - Seed database with sample data

The API includes:
- OpenAPI documentation via Swagger
- CORS support
- OpenTelemetry integration

## apps/frontend

Next.js frontend with React 19, Tailwind CSS, and Solana wallet integration.

### Setup

```bash
cd apps/frontend

# Start development server
bun run dev
```

### Environment Modes

**Development (real data):**
```bash
bun run dev
```

**Demo mode (mock data):**
```bash
bun run dev:fake
```

Available scripts:
- `bun run dev` - Development server with real data
- `bun run dev:fake` - Development server with mock data
- `bun run build` - Production build
- `bun run build:fake` - Production build with mock data
- `bun run start` - Start production server

Features:
- Solana wallet integration
- 3D visualizations with Three.js
- Interactive charts with Highcharts
- Responsive design with Tailwind CSS
- Component library with Radix UI

## Development

### Code Quality

The project uses Ultracite for formatting and linting:

```bash
bun run format
```

### Git Hooks

Lefthook is configured for pre-commit hooks to ensure code quality.

## Requirements

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [Node.js](https://nodejs.org/) - For compatibility
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) - For contract development
- [Anchor](https://www.anchor-lang.com/docs/installation) - Solana framework
