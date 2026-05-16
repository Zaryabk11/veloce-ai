# IntakeAI Pipeline Dashboard

> A real-time, role-based Kanban system for managing incoming project briefs with AI-powered effort estimation.

## Overview

IntakeAI is a full-stack SaaS dashboard that streamlines the intake and evaluation of client project briefs. When a brief arrives (via web form or webhook), **Google Gemini** automatically analyzes it — extracting requirements, classifying the project category, estimating development hours, recommending a tech stack, and scoring complexity on a 1–5 scale. The result lands on a live Kanban board where Admins and Reviewers collaborate to move it through the pipeline.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Actions, Server/Client Components) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Neon) via Prisma ORM |
| **Authentication** | NextAuth.js v4 (Credentials Provider, bcryptjs) |
| **AI** | Google Gemini 2.5 Flash via Vercel AI SDK (`generateObject`) |
| **Real-Time** | Pusher (WebSockets) |
| **Rate Limiting** | Upstash Redis + `@upstash/ratelimit` |
| **UI & Styling** | Tailwind CSS v4 |
| **Drag & Drop** | `@dnd-kit/core` + `@dnd-kit/sortable` |
| **Data Visualization** | Recharts |
| **Validation** | Zod |

---

## Core Features

### 🔐 Role-Based Access Control (RBAC)
- **Admins** — Full access: view all briefs, assign reviewers, access the analytics dashboard.
- **Reviewers** — Restricted view: can only see and interact with briefs explicitly assigned to them.

### 📋 Real-Time Kanban Board
Drag and drop project cards across five stages:
- **New** → **Under Review** → **Proposal Sent** → **Won** → **Archived**

Every stage change is instantly broadcast to all connected users via Pusher WebSockets — no page reloads required.

### 🤖 AI-Powered Brief Analysis
When a brief is submitted, Gemini 2.5 Flash performs structured analysis via `generateObject`:
- **Feature extraction** — key requirements identified from the description
- **Project classification** — category label (e.g., E-Commerce, SaaS, Mobile App)
- **Hour estimation** — AI-suggested development hours
- **Tech stack recommendation** — suggested technologies
- **Complexity score** — integer from 1 (trivial) to 5 (enterprise-scale)

### ✏️ Reviewer Overrides
Authorized reviewers can manually override the AI hour estimate. A **mandatory justification reason** is required, and the override is recorded in the audit trail.

### 🗒️ Collaboration & Audit Trails
Each brief has:
- **Threaded internal notes** — team members can leave timestamped comments
- **Chronological event log** — automatically records stage changes, reviewer assignments, and estimate overrides

### 📊 Analytics Dashboard *(Admin only)*
- Briefs by pipeline stage (bar chart)
- Overall conversion rate (Won ÷ Total)
- Average AI complexity score across all briefs
- Top 5 project categories by volume

### 🔗 Webhook Intake
Briefs can be submitted programmatically via a secured `POST /api/webhooks/intakes` endpoint, enabling integration with external CRMs, forms, or Zapier workflows. Requests are validated with a shared `WEBHOOK_SECRET`.

---

## Project Structure

```
veloce-ai/
├── app/
│   ├── (dashboard)/
│   │   ├── analytics/        # Analytics page (Admin only)
│   │   ├── brief/            # Brief detail page (side-by-side AI vs. original)
│   │   └── pipeline/         # Kanban board page
│   ├── api/
│   │   ├── auth/             # NextAuth.js route handler
│   │   ├── register/         # User registration endpoint
│   │   └── webhooks/
│   │       └── intakes/      # Secured webhook for external brief submission
│   ├── login/                # Login page
│   └── signup/               # Signup page
├── lib/
│   ├── actions/              # Next.js Server Actions
│   │   ├── analytics.actions.ts
│   │   ├── brief.actions.ts
│   │   ├── notes.actions.ts
│   │   ├── pipeline.actions.ts
│   │   └── users.actions.ts
│   ├── ai/
│   │   └── analyze-brief.ts  # Gemini integration via Vercel AI SDK
│   ├── validations/
│   │   └── intake.ts         # Zod schemas (AI output + intake form)
│   ├── auth.ts               # NextAuth configuration
│   ├── prisma.ts             # Prisma client singleton
│   ├── pusher.ts             # Pusher server/client instances
│   └── redis.ts              # Upstash Redis + rate limiter
└── prisma/
    └── schema.prisma         # Database schema
```

---

## Database Schema

```
User           — id, name, email, password, role (ADMIN | REVIEWER)
ProjectBrief   — id, title, description, budgetRange, timeline, contactInfo, source, stage
AIAnalysis     — features[], category, estimatedHours, techStack[], complexity, overrideHours?, overrideReason?
Note           — content, briefId, authorId
EventLog       — action, details, briefId, userId
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** 18.x or later
- A running **PostgreSQL** database — [Neon](https://neon.tech) (free tier) is recommended
- A **Pusher** account — [pusher.com](https://pusher.com/) (free Sandbox plan)
- An **Upstash Redis** database — [upstash.com](https://upstash.com/) (free tier)
- A **Google AI Studio** API key — [aistudio.google.com](https://aistudio.google.com/)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Zaryabk11/veloce-ai.git
cd veloce-ai
npm install
```

### 3. Environment Variables

Create a `.env` file in the project root and populate it with the following:

```env
# PostgreSQL connection string (Neon, Supabase, or local)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=verify-full"

# Google Gemini (AI Studio)
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key"

# Webhook security (generate a random 256-bit hex string)
WEBHOOK_SECRET="your_webhook_secret"

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret"   # run: openssl rand -hex 32
NEXTAUTH_URL="http://localhost:3000"

# Pusher
PUSHER_APP_ID="your_pusher_app_id"
NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
PUSHER_SECRET="your_pusher_secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your_pusher_cluster"  # e.g. ap2, eu, us2
```

### 4. Database Setup

Push the Prisma schema to your database to create all tables:

```bash
npx prisma db push
```

Optionally, open Prisma Studio to inspect your data:

```bash
npx prisma studio
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the login page — create your first account via `/signup`.

> **Note:** The first registered account will have the `REVIEWER` role by default. To promote a user to `ADMIN`, update their `role` field directly in the database via Prisma Studio or a SQL query.

---

## Webhook Integration

Send project briefs programmatically from any external system:

```bash
curl -X POST http://localhost:3000/api/webhooks/intakes \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: YOUR_WEBHOOK_SECRET" \
  -d '{
    "title": "E-Commerce Platform Redesign",
    "description": "We need a full redesign of our Shopify store...",
    "budgetRange": "$10,000 - $20,000",
    "timeline": "3 months",
    "contactInfo": "client@example.com"
  }'
```

A successful submission triggers AI analysis immediately and places the brief on the Kanban board.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server at `localhost:3000` |
| `npm run build` | Create an optimized production build |
| `npm start` | Start the production server (requires `build` first) |
| `npm run lint` | Run ESLint across the codebase |
| `npx prisma studio` | Open a local Prisma database GUI |
| `npx prisma db push` | Sync the Prisma schema to the database |

---

## License

This project is private and not licensed for redistribution.