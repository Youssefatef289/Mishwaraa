# Mishwar - مشوار

Mishwar is a Next-Generation Car Rental Marketplace targeting the Egyptian market, built with React 19, Vite 8, Tailwind v4, and Supabase.

## Tech Stack
- **Frontend**: React 19 (SPA) powered by Vite 8
- **Styling**: Tailwind CSS v4
- **Backend & Database**: Supabase (PostgreSQL, Realtime, Auth, Row Level Security)
- **Deployment**: Vercel

## Project Structure
The project uses a domain-driven feature-based architecture:
- `src/core/`: Application entry points (`main.tsx`, `App.tsx`), global styles (`index.css`), and global types (`types.ts`).
- `src/shared/`: Shared UI components used across multiple domains (e.g., `Header`, `Footer`, `MobileBottomNav`, `EgyptianPlateBadge`, `HighwayDivider`).
- `src/features/`: Domain-specific components, organized by feature area:
  - `auth/`: Authentication UI (`AuthModal`).
  - `home/`: The main discovery screen (`HomeScreen`).
  - `booking/`: Checkout, Confirmation, My Bookings, and Booking Chat interfaces.
  - `dealer/`: Dealer Operations Dashboard, Fleet management, and Settlements.
  - `admin/`: Super Admin interfaces and Support Chat.
- `src/lib/`: Backend integration, API clients, and Realtime websocket hooks (`supabase.ts`, `integration.ts`, `chat.ts`).
- `src/data/`: Mock data for fallback or UI prototyping.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Create a `.env` file referencing your Supabase project:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```
4. **Production Build**:
   ```bash
   npm run build
   ```

## Development Workflow
- Always refer to `docs/project-docs.md` before making architectural changes.
- Ensure all new components are placed within their respective domain folders in `src/features/` or within `src/shared/` if used globally.
