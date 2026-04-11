# Authentication Microservice

A NestJS-based microservice for user authentication with Prisma ORM and MongoDB database.

## Description

This is an authentication microservice built with NestJS framework. It provides user registration, login, and token verification functionality with MongoDB as the database. The service uses Prisma ORM with MongoDB configured as a replica set to support transactions.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn or pnpm
- Docker and Docker Compose
- Git
- OpenSSL (for generating MongoDB keyfile)

## Installation and Setup

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/gerardogrz/nestjs-microservices.git
cd auth-ms
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### 3. Environment Configuration

Copy the environment template and configure your environment variables:

```bash
cp .env.template .env
```

Edit the `.env` file with your specific configuration.

### 4. MongoDB Replica Set Setup

This service requires MongoDB to run as a replica set for Prisma transactions to work properly.

#### 4.1 Generate MongoDB Keyfile

```bash
# Create keyfile directory
mkdir -p keyfile

# Generate keyfile
openssl rand -base64 756 > keyfile/keyfile

# Set proper permissions
chmod 600 keyfile/keyfile

# Set ownership for Docker (Ubuntu/Debian)
sudo chown -R 999:999 keyfile
```

**Important**: The `keyfile/keyfile` is already included in `.gitignore` for security.

#### 4.2 Start MongoDB with Docker Compose

From the root directory of the project:

```bash
# Start only the database service
docker compose up -d auth-database

# Wait for MongoDB to start
sleep 10

# Initiate the replica set
docker exec -it auth_database mongosh -u mongo -p 123456 --authenticationDatabase admin --eval "rs.initiate()"
```

The replica set configuration is stored in the MongoDB data volume and will persist across container restarts.

### 5. Database Setup

Generate Prisma client and sync the schema:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (recommended for development)
npx prisma db push

# Or use the convenience script
yarn prisma:docker
```

## Running the Application

### Development Mode

```bash
# Using npm
npm run start:dev

# Or using yarn
yarn start:dev

# Or using pnpm
pnpm start:dev
```

The application will start in watch mode with hot reload.

### Production Mode

```bash
# Build the application
npm run build

# Run in production mode
npm run start:prod
```

### Running with Docker

```bash
# From root directory
docker compose up -d auth-ms

# Or with database
docker compose up -d auth-database auth-ms
```

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `yarn prisma:docker` - Generate Prisma client and push schema

## API Documentation

The microservice exposes the following endpoints through NATS messaging:

- `auth.register.user` - Register a new user
- `auth.login.user` - User login
- `auth.verify.user` - Verify user token

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── dto/           # Data transfer objects
├── commons/           # Common utilities and DTOs
├── config/            # Configuration files
├── prisma/            # Prisma database service
├── generated/         # Generated Prisma client
├── app.module.ts      # Root module
└── main.ts           # Application entry point
```

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **MongoDB** - NoSQL database with replica set
- **TypeScript** - Typed JavaScript
- **NATS** - Message broker for microservices
- **Class-validator** - Validation decorators

## Troubleshooting

### MongoDB Replica Set Issues

If you encounter the following error when making requests to the auth service:

```json
{
  "status": 400,
  "message": "Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set"
}
```

Or see MongoDB logs with errors like:
- `"No primary exists currently"`
- `"ReadConcernMajorityNotAvailableYet"`
- `"Our replica set config is invalid or we are not a member of it"`

#### Solution Steps

1. **Stop the auth database container**:
   ```bash
   docker compose stop auth-database
   ```

2. **Restart the container**:
   ```bash
   docker compose up -d auth-database
   ```

3. **Wait for MongoDB to start** (10-15 seconds):
   ```bash
   sleep 15
   ```

4. **Reconfigure the replica set**:
   ```bash
   docker exec -it auth_database mongosh -u mongo -p 123456 --authenticationDatabase admin --eval "rs.reconfig({_id: 'rs0', members: [{_id: 0, host: 'auth_database:27017'}]}, {force: true})"
   ```

5. **Verify the replica set status**:
   ```bash
   docker exec -it auth_database mongosh -u mongo -p 123456 --authenticationDatabase admin --eval "rs.status()"
   ```

6. **Restart the auth service**:
   ```bash
   docker compose up -d auth-ms
   ```

#### Prevention Tips

- **Use `docker compose down` (without `-v`)** to preserve replica set data during development
- **Avoid force-stopping containers** which can corrupt replica set state
- **Check replica set health** if containers were stopped abruptly: `docker exec auth_database mongosh -u mongo -p 123456 --authenticationDatabase admin --eval "rs.status()"`

## Important Notes

### MongoDB Replica Set

- The MongoDB service is configured as a replica set (`rs0`)
- Replica set is required for Prisma transactions to work
- The replica set configuration persists in the data volume
- Only needs to be initiated once per fresh database setup

### Security

- MongoDB keyfile is ignored by git for security
- Each environment should generate its own keyfile
- Never commit authentication keys to version control

### Development Workflow

- The replica set configuration survives container rebuilds
- Only regenerate keyfile if compromised
- Use `docker compose down` (without `-v`) to preserve data during development