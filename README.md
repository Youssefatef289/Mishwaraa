# Mishwar

Arabic-first car rental marketplace for Egypt, built with Next.js and Supabase.

## Run locally

1. Open this folder in VS Code: `code .`.
2. Install dependencies: `npm install`.
3. Install Supabase CLI and Docker, then run `supabase start`.
4. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from `supabase status` (or your hosted project). Add the Google Maps key for live quotes.
5. Apply schema and seed data locally: `supabase db reset`.
6. Start the app: `npm run dev`.

For a hosted project, link it with `supabase link`, push migrations with `supabase db push`, and set the same environment variables in Vercel. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
