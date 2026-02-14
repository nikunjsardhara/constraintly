# Getting Started with Constraintly

Welcome to Constraintly! This is a quick guide to get you up and running.

## ⚡ Quick Start (5 minutes)

### 1. Prerequisites

Make sure you have installed:
- **Node.js 18+** - https://nodejs.org
- **pnpm** - `npm install -g pnpm`
- **PostgreSQL 12+** - https://www.postgresql.org/download

### 2. Clone & Install

```bash
git clone <repository-url>
cd constraintly
pnpm install
```

### 3. Run Automated Setup

```bash
pnpm setup
```

This script will:
- Create `.env` file with your environment variables
- Generate authentication secrets
- Set up the PostgreSQL database
- Run all migrations
- Build and verify everything

### 4. Start Development

```bash
pnpm dev
```

Open http://localhost:3000 in your browser! 🎉

## 📋 What You'll See

After starting the dev server:

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Landing page with features overview |
| `http://localhost:3000/auth/signup` | Create a new account |
| `http://localhost:3000/auth/signin` | Login to your account |
| `http://localhost:3000/dashboard` | User dashboard (after login) |

## 🚀 What's Included (Phase 1 MVP)

✅ **Authentication**
- Email/password sign-up and sign-in
- Secure session management
- Password hashing with better-auth

✅ **Landing Page**
- Beautiful hero section
- Feature showcase
- Call-to-action buttons
- Responsive design

✅ **Dashboard**
- User welcome message
- Stats display (streaks, projects)
- Project management UI
- Sign out functionality

✅ **Project Management**
- Create new projects
- Store project details
- Project listing

✅ **Database & API**
- PostgreSQL database
- RESTful API endpoints
- User, project, and constraint tables
- Prisma ORM for database management

## 📁 Project Structure

```
constraintly/
├── app/
│   ├── api/           # REST API endpoints
│   ├── auth/          # Sign up/Sign in pages
│   ├── dashboard/     # User dashboard
│   └── page.tsx       # Landing page
├── components/        # React components
├── lib/              # Utilities & config
├── prisma/           # Database schema
├── scripts/          # Setup scripts
├── docs/             # Documentation
└── public/           # Static assets
```

## 📚 Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm lint             # Run ESLint

# Database
pnpm db:migrate       # Create/run migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database (⚠️ deletes data)

# Setup
pnpm setup            # Full project setup
pnpm setup:db         # Database setup only
```

## 🔧 Environment Variables

Key variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/constraintly"
BETTER_AUTH_SECRET="auto-generated-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

See `.env.example` for all available options.

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
pnpm dev -- -p 3001
```

### Need to reset everything?
```bash
pnpm db:reset
pnpm setup
```

### Want to inspect the database?
```bash
pnpm db:studio
```

## 📖 More Documentation

- **Detailed Setup**: See `docs/SETUP.md`
- **Database Guide**: See `docs/DATABASE_SETUP.md`
- **Main README**: See `README.md`

## 🎯 What's Coming Next (Phase 2)

- Canvas editor with Fabric.js
- Constraint management system
- Community features (gallery, voting, comments)
- Real-time collaboration
- Design templates

## 🤝 Need Help?

- Check the documentation in `/docs`
- Review the implementation plan in the session workspace
- Open an issue on GitHub

## 💡 Tips

1. **Use Prisma Studio** to explore your database without writing SQL:
   ```bash
   pnpm db:studio
   ```

2. **Create test users** by signing up on the /auth/signup page

3. **Check the API** by navigating to:
   - `http://localhost:3000/api/user` - Your profile
   - `http://localhost:3000/api/projects` - Your projects
   - `http://localhost:3000/api/user/stats` - Your statistics

4. **Dark mode** is built in - check it out in your browser's system preferences

## 🎨 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL, Prisma ORM
- **Auth**: better-auth
- **Forms**: react-hook-form, Zod

---

**You're all set! Start coding and have fun! 🚀**
