# Project Setup Instructions

Welcome to Constraintly! This document will guide you through setting up the project for development.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 18+** - Download from https://nodejs.org/
- **pnpm** - Install with `npm install -g pnpm`
- **PostgreSQL 12+** - Download from https://www.postgresql.org/download/
- **Git** - Download from https://git-scm.com/

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd constraintly
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all project dependencies including:
- Next.js and React
- Tailwind CSS and shadcn/ui
- Prisma ORM
- Better Auth
- Fabric.js for canvas editing
- And more...

### 3. Set Up Database

#### Quick Setup (Recommended)

Run the automated setup script:

```bash
pnpm setup
```

This command will:
- Create `.env` file from `.env.example`
- Generate `BETTER_AUTH_SECRET`
- Generate Prisma Client
- Run all database migrations
- Verify the build

#### Manual Setup

If you prefer manual setup or need to troubleshoot:

1. **Create PostgreSQL Database**

   **macOS:**
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   createdb constraintly
   ```

   **Linux:**
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo -u postgres createdb constraintly
   ```

   **Windows:** Download installer from https://www.postgresql.org/download/windows/

2. **Configure Environment Variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/constraintly"
   BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
   ```

3. **Run Database Migrations**

   ```bash
   pnpm db:migrate
   ```

4. **Verify Setup**

   ```bash
   pnpm exec prisma studio
   ```

   This opens Prisma Studio where you can view your database tables.

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- **Landing Page**: On `/`
- **Sign Up**: On `/auth/signup`
- **Sign In**: On `/auth/signin`
- **Dashboard**: On `/dashboard` (requires login)

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/constraintly"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Optional but Recommended
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Optional Variables (For Phase 2)

```env
# GitHub OAuth
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"

# Email/SMTP (for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

## Available Commands

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Database

```bash
# Create and run migrations
pnpm db:migrate

# Deploy existing migrations (production)
pnpm exec prisma migrate deploy

# Open Prisma Studio
pnpm db:studio

# Reset database (⚠️ deletes all data)
pnpm db:reset

# Generate Prisma Client
pnpm exec prisma generate
```

### Setup

```bash
# Full project setup (recommended for first time)
pnpm setup

# Database setup only
pnpm setup:db
```

## Project Structure

```
constraintly/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication
│   │   ├── projects/        # Project CRUD
│   │   └── user/            # User endpoints
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # User dashboard
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utilities and configuration
│   ├── auth.ts             # Better Auth setup
│   ├── auth-client.ts      # Client auth hooks
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── scripts/                # Setup scripts
│   ├── setup.js           # Cross-platform setup
│   └── setup-db.sh        # Shell setup script
├── docs/                  # Documentation
│   └── DATABASE_SETUP.md  # Database setup guide
├── public/                # Static assets
├── .env                   # Environment variables (local)
├── .env.example           # Environment template
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind CSS config
├── next.config.ts         # Next.js config
└── README.md              # Project README
```

## First Time Setup Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed globally
- [ ] Repository cloned
- [ ] Dependencies installed (`pnpm install`)
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] Setup script run (`pnpm setup`)
- [ ] Development server running (`pnpm dev`)
- [ ] Able to access http://localhost:3000

## Troubleshooting

### "pnpm: command not found"

Install pnpm globally:
```bash
npm install -g pnpm
```

### "Cannot find module '@prisma/client'"

Regenerate Prisma Client:
```bash
pnpm exec prisma generate
```

### "Database connection refused"

Check if PostgreSQL is running:
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Or test connection
psql -U postgres -h localhost
```

### "Build failed"

1. Check TypeScript errors:
   ```bash
   pnpm build
   ```

2. Clear cache and rebuild:
   ```bash
   rm -rf .next node_modules/.cache
   pnpm build
   ```

### "Port 3000 already in use"

Use a different port:
```bash
pnpm dev -- -p 3001
```

### Database migration errors

1. Check migration status:
   ```bash
   pnpm exec prisma migrate status
   ```

2. View recent migrations:
   ```bash
   ls -la prisma/migrations/
   ```

3. Reset if needed:
   ```bash
   pnpm db:reset
   ```

## Next Steps

Once the project is set up:

1. **Explore the Codebase**
   - Review `app/page.tsx` for the landing page
   - Check `app/auth/` for authentication pages
   - Look at `prisma/schema.prisma` for database structure

2. **Create Test Account**
   - Navigate to http://localhost:3000/auth/signup
   - Create a new account
   - Login and access the dashboard

3. **Test Database**
   - Open Prisma Studio: `pnpm db:studio`
   - View the data in tables
   - Create test projects

4. **Review Documentation**
   - Read the main `README.md`
   - Check `docs/DATABASE_SETUP.md` for database details
   - Review implementation plan for feature details

## Getting Help

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Check the [Prisma Documentation](https://www.prisma.io/docs/)
- Check the [Better Auth Documentation](https://www.better-auth.com)
- Open an issue on GitHub for bugs or questions

## Contributing

See CONTRIBUTING.md for guidelines on contributing to this project.

---

**Happy coding! 🚀**
