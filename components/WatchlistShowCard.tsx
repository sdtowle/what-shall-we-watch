'use client';

import { useState, useRef, useEffect } from 'react';
import { SavedShow, WatchStatus, STATUS_CONFIG } from '@/lib/watchlist';
import { updateShowStatus, removeFromWatchlist } from '@/app/watchlist/actions';
import { useToast } from '@/contexts/ToastContext';
import type { EnrichedShowData } from '@/lib/types';

interface WatchlistShowCardProps {
  show: SavedShow;
  enrichedData?: EnrichedShowData;
  detailsLoading: boolean;
  onRemove: (id: string) => void;
  onStatusChange: (id: string, newStatus: WatchStatus) => void;
}

function SkeletonBar({ className }: { className: string }) {
  return <div className={`animate-pulse bg-text-muted/20 rounded ${className}`} />;
}

export default function WatchlistShowCard({
  show,
  enrichedData,
  detailsLoading,
  onRemove,
  onStatusChange,
}: WatchlistShowCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w200${show.poster_path}`
    : null;

  const handleStatusChange = async (newStatus: WatchStatus) => {
    if (newStatus === show.status) {
      setDropdownOpen(false);
      return;
    }
    setIsUpdating(true);
    setDropdownOpen(false);

    const result = await updateShowStatus(show.id, newStatus);

    if (result.success) {
      onStatusChange(show.id, newStatus);
      showToast(`Status updated to "${STATUS_CONFIG[newStatus].label}"`);
    } else {
      showToast(result.error || 'Failed to update status', 'error');
    }

    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    const result = await removeFromWatchlist(show.id);

    if (result.success) {
      onRemove(show.id);
      showToast('Show removed from watchlist');
    } else {
      showToast(result.error || 'Failed to remove show', 'error');
    }

    setIsUpdating(false);
    setShowConfirmRemove(false);
  };

  const year = enrichedData?.first_air_date
    ? new Date(enrichedData.first_air_date).getFullYear()
    : null;

  const providers = enrichedData?.providers?.slice(0, 4) ?? [];

  return (
    <div className="bg-surface rounded-lg shadow-lg overflow-hidden flex">
      {/* Poster */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={show.show_name}
          className="w-20 shrink-0 object-cover"
        />
      ) : (
        <div className="w-20 shrink-0 bg-background flex items-center justify-center">
          <span className="text-text-muted text-xs text-center px-1">No poster</span>
        </div>
      )}

      {/* Content */}
      <div className="p-3 flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Title + Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text-main text-sm leading-tight truncate">
            {show.show_name}
          </h3>
          {detailsLoading ? (
            <SkeletonBar className="w-10 h-4 shrink-0" />
          ) : enrichedData ? (
            <div className="flex items-center gap-1 shrink-0">
              <svg className="w-3.5 h-3.5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-secondary font-semibold text-xs">
                {enrichedData.vote_average.toFixed(1)}
              </span>
            </div>
          ) : null}
        </div>

        {/* Genres + meta */}
        {detailsLoading ? (
          <div className="flex items-center gap-2">
            <SkeletonBar className="w-12 h-3.5" />
            <SkeletonBar className="w-10 h-3.5" />
            <SkeletonBar className="w-16 h-3" />
          </div>
        ) : enrichedData ? (
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            {enrichedData.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="px-1.5 py-0.5 text-[10px] rounded-full bg-primary/20 text-primary"
              >
                {genre.name}
              </span>
            ))}
            <span className="text-text-muted">
              {[year, enrichedData.number_of_seasons > 0 && `${enrichedData.number_of_seasons} season${enrichedData.number_of_seasons !== 1 ? 's' : ''}`].filter(Boolean).join(' · ')}
            </span>
          </div>
        ) : null}

        {/* Overview */}
        {detailsLoading ? (
          <div className="space-y-1">
            <SkeletonBar className="w-full h-3" />
            <SkeletonBar className="w-3/4 h-3" />
          </div>
        ) : enrichedData?.overview ? (
          <p className="text-text-muted text-xs line-clamp-2">{enrichedData.overview}</p>
        ) : null}

        {/* Providers + Actions */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <div className="flex items-center gap-2">
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={isUpdating}
                className={`text-xs px-2 py-1 rounded flex items-center gap-1.5 border border-text-muted/20 disabled:opacity-50 transition-colors ${STATUS_CONFIG[show.status].color}`}
              >
                {STATUS_CONFIG[show.status].label}
                <svg
                  className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute z-50 bottom-full left-0 mb-1 bg-surface border border-text-muted/20 rounded shadow-xl min-w-[140px]">
                  {(Object.keys(STATUS_CONFIG) as WatchStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`w-full text-left text-xs px-3 py-1.5 transition-colors hover:bg-background ${
                        status === show.status ? 'font-medium ' + STATUS_CONFIG[status].color : 'text-text-muted'
                      }`}
                    >
                      {STATUS_CONFIG[status].label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {showConfirmRemove ? (
              <div className="flex gap-1">
                <button
                  onClick={handleRemove}
                  disabled={isUpdating}
                  className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 disabled:opacity-50"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirmRemove(false)}
                  disabled={isUpdating}
                  className="text-xs px-2 py-1 bg-text-muted/20 text-text-muted rounded hover:bg-text-muted/30 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmRemove(true)}
                disabled={isUpdating}
                className="text-xs px-2 py-1 text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                title="Remove from watchlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Providers on the right */}
          {detailsLoading ? (
            <div className="flex gap-1.5">
              <SkeletonBar className="w-6 h-6 rounded" />
              <SkeletonBar className="w-6 h-6 rounded" />
            </div>
          ) : providers.length > 0 ? (
            <div className="flex gap-1.5">
              {providers.map((p) => (
                <img
                  key={p.provider_id}
                  src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                  alt={p.provider_name}
                  title={p.provider_name}
                  className="w-6 h-6 rounded"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
