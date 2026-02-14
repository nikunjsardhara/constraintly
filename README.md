# Constraintly - Creative Constraint Design Platform

Constraintly is a web application designed to help graphic designers overcome creative blocks by generating structured constraints that force originality and rapid idea execution. Users can create design projects with specific constraints (time limits, tool limitations, color restrictions), track their progress with streak counters, and manage their creative work on a full-featured canvas editor.

## ⚡ Quick Start

Get up and running in seconds:

```bash
# 1. Clone and install
git clone <repository-url>
cd constraintly
pnpm install

# 2. Run setup (handles everything)
pnpm setup

# 3. Start developing
pnpm dev
```

Open http://localhost:3000 and start creating! 🚀

**👉 See [GETTING_STARTED.md](./GETTING_STARTED.md) for a detailed quick start guide.**

## 🎯 Features

### Phase 1 - MVP (Current)
- **Authentication**: Email/password sign-up and sign-in with better-auth
- **Landing Page**: Beautiful homepage showcasing platform features
- **Dashboard**: User dashboard displaying projects, stats, and progress
- **Project Management**: Create, edit, and manage design projects
- **Constraints**: Apply multiple types of constraints to projects:
  - ⏱️ Time Limits - Challenge yourself with time-boxed sessions
  - 🛠️ Tool Limitations - Restrict your tool palette
  - 🎨 Color Restrictions - Work with limited color palettes
  - 📚 Asset Restrictions - Limited assets force creativity
- **Canvas Editor**: Full-featured drawing canvas (powered by Fabric.js)
  - Drawing and brush tools
  - Shape tools (rectangles, circles, lines)
  - Text tool
  - Color picker
  - Undo/Redo functionality
  - Save and export designs
- **Streak & Progress Tracking**: Track your creative journey
  - Current streak counter
  - Longest streak achievement
  - Total projects completed

### Phase 2 - Community Features (Future)
- Project gallery and exploration
- Voting and reactions system
- Comments and discussions
- User profiles
- Designer follow/unfollow
- Notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Canvas**: Fabric.js
- **Authentication**: better-auth
- **Database**: PostgreSQL (self-hosted)
- **ORM**: Prisma v7
- **Form Handling**: react-hook-form, Zod

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database (local or remote)

### Installation

The easiest way to set up the project is to use the automated setup script:

```bash
pnpm setup
```

This will handle all the initialization steps automatically. For manual setup or more details, see:

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Quick start guide (5 minutes)
- **[docs/SETUP.md](./docs/SETUP.md)** - Detailed setup instructions
- **[docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)** - Database configuration guide

### Quick Commands

```bash
# Setup everything (recommended for first time)
pnpm setup

# Start development server
pnpm dev

# Build for production
pnpm build

# Database commands
pnpm db:migrate         # Create/run migrations
pnpm db:studio          # Open Prisma Studio
pnpm db:reset           # Reset database (⚠️)
```

## 📁 Project Structure

```
constraintly/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── projects/     # Project CRUD operations
│   │   └── user/         # User-related endpoints
│   ├── auth/             # Authentication pages (signin, signup)
│   ├── dashboard/        # User dashboard
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── auth.ts           # Better auth configuration
│   ├── auth-client.ts    # Client-side auth hooks
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## 🗄️ Database Schema

### Users
- `id`: UUID primary key
- `email`: Unique email address
- `name`: User's display name
- `image`: Profile image URL
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Projects
- `id`: UUID primary key
- `userId`: Foreign key to Users
- `title`: Project title
- `description`: Project description
- `canvasData`: JSON data for Fabric.js canvas
- `status`: IN_PROGRESS | COMPLETED | ABANDONED
- `createdAt`: Creation timestamp
- `completedAt`: Completion timestamp (nullable)
- `updatedAt`: Last update timestamp

### Constraints
- `id`: UUID primary key
- `projectId`: Foreign key to Projects
- `type`: TIME_LIMIT | TOOL_LIMITATION | COLOR_RESTRICTION | ASSET_RESTRICTION
- `value`: Constraint value (time in minutes, color hex, etc.)
- `description`: Human-readable constraint description
- `createdAt`: Creation timestamp

### UserStats
- `id`: UUID primary key
- `userId`: Foreign key to Users (unique)
- `currentStreak`: Current consecutive days active
- `longestStreak`: Longest streak achieved
- `totalProjects`: Total projects completed
- `lastActivityDate`: Last activity timestamp
- `updatedAt`: Last stats update

## 📡 API Endpoints

### Authentication (Better Auth)
- `POST /api/auth/signup` - Sign up with email/password
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### User
- `GET /api/user` - Get current user profile
- `GET /api/user/stats` - Get user statistics

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Constraints
- `POST /api/projects/[id]/constraints` - Add constraint to project

## 🎨 Components

All UI components are sourced from shadcn/ui for consistency. Available components include:
- Button
- Input
- Card
- Dialog
- Label
- Textarea
- Select
- And more...

## 🔐 Security Considerations

- All API routes require authentication via better-auth
- Passwords are securely hashed and stored
- Database connection uses environment variables (never committed)
- CORS and CSRF protections enabled
- Rate limiting (recommended for production)

## 📝 Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm exec prisma migrate dev         # Run migrations
pnpm exec prisma studio              # Open Prisma Studio
pnpm exec prisma generate            # Generate Prisma client
```

## 🚀 Deployment

### Prerequisites
- Vercel account (or similar hosting)
- PostgreSQL database (Neon, Supabase, or self-hosted)
- Environment variables configured

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Install dependencies
- Build the Next.js app
- Deploy to edge network

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Better Auth Documentation](https://www.better-auth.com)
- [Fabric.js Documentation](http://fabricjs.com/)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Phase 1: Core MVP (current)
  - [x] Authentication
  - [x] Landing page
  - [x] Dashboard
  - [x] Project management
  - [ ] Canvas editor (in progress)
  - [ ] Constraint management (in progress)
- [ ] Phase 2: Community
  - [ ] Gallery/explore
  - [ ] Voting/reactions
  - [ ] Comments
  - [ ] User profiles
- [ ] Phase 3: Advanced
  - [ ] Collaboration features
  - [ ] Design templates
  - [ ] Social sharing
  - [ ] Analytics dashboard

## 💡 Ideas for Future Features

- Real-time collaboration on designs
- Design templates and presets
- AI-powered constraint suggestions
- Social media integration
- Design challenge competitions
- Tutorials and onboarding
- Mobile app
- Design export (SVG, PNG, PDF)

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please open an issue on GitHub.

---

**Happy creating! 🎨✨**
