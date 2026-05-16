# IntakeAI Pipeline Dashboard

## Overview
IntakeAI is a real-time, role-based Kanban dashboard designed to manage incoming project briefs and AI-generated effort estimates. Built with the Next.js App Router, it features seamless drag-and-drop stage management, threaded team collaboration, and live pipeline analytics.

## Tech Stack
- **Framework:** Next.js (App Router, Server Actions, Server/Client Components)
- **Database:** PostgreSQL managed via Prisma ORM
- **Authentication:** NextAuth.js (Credentials Provider)
- **Real-Time Synchronization:** Pusher
- **UI & Styling:** Tailwind CSS
- **Drag & Drop:** `@dnd-kit`
- **Data Visualization:** Recharts

## Core Features
- **Role-Based Access Control (RBAC):**
  - **Admins:** Full access to assign briefs, view the entire pipeline, and access the analytics dashboard.
  - **Reviewers:** Restricted view; can only see and interact with briefs explicitly assigned to them.
- **Real-Time Kanban Board:** Drag and drop project cards across stages (New, Under Review, Proposal Sent, Won, Archived). Board state is instantly broadcasted to all active users via Pusher WebSockets without page reloads.
- **Intelligent Brief Details:** Side-by-side comparison of the original client intake submission and the AI-generated complexity/stack estimates.
- **Reviewer Overrides:** Authorized users can manually override AI estimates, which requires a mandatory justification reason.
- **Collaboration & Audit Trails:** Threaded internal notes and an automated, chronological event timeline for every brief (logging stage changes, reassignments, and estimate overrides).
- **Analytics Dashboard:** Real-time KPI tracking, win/conversion rates, and categorical breakdown charts (restricted to Admins).

## Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- A running PostgreSQL database (local or cloud like Supabase/Neon)
- A free [Pusher](https://pusher.com/) account for real-time WebSockets

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install