# Yield-X Solana Program

A decentralized yield farming protocol built on Solana using the Anchor framework. This program allows users to create yield strategies, deposit tokens, and earn rewards with configurable APY rates.

## 🚀 Features

- **Strategy Creation**: Create custom yield strategies with configurable APY rates
- **Token Deposits**: Deposit tokens into strategies to earn yield
- **Yield Token Minting**: Automatically mint yield tokens representing user positions
- **Redemption System**: Redeem positions with penalty calculations for early withdrawal
- **PDA-based Architecture**: Secure account management using Program Derived Addresses
- **SPL Token Integration**: Full compatibility with Solana's token standard

## 📋 Prerequisites

### System Requirements

- **Node.js**: v20.18.0 or higher
- **Rust**: Latest stable version
- **Solana CLI**: v2.2.18 or higher
- **Anchor CLI**: v0.31.1 or higher

### Initial Setup & CLI Upgrades

We recommend following these steps to ensure your development environment is up-to-date:

- Install/Upgrade Solana CLI
- Install/Upgrade Rust
- Install/Upgrade Anchor CLI
- Configure Solana for Local Development

You can find detailed instructions in the [Solana documentation](https://solana.com/docs/intro/installation).

## 🛠️ Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone git@github.com:MatthieuLvsr/yield-x.git

# Navigate to project directory
cd yield-x

# Install Node.js dependencies
npm install
```

> **Note**: This project is configured to use npm (see `Anchor.toml`). If you prefer yarn for example, you can update the `package_manager` setting in `Anchor.toml` to `"yarn"` and use `yarn install` instead.

### 2. Build the Program

```bash
# Build the Anchor program
anchor build
```

## 🧪 Running Tests

### Method 1: Using Anchor Test (Recommended)

```bash
# Run the complete test suite with automatic validator management
anchor test
```

This automatically:
1. Starts a local test validator
2. Deploys the program
3. Runs all tests
4. Stops the validator

### Method 2: Manual Testing with Local Validator

#### Step 1: Start Local Validator

```bash
# Start the validator in background
solana-test-validator --reset --quiet &
```

#### Step 2: Deploy the Program

```bash
# Deploy to local validator
anchor deploy
```

#### Step 3: Run Tests

```bash
# Set environment variables and run tests
ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts
```

#### Step 4: Stop Validator

```bash
# Stop the validator when done
pkill solana-test-validator
```

### Test Coverage

The test suite includes:

1. **Strategy Creation Test**

   - Creates a new yield strategy with custom APY
   - Verifies strategy account initialization
   - Tests token mint creation for yield tokens

2. **Complete Deposit/Redeem Flow Test**

   - Creates a strategy
   - Mints test tokens to user
   - Performs token deposit
   - Mints yield tokens to user
   - Redeems position with penalty calculation
   - Verifies token balance changes

3. **Program Information Display**
   - Shows program capabilities and status

## 🚀 Deployment

### Local Development (Localhost)

```bash
# Configure for localhost
solana config set --url localhost

# Start validator
solana-test-validator --reset

# Deploy
anchor deploy
```

### Devnet Deployment

```bash
# Configure for devnet
solana config set --url devnet

# Airdrop SOL for deployment (if needed)
solana airdrop 5

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

### Mainnet Deployment

```bash
# Configure for mainnet
solana config set --url mainnet-beta

# Ensure you have sufficient SOL for deployment
solana balance

# Deploy to mainnet (use with caution)
anchor deploy --provider.cluster mainnet-beta
```

## 🔧 Program Instructions

### 1. Create Strategy

Creates a new yield strategy with specified token and APY.

**Parameters:**

- `token_address`: Token mint address for the strategy
- `reward_apy`: Annual Percentage Yield (in basis points, e.g., 1000 = 10%)

### 2. Deposit

Deposits tokens into a strategy to earn yield.

**Parameters:**

- `amount`: Amount of tokens to deposit

**Process:**

- Transfers user tokens to strategy account
- Mints equivalent yield tokens to user
- Creates deposit record with maturity date

### 3. Redeem

Redeems a position from a strategy.

**Parameters:**

- `with_penalty`: Boolean indicating if penalty should be applied for early withdrawal

**Process:**

- Burns user's yield tokens
- Transfers tokens back to user (minus penalty if applicable)
- Closes deposit account

## 🔍 Troubleshooting

### Common Issues

1. **Port 8899 already in use**

   ```bash
   # Stop any running validator
   pkill solana-test-validator
   ```

2. **Program ID mismatch**

   ```bash
   # Rebuild and redeploy
   anchor build
   anchor deploy
   ```

### Useful Commands

```bash
# Check validator status
solana-test-validator --help

# View program logs
solana logs

# Check account information
solana account <ACCOUNT_ADDRESS>

# View program information
anchor idl fetch <PROGRAM_ID>
```
