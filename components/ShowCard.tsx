'use client';

import { useState, useEffect } from 'react';
import { Show, UserRating } from '@/lib/types';
import TrendingBadge from './TrendingBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { addToWatchlist } from '@/app/watchlist/actions';
import { getUserRating } from '@/app/ratings/actions';
import RatingModal from './RatingModal';

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<UserRating | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserRating(show.id).then(setUserRating);
  }, [show.id, user]);

  const handleModalClose = () => {
    setIsRatingModalOpen(false);
    if (user) getUserRating(show.id).then(setUserRating);
  };

  const handleSave = async () => {
    if (!user) {
      showToast('Log in to save shows to your watchlist', 'info');
      return;
    }
    setSaving(true);
    const result = await addToWatchlist(show.id, show.name, show.poster_path);
    if (result.success) {
      setSaved(true);
      showToast(`"${show.name}" added to watchlist`);
    } else {
      showToast(result.error || 'Failed to save show', 'error');
    }
    setSaving(false);
  };
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
    <>
    <div className="animate-bounce-in bg-surface rounded-2xl overflow-hidden shadow-xl max-w-sm w-full mx-auto">
      <div className="flex">
        {posterUrl ? (
          <div className="relative w-32 shrink-0">
            <img
              src={posterUrl}
              alt={show.name}
              className="w-full h-full object-cover"
            />
            {show.isTrending && (
              <div className="absolute top-2 left-2">
                <TrendingBadge />
              </div>
            )}
          </div>
        ) : (
          <div className="w-32 shrink-0 bg-background flex items-center justify-center">
            <span className="text-text-muted text-xs text-center px-2">No poster</span>
          </div>
        )}

        <div className="p-4 space-y-2 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-text-main leading-tight">{show.name}</h2>
            <div className="flex items-center gap-1 shrink-0">
              <svg
                className="w-4 h-4 text-secondary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-secondary font-semibold text-sm">
                {show.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {show.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-text-muted text-xs line-clamp-3">{show.overview}</p>

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{year}</span>
            <span>{show.number_of_seasons} season{show.number_of_seasons !== 1 ? 's' : ''}</span>
            {avgRuntime && <span>{avgRuntime}m/ep</span>}
          </div>

          <div className="mt-1 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            {saved ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : saving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save to Watchlist
              </>
            )}
          </button>
          <button
            onClick={() => {
              if (!user) {
                showToast('Log in to rate shows', 'info');
                return;
              }
              setIsRatingModalOpen(true);
            }}
            className={`flex items-center gap-1 text-xs transition-colors ${
              userRating ? 'text-secondary hover:text-secondary/80' : 'text-text-muted hover:text-secondary'
            }`}
            title={userRating ? 'Edit your rating' : 'Rate this show'}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {userRating?.score != null ? userRating.score : 'Rate'}
          </button>
          </div>
        </div>
      </div>
    </div>
    <RatingModal
      isOpen={isRatingModalOpen}
      onClose={handleModalClose}
      tmdbShowId={show.id}
      showName={show.name}
      posterPath={show.poster_path}
      context="discover"
    />
    </>
  );
}
