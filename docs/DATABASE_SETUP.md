# Database Setup Guide

This guide will help you set up PostgreSQL for Constraintly development.

## Quick Start

The easiest way to set up the entire project is to run:

```bash
pnpm setup
```

This will:
- Create `.env` file from `.env.example`
- Generate `BETTER_AUTH_SECRET`
- Generate Prisma Client
- Run all database migrations
- Verify the build

## Manual Setup (Step by Step)

If you prefer to set up manually or need to troubleshoot, follow these steps:

### Option 1: Local PostgreSQL Installation

#### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@16

# Start the PostgreSQL service
brew services start postgresql@16

# Create a new database
createdb constraintly

# Get your connection string
# postgresql://username:password@localhost:5432/constraintly
```

#### Ubuntu/Linux

```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start the service
sudo systemctl start postgresql

# Create a new database and user
sudo -u postgres psql

# In the PostgreSQL prompt:
CREATE DATABASE constraintly;
CREATE USER constraintly_user WITH PASSWORD 'your_password';
ALTER ROLE constraintly_user SET client_encoding TO 'utf8';
ALTER ROLE constraintly_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE constraintly_user SET default_transaction_deferrable TO on;
ALTER ROLE constraintly_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE constraintly TO constraintly_user;
\q

# Connection string:
# postgresql://constraintly_user:your_password@localhost:5432/constraintly
```

#### Windows

1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the wizard
3. Note the password you set for the `postgres` user
4. Use pgAdmin (included) to create a new database called `constraintly`
5. Connection string:
   ```
   postgresql://postgres:your_password@localhost:5432/constraintly
   ```

### Option 2: Cloud Database Services (Recommended for Production)

#### Using Neon (Free Tier Available)

1. Go to https://neon.tech
2. Sign up for a free account
3. Create a new project
4. Copy the connection string from the dashboard
5. Update your `.env` with the connection string

#### Using Supabase (Free Tier Available)

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database > Connection String
4. Copy the PostgreSQL connection string
5. Update your `.env` with the connection string

#### Using AWS RDS

1. Create an RDS PostgreSQL instance
2. Note the endpoint, port, database name, username, and password
3. Build your connection string:
   ```
   postgresql://username:password@endpoint:5432/database_name
   ```

### Step 1: Update Environment Variables

Edit `.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/constraintly"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secure secret with:
```bash
openssl rand -base64 32
```

### Step 2: Generate Prisma Client

```bash
pnpm exec prisma generate
```

### Step 3: Run Database Migrations

For development (creates migration files):
```bash
pnpm db:migrate
```

For production (applies existing migrations):
```bash
pnpm exec prisma migrate deploy
```

### Step 4: Verify Database Setup

Open Prisma Studio to view your database:
```bash
pnpm db:studio
```

This will open a web interface where you can view and manage your database tables.

## Available Database Commands

```bash
# Run migrations in development mode (creates new migrations)
pnpm db:migrate

# Deploy existing migrations (for production)
pnpm exec prisma migrate deploy

# Reset database (⚠️ WARNING: Deletes all data)
pnpm db:reset

# Open Prisma Studio to view/edit database
pnpm db:studio

# Generate Prisma Client
pnpm exec prisma generate

# Create a new migration without running it
pnpm exec prisma migrate dev --name migration_name

# Format schema file
pnpm exec prisma format
```

## Troubleshooting

### "Failed to connect to database"

1. Check if PostgreSQL is running:
   ```bash
   pg_isready -h localhost -p 5432
   ```

2. Verify your `DATABASE_URL` is correct:
   ```bash
   # Test connection with psql
   psql $DATABASE_URL
   ```

3. Check if the database exists:
   ```bash
   psql -U postgres -c "SELECT datname FROM pg_database WHERE datname='constraintly';"
   ```

### "Prisma Client not found"

Regenerate the Prisma Client:
```bash
pnpm exec prisma generate
```

### "Migration failed"

1. Check the migration file in `prisma/migrations/`
2. View the error in detail:
   ```bash
   pnpm exec prisma migrate dev
   ```
3. If you need to reset and start over:
   ```bash
   pnpm db:reset
   ```

### "BETTER_AUTH_SECRET not set"

Generate and add it to `.env`:
```bash
echo "BETTER_AUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env
```

## Database Schema

The database includes the following tables:

- **users**: User accounts and profiles
- **projects**: Design projects created by users
- **constraints**: Constraints applied to projects
- **user_stats**: User statistics (streaks, totals)

See `prisma/schema.prisma` for the complete schema.

## Development Workflow

1. Make changes to `prisma/schema.prisma`
2. Create a migration:
   ```bash
   pnpm db:migrate
   ```
3. Review the generated migration in `prisma/migrations/`
4. Migrations are automatically applied to your database
5. Prisma Client is auto-generated

## Production Deployment

1. Set up a production PostgreSQL database
2. Set the `DATABASE_URL` environment variable in your hosting platform
3. Run migrations during deployment:
   ```bash
   pnpm exec prisma migrate deploy
   ```
4. Deploy your application

## Need Help?

- Check the [Prisma Documentation](https://www.prisma.io/docs/)
- Check the [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Open an issue on GitHub if you encounter problems
