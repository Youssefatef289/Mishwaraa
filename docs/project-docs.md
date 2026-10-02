# Mishwar - Living Project Documentation

> **CRITICAL INSTRUCTION**: This document MUST be read by any AI or developer before proposing architectural changes, making database schema updates, or refactoring the core functionality of Mishwar.

## 1. Project Philosophy & Core Stack
Mishwar is a React Single-Page Application (SPA) designed to be highly responsive, real-time, and mobile-friendly.
- **Vite 8 & React 19**: We rely on modern React features and the fast Vite bundler. Do not introduce Next.js, Server Components, or SSR patterns; this app is strictly a client-side SPA fetching data directly from Supabase.
- **Tailwind v4**: Styling is done via utility classes. All theme variables and primary design tokens are located in `src/core/index.css`. Do not add legacy static CSS files.
- **Supabase**: Serves as the complete backend (PostgreSQL, Realtime, Auth, RLS). We use direct DB queries via `supabase-js` inside `src/lib/`. 

## 2. Directory Structure (Domain-Driven)
All source code lives inside `src/` following a strict feature-based grouping to maintain scalability:
- `src/core/`: Bootstrapping (`main.tsx`), Global State Routing (`App.tsx`), `types.ts`, and `index.css`.
- `src/shared/`: Reusable presentational components (buttons, badges, layouts, headers).
- `src/features/`: Isolated feature modules (`auth`, `home`, `booking`, `dealer`, `admin`). A feature should contain its own components and ideally not deeply import from other features unless necessary.
- `src/lib/`: Database and third-party integrations.
  - `integration.ts`: Core data fetching (Dealers, Cars, Bookings).
  - `chat.ts`: Realtime websocket listeners and message loading.
  - `supabase.ts`: Client initialization and Auth helpers.

## 3. Database Schema & Guidelines
- **dealers**: The core table for organizations (previously called `organizations`). Always use `dealer_id` and `dealers` in frontend queries.
- **cars**: Vehicles belonging to a `dealer_id`.
- **bookings**: Connects a `user_id` (customer) and `dealer_id` with a specific `car_id`.
- **booking_messages**: Real-time chat between customer and dealer for a specific `booking_id`.
- **dealer_admin_messages**: Real-time support chat between a `dealer_id` and the `super_admin`.

**Important Rule**: Do not create new SQL migrations unless absolutely necessary. Rely on the existing schema (`booking_messages`, `dealer_admin_messages`, `dealers`) which is already live and protected by Row Level Security (RLS).

## 4. Routing Architecture
Mishwar uses a lightweight, state-based router controlled by `currentScreen` in `src/core/App.tsx`.
- Valid screens: `'home' | 'checkout' | 'confirmation' | 'bookings' | 'dealer' | 'admin'`
- Access Control: `App.tsx` fetches the user's role from the `profiles` table (`customer`, `dealer`, `super_admin`) to determine if they can access the `'dealer'` or `'admin'` screens. Non-authorized users must be forcefully redirected to `'home'`.
- Dealer Approval: If a dealer's `dealers.status !== 'approved'`, the dashboard must display a "Waiting for Approval" overlay rather than the standard operations UI.

## 5. Maintenance Checklist
- When adding a new view, add it to the union type in `currentScreen` (in `App.tsx`).
- Keep all UI text strictly in Arabic (RTL).
- Ensure Vercel deployment remains clean by maintaining `vercel.json` with `cleanUrls: true`.
- Run `npm run build` locally to verify TypeScript types and Vite bundle integrity before committing.
