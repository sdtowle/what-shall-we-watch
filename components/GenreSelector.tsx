'use client';

import { ALL_GENRES, FOOD_GENRES, Mode } from '@/lib/types';

interface GenreSelectorProps {
  selectedGenre: number | null;
  mode: Mode;
  onChange: (genreId: number | null) => void;
}

export default function GenreSelector({
  selectedGenre,
  mode,
  onChange,
}: GenreSelectorProps) {
  // Filter genres based on mode
  const availableGenres =
    mode === 'food'
      ? ALL_GENRES.filter((g) => FOOD_GENRES.includes(g.id))
      : ALL_GENRES;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      <button
        onClick={() => onChange(null)}
        className={`
          px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0
          transition-all duration-200
          ${
            selectedGenre === null
              ? 'bg-secondary text-background shadow-lg shadow-secondary/30'
              : 'bg-surface text-text-muted hover:bg-surface/80 hover:text-text-main'
          }
        `}
      >
        All Genres
      </button>
      {availableGenres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onChange(genre.id)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0
            transition-all duration-200
            ${
              selectedGenre === genre.id
                ? 'bg-secondary text-background shadow-lg shadow-secondary/30'
                : 'bg-surface text-text-muted hover:bg-surface/80 hover:text-text-main'
            }
          `}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
