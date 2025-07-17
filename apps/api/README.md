# Yield-X DApp Analytics API

A comprehensive analytics API for tracking DeFi protocol interactions, user behavior, and platform metrics. Built with ElysiaJS, Prisma, and TypeScript.

## 🚀 Features

- **User Management**: Track wallet addresses, ENS names, and user profiles
- **Transaction Analytics**: Monitor blockchain transactions with detailed metadata
- **Protocol Integration**: Support for multiple DeFi protocols (Uniswap, Aave, Compound, etc.)
- **Pool Analytics**: Track yield farming pools, TVL, APY, and performance metrics
- **Position Tracking**: Monitor user positions across different pools
- **Event Analytics**: Comprehensive event tracking for user interactions
- **Session Management**: User session tracking with device and location data
- **Real-time Statistics**: Dashboard metrics and KPIs
- **Time Series Data**: Historical analytics with customizable time ranges
- **Leaderboards**: User rankings by volume, PnL, transactions, and more

## 📋 Prerequisites

- [Bun](https://bun.sh) runtime
- PostgreSQL database
- Node.js 18+ (for compatibility)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yield-x/api
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/yield_x_analytics"
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   bun run db:generate
   
   # Run database migrations
   bun run db:migrate
   
   # Seed the database with sample data
   bun run seed
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

The API will be available at `http://localhost:3005`

## 📖 API Documentation

### Interactive Documentation
Visit `http://localhost:3005/api/swagger` for interactive API documentation powered by Swagger UI.

### Base URL
```
http://localhost:3005/api
```

### Main Endpoints

#### Users
- `POST /analytics/users` - Create a new user
- `GET /analytics/users` - Get users list
- `GET /analytics/users/:id` - Get user by ID
- `GET /analytics/users/wallet/:address` - Get user by wallet address
- `PUT /analytics/users/:id` - Update user
- `DELETE /analytics/users/:id` - Deactivate user
- `GET /analytics/users/:id/dashboard` - Get user dashboard data
- `GET /analytics/users/:id/positions` - Get user positions

#### Transactions
- `POST /analytics/transactions` - Record a new transaction
- `GET /analytics/transactions` - Get transactions list
- `GET /analytics/transactions/hash/:hash` - Get transaction by hash

#### Protocols
- `POST /analytics/protocols` - Create a new protocol
- `GET /analytics/protocols` - Get all protocols
- `GET /analytics/protocols/:id` - Get protocol by ID

#### Pools
- `POST /analytics/pools` - Create a new pool
- `GET /analytics/pools` - Get all pools
- `GET /analytics/pools/:id` - Get pool by ID

#### Positions
- `POST /analytics/positions` - Create or update user position

#### Events
- `POST /analytics/events` - Track a new event
- `GET /analytics/events` - Get events list

#### Sessions
- `POST /analytics/sessions` - Create a new session
- `PUT /analytics/sessions/:id/end` - End a session

#### Analytics
- `GET /analytics/analytics/dashboard` - Get dashboard statistics
- `POST /analytics/analytics/generate/user/:userId` - Generate user analytics
- `POST /analytics/analytics/generate/pool/:poolId` - Generate pool analytics
- `POST /analytics/analytics/generate/platform` - Generate platform analytics

#### Statistics
- `GET /stats/overview` - Get platform overview statistics
- `GET /stats/top-pools` - Get top performing pools
- `GET /stats/leaderboard` - Get user leaderboard
- `GET /stats/timeseries/:metric` - Get time series data
- `GET /stats/protocols/compare` - Compare protocols
- `GET /stats/performance` - Get performance metrics

### Example Requests

#### Create a User
```bash
curl -X POST http://localhost:3005/api/analytics/users \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "ensName": "alice.eth",
    "username": "AliceDeFi",
    "email": "alice@example.com"
  }'
```

#### Record a Transaction
```bash
curl -X POST http://localhost:3005/api/analytics/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "blockNumber": "18500000",
    "blockHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "transactionIndex": 0,
    "fromAddress": "0x1234567890123456789012345678901234567890",
    "toAddress": "0x0987654321098765432109876543210987654321",
    "value": "1000000000000000000",
    "gasUsed": "21000",
    "gasPrice": "20000000000",
    "status": "SUCCESS",
    "type": "DEPOSIT"
  }'
```

#### Track an Event
```bash
curl -X POST http://localhost:3005/api/analytics/events \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "eventType": "BUTTON_CLICK",
    "eventName": "connect_wallet_clicked",
    "data": {
      "page": "/dashboard",
      "button": "connect-wallet"
    }
  }'
```

## 🗄️ Database Schema

The API uses a comprehensive PostgreSQL schema with the following main entities:

- **Users**: Wallet addresses, profiles, and metadata
- **Transactions**: Blockchain transaction data
- **Protocols**: DeFi protocol information
- **Pools**: Yield farming and liquidity pools
- **UserPositions**: User positions in pools
- **UserAnalytics**: Daily user metrics
- **PoolAnalytics**: Daily pool metrics
- **PlatformAnalytics**: Daily platform metrics
- **Sessions**: User session tracking
- **Events**: Event tracking for analytics

### Key Relationships
- Users have many Transactions, Positions, Sessions, and Events
- Protocols have many Pools and Transactions
- Pools have many Transactions, Positions, and Analytics
- Sessions have many Events

## 🔧 Development

### Available Scripts

```bash
# Development
bun run dev              # Start development server with hot reload

# Database
bun run db:generate      # Generate Prisma client
bun run db:migrate       # Run database migrations
bun run db:reset         # Reset database (WARNING: Deletes all data)
bun run seed             # Seed database with sample data

# Utilities
bun run start:db         # Start Prisma dev tools
```

### Project Structure

```
src/
├── lib/
│   └── prisma.ts        # Prisma client configuration
├── routes/
│   ├── analytics.ts     # Main analytics routes
│   └── stats.ts         # Statistics routes
├── services/
│   └── analytics.ts     # Analytics service layer
├── types/
│   └── analytics.ts     # TypeScript type definitions
├── scripts/
│   └── seed.ts          # Database seeding script
└── index.ts             # Main application entry point

prisma/
└── schema.prisma        # Database schema definition
```

### Adding New Features

1. **Define Types**: Add new types in `src/types/analytics.ts`
2. **Update Schema**: Modify `prisma/schema.prisma`
3. **Create Migration**: Run `bun run db:migrate`
4. **Add Service Methods**: Extend `src/services/analytics.ts`
5. **Add Routes**: Create new routes in appropriate files
6. **Update Documentation**: Update this README

## 🚦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3005 |

## 🚀 Deployment

### Production Deployment

1. **Set up production database**
   ```bash
   # Set production DATABASE_URL
   export DATABASE_URL="postgresql://..."
   ```

2. **Install dependencies**
   ```bash
   bun install --production
   ```

3. **Run migrations**
   ```bash
   bun run db:migrate
   ```

4. **Generate Prisma client**
   ```bash
   bun run db:generate
   ```

5. **Start the server**
   ```bash
   bun run src/index.ts
   ```

### Docker Deployment

```dockerfile
FROM oven/bun:1.2.18

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run db:generate

EXPOSE 3005

CMD ["bun", "run", "src/index.ts"]
```

### Health Check

The API includes health check endpoints:

- `GET /` - Basic API information
- `GET /health` - Health status with uptime

## 📊 Analytics Features

### Dashboard Metrics
- Total users, active users, transactions
- Total volume and TVL
- Growth rates and trends
- Top performing pools
- Recent transactions

### User Analytics
- Portfolio value and PnL tracking
- Transaction history and patterns
- Active positions monitoring
- Session behavior analysis

### Pool Analytics
- TVL and volume tracking
- APY calculations
- User participation metrics
- Performance comparisons

### Platform Analytics
- Overall platform metrics
- User acquisition and retention
- Transaction success rates
- Protocol comparisons

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Join our Discord community
- Check the documentation at `/api/swagger`

## 🏗️ Roadmap

- [ ] Real-time WebSocket updates
- [ ] Advanced analytics dashboards
- [ ] Multi-chain support
- [ ] GraphQL API
- [ ] Rate limiting and caching
- [ ] Data export functionality
- [ ] Advanced filtering and search
- [ ] Performance optimizations