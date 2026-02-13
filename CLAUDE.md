# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

What Shall We Watch? is a Next.js PWA that helps users discover TV shows using the TMDB API. Users can filter by mode ("With Food" for lighter shows, "Free Time" for any genre) and specific genres.

## Commands

```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint via Next.js
```

No test framework is currently configured.

## Architecture

### Data Flow
1. User selects filters (mode, genre) on the main page (`app/page.tsx`)
2. SpinButton triggers fetch to `/api/shows?mode=X&genre=Y`
3. API route (`app/api/shows/route.ts`) fetches trending + popular shows from TMDB
4. Backend applies filters: rating >= 6.0, genre matching, mode filtering
5. Random show selected, enriched with full details, returned to frontend
6. ShowCard displays result with animations

### Key Files
- `app/api/shows/route.ts` - Backend orchestration, TMDB calls, filtering logic
- `lib/tmdb.ts` - TMDB API client and show filtering utilities
- `lib/types.ts` - TypeScript interfaces (Show, Mode, TMDB response types)
- `components/ShowCard.tsx` - Main display component for selected shows
- `tailwind.config.ts` - Custom theme colors and animations

### Mode Logic
- **"With Food" mode**: Restricts to comedy (35), reality (10764), animation (16) genres
- **"Free Time" mode**: All genres available, filtered by user selection

## Environment Variables

Required in `.env.local`:
- `TMDB_API_KEY` - Get from https://www.themoviedb.org/settings/api

Optional (for future auth features):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Tech Stack

- Next.js 14 (App Router) with React 18
- TypeScript with strict mode
- Tailwind CSS with custom dark theme
- next-pwa for PWA support
- Supabase client installed but not yet integrated
