# Available Commands

Complete list of all available pnpm commands for Constraintly.

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server (after build)
pnpm start

# Run ESLint
pnpm lint
```

## Database

```bash
# Run migrations in development (creates new migration files)
pnpm db:migrate

# Push schema changes to database (without migration files)
pnpm exec prisma db push

# Deploy existing migrations (production)
pnpm exec prisma migrate deploy

# Reset database (⚠️ WARNING: Deletes all data)
pnpm db:reset

# Open Prisma Studio (visual database browser)
pnpm db:studio

# Generate Prisma Client
pnpm exec prisma generate

# Show migration status
pnpm exec prisma migrate status

# Create new migration (without running)
pnpm exec prisma migrate dev --name your_migration_name
```

## Setup

```bash
# Full automated project setup (recommended for first time)
pnpm setup

# Database setup only (shell script for Linux/Mac)
pnpm setup:db
```

## Project Structure

```
constraintly/
├── pnpm install           # Install dependencies
├── pnpm dev              # Development server
├── pnpm build            # Production build
├── pnpm setup            # Full setup (includes DB)
└── pnpm db:*             # Database commands
```

## Detailed Command Reference

### Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js development server on http://localhost:3000 |
| `pnpm build` | Create production build in .next directory |
| `pnpm start` | Start production server (requires pnpm build first) |
| `pnpm lint` | Run ESLint to check code quality |

### Database Commands

| Command | Purpose |
|---------|---------|
| `pnpm db:migrate` | Create and run Prisma migrations (dev mode) |
| `pnpm db:push` | Push schema to database without creating migration files |
| `pnpm db:studio` | Open interactive Prisma Studio database browser |
| `pnpm db:reset` | ⚠️ Reset database to initial state (deletes all data) |
| `pnpm exec prisma migrate deploy` | Run all pending migrations (production mode) |
| `pnpm exec prisma migrate status` | Check which migrations have been applied |
| `pnpm exec prisma generate` | Generate Prisma Client types |

### Setup Commands

| Command | Purpose |
|---------|---------|
| `pnpm setup` | Automated full project setup (cross-platform) |
| `pnpm setup:db` | Database setup only (Linux/Mac shell script) |
| `pnpm install` | Install project dependencies |

## Quick Start Sequence

```bash
# 1. Clone repository
git clone <repository-url>
cd constraintly

# 2. Install dependencies
pnpm install

# 3. Run automated setup
pnpm setup

# 4. Start development
pnpm dev

# 5. Open browser
# http://localhost:3000
```

## Development Workflow

```bash
# 1. Start development server
pnpm dev

# 2. Edit files (auto-reload in browser)

# 3. When adding database changes:
pnpm db:migrate

# 4. View database (optional)
pnpm db:studio

# 5. Build before commit
pnpm build

# 6. Run linter
pnpm lint
```

## Troubleshooting Commands

```bash
# Regenerate Prisma Client (if missing)
pnpm exec prisma generate

# Check database connection
pnpm exec prisma migrate status

# Reset database and start fresh
pnpm db:reset

# Clear build cache and rebuild
rm -rf .next node_modules/.cache
pnpm build

# Install dependencies fresh
rm pnpm-lock.yaml
pnpm install
```

## Environment Commands

```bash
# Copy environment template
cp .env.example .env

# Generate BETTER_AUTH_SECRET
openssl rand -base64 32

# Edit environment variables
nano .env  # or your preferred editor
```

## Docker Commands (If Applicable)

```bash
# Build Docker image
docker build -t constraintly .

# Run Docker container
docker run -p 3000:3000 constraintly
```

## Production Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Deploy to Vercel (if using Vercel CLI)
vercel

# Deploy to other platforms
# Follow platform-specific deployment guides
```

## Useful Combinations

```bash
# Full reset and setup
pnpm db:reset && pnpm setup && pnpm dev

# Build and test locally
pnpm build && pnpm start

# Development with database studio open (in separate terminals)
# Terminal 1:
pnpm dev

# Terminal 2:
pnpm db:studio

# Create migration and run it
pnpm exec prisma migrate dev --name add_new_feature
```

## Getting Help

```bash
# View Next.js help
pnpm next --help

# View Prisma help
pnpm exec prisma --help

# View Prisma migrate help
pnpm exec prisma migrate --help

# Check project documentation
cat README.md
cat GETTING_STARTED.md
cat docs/DATABASE_SETUP.md
```

---

**For more details, see:**
- README.md - Main project documentation
- GETTING_STARTED.md - Quick start guide
- docs/SETUP.md - Detailed setup instructions
- docs/DATABASE_SETUP.md - Database configuration

**Need help?** Check the documentation or open an issue on GitHub.
