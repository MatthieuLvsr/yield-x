# Yield-X

A monorepo for the Yield-X project containing a Solana smart contract, API backend, and Next.js frontend.

## Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        UI[Web Interface]
        WA[Wallet Adapter]
        3D[3D Visualizations]
        Charts[Charts & Analytics]
        Hooks[React Hooks]
    end

    subgraph "API Backend (Elysia)"
        API[REST API Server]
        EL[Event Listener]
        Routes[API Routes]
        Services[Services]
        Prisma[Prisma ORM]
    end

    subgraph "Smart Contract (Solana/Anchor)"
        SC[Yield-X Contract]
        Instructions[Contract Instructions]
        States[Program States]
        Events[Event Emissions]
    end

    subgraph "Database"
        DB[(PostgreSQL)]
        Stats[Statistics]
        Migrations[Schema Migrations]
    end

    subgraph "Solana Blockchain"
        SOL[Solana Network]
        Tokens[SPL Tokens]
        Wallets[User Wallets]
        PDAs[Program Derived Accounts]
    end

    subgraph "External Services"
        TokenAPI[Token Metadata API]
        PriceAPI[Price Services]
    end

    %% Frontend connections
    UI --> WA
    UI --> API
    WA --> SOL
    Hooks --> API
    Hooks --> SC

    %% API connections
    API --> Routes
    API --> Services
    Routes --> Prisma
    EL --> SC
    EL --> Events
    EL --> Prisma
    Services --> TokenAPI
    Services --> PriceAPI

    %% Database connections
    Prisma --> DB
    Stats --> DB
    Migrations --> DB

    %% Smart contract connections
    SC --> Instructions
    SC --> States
    SC --> Events
    SC --> SOL
    Instructions --> PDAs
    States --> Tokens

    %% Blockchain connections
    SOL --> Tokens
    SOL --> Wallets
    SOL --> PDAs

    %% Data flow
    UI -.->|User Actions| WA
    WA -.->|Transactions| SC
    SC -.->|Events| EL
    EL -.->|Updates| Stats
    API -.->|Analytics| UI

    classDef frontend fill:#e1f5fe
    classDef backend fill:#e8f5e8
    classDef contract fill:#fff3e0
    classDef database fill:#f3e5f5
    classDef blockchain fill:#e3f2fd
    classDef external fill:#fce4ec

    class UI,WA,3D,Charts,Hooks frontend
    class API,EL,Routes,Services,Prisma backend
    class SC,Instructions,States,Events contract
    class DB,Stats,Migrations database
    class SOL,Tokens,Wallets,PDAs blockchain
    class TokenAPI,PriceAPI external
```

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

## Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [Node.js](https://nodejs.org/) v18+
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://www.anchor-lang.com/docs/installation) v0.28+
- PostgreSQL 14+

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
