# What Shall We Watch?

A cozy web app to help you pick your next TV show to binge. Press a button and get a random recommendation from trending and popular shows.

## Features

- **Random Show Picker** - Get a random TV show recommendation with one click
- **Mode Filtering** - "With Food" mode for lighter genres (comedy, reality, animation) or "Free Time" for all genres
- **Genre Filtering** - Filter by specific genres like Drama, Sci-Fi, Crime, etc.
- **Trending Badges** - See which shows are currently trending
- **Quality Filter** - Only shows rated 6.0+ on TMDB
- **PWA Support** - Install on your phone's home screen for quick access

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API**: [TMDB](https://www.themoviedb.org/) (The Movie Database)
- **PWA**: [next-pwa](https://github.com/shadowwalker/next-pwa)

## Getting Started

### Prerequisites

- Node.js 18+
- A TMDB API key (free at https://www.themoviedb.org/settings/api)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sdtowle/what-shall-we-watch.git
   cd what-shall-we-watch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your TMDB API key:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your API key:
   ```
   TMDB_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/shows/      # TMDB API proxy route
│   ├── layout.tsx      # Root layout with dark theme
│   ├── page.tsx        # Main selection page
│   └── globals.css     # Global styles
├── components/
│   ├── ShowCard.tsx    # Display selected show
│   ├── GenreSelector.tsx
│   ├── ModeSelector.tsx
│   ├── SpinButton.tsx
│   └── TrendingBadge.tsx
├── lib/
│   ├── tmdb.ts         # TMDB API helpers
│   ├── supabase.ts     # Supabase client (future use)
│   └── types.ts        # TypeScript interfaces
└── public/
    ├── manifest.json   # PWA manifest
    └── icons/          # App icons
```

## License

MIT
