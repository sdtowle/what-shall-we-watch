'use client';

import { Show } from '@/lib/types';
import TrendingBadge from './TrendingBadge';

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : null;

  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : 'Unknown';

  const avgRuntime =
    show.episode_run_time.length > 0
      ? Math.round(
          show.episode_run_time.reduce((a, b) => a + b, 0) /
            show.episode_run_time.length
        )
      : null;

  return (
    <div className="animate-bounce-in bg-surface rounded-2xl overflow-hidden shadow-xl max-w-md w-full mx-auto">
      {posterUrl ? (
        <div className="relative aspect-[2/3] w-full">
          <img
            src={posterUrl}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          {show.isTrending && (
            <div className="absolute top-3 left-3">
              <TrendingBadge />
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-[2/3] w-full bg-background flex items-center justify-center">
          <span className="text-text-muted text-lg">No poster available</span>
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-text-main">{show.name}</h2>
          <div className="flex items-center gap-1 shrink-0">
            <svg
              className="w-5 h-5 text-secondary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-secondary font-semibold">
              {show.vote_average.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {show.genres.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p className="text-text-muted text-sm line-clamp-3">{show.overview}</p>

        <div className="flex items-center gap-4 text-sm text-text-muted">
          <span>{year}</span>
          <span>{show.number_of_seasons} season{show.number_of_seasons !== 1 ? 's' : ''}</span>
          {avgRuntime && <span>{avgRuntime} min/ep</span>}
        </div>
      </div>
    </div>
  );
}
