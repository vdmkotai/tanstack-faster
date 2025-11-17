# Tanstack-Faster

A straight-up clone of [NextFaster](https://next-faster.vercel.app/) but adapted to [Tanstack Start](https://tanstack.com/start/latest).
I obviously took a lot of inspiration from their project(by this I mean I literally copied the UI and postgres queries), so shoutout to team and please check them out [nextfaster source code](https://github.com/ethanniser/NextFaster).

This project uses PostgreSQL, Redis and a sharp server for image optimization. Everything was deployed in Railway.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (package manager)
- PostgreSQL database (Neon recommended)
- Redis (Upstash recommended)

### Setup

1. **Clone and install dependencies**

   ```bash
   git clone <your-repo-url>
   cd tanstack-faster
   pnpm install
   ```

2. **Set up databases**

   See detailed guides:

   - **[NEON-UPSTASH-SETUP.md](./NEON-UPSTASH-SETUP.md)** - For cloud databases (Neon + Upstash)
   - **[SETUP.md](./SETUP.md)** - For local databases (Docker)

3. **Create `.env` file**

   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/db
   REDIS_URL=redis://default:pass@host:6379
   VITE_SERVER_URL=http://localhost:8080
   BETTER_AUTH_SECRET=your-secret-min-32-chars
   ```

4. **Initialize database**

   ```bash
   pnpm db:push
   ```

5. **Generate test data** (optional)

   ```bash
   pnpm db:seed
   ```

6. **Start dev server**
   ```bash
   pnpm dev
   ```

Visit **http://localhost:8080**

## 📚 Documentation

- **[STEP-BY-STEP-GUIDE.md](./STEP-BY-STEP-GUIDE.md)** - 🔥 **НАЧНИТЕ ЗДЕСЬ!** Максимально подробная пошаговая инструкция
- **[QUICK-START-NEON-UPSTASH.md](./QUICK-START-NEON-UPSTASH.md)** - Быстрый старт за 5 минут
- **[NEON-UPSTASH-SETUP.md](./NEON-UPSTASH-SETUP.md)** - Полный гайд для облачных баз (Neon + Upstash)
- **[SETUP.md](./SETUP.md)** - Локальная разработка с Docker

## 🛠️ Commands

```bash
# Development
pnpm dev              # Start development server (port 8080)
pnpm build            # Build for production
pnpm start            # Run production build

# Database
pnpm db:push          # Apply schema to database
pnpm db:studio        # Open Drizzle Studio (database GUI)
pnpm db:seed          # Generate test data

# Code Quality
pnpm check            # Format and lint with Biome
pnpm check-types      # TypeScript type checking
```

## 🏗️ Tech Stack

- **Frontend**: React 19, TanStack Router, Tailwind CSS 4
- **Backend**: Nitro, TanStack Start
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth
- **Cache**: Redis
- **UI**: Radix UI, shadcn/ui components

## 📝 License

MIT
