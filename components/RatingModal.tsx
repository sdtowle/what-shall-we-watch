'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { saveRating, getUserRating } from '@/app/ratings/actions';
import { updateShowStatus } from '@/app/watchlist/actions';
import { useToast } from '@/contexts/ToastContext';
import { WatchStatus, STATUS_CONFIG } from '@/lib/watchlist';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tmdbShowId: number;
  showName: string;
  posterPath: string | null;
  context: 'discover' | 'watchlist';
  currentStatus?: WatchStatus;
  savedShowId?: string;
  onStatusChange?: (id: string, newStatus: WatchStatus) => void;
}

export default function RatingModal({
  isOpen,
  onClose,
  tmdbShowId,
  showName,
  posterPath,
  context,
  currentStatus,
  savedShowId,
  onStatusChange,
}: RatingModalProps) {
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [status, setStatus] = useState<WatchStatus | undefined>(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load existing rating when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    getUserRating(tmdbShowId).then((rating) => {
      if (rating) {
        setScore(rating.score);
        setLiked(rating.liked);
      } else {
        setScore(null);
        setLiked(null);
      }
      setIsLoading(false);
    });
    setStatus(currentStatus);
  }, [isOpen, tmdbShowId, currentStatus]);

  const handleClose = useCallback(() => {
    if (!isSaving) onClose();
  }, [isSaving, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const promises: Promise<{ success: boolean; error?: string }>[] = [
        saveRating(tmdbShowId, score, liked),
      ];

      if (context === 'watchlist' && savedShowId && status && status !== currentStatus) {
        promises.push(updateShowStatus(savedShowId, status));
      }

      const results = await Promise.all(promises);
      const failed = results.find((r) => !r.success);

      if (failed) {
        showToast(failed.error || 'Failed to save', 'error');
      } else {
        showToast('Rating saved');
        if (context === 'watchlist' && savedShowId && status && status !== currentStatus && onStatusChange) {
          onStatusChange(savedShowId, status);
        }
        onClose();
      }
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = score !== null || liked !== null;

  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w200${posterPath}`
    : null;

  if (!mounted || !isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Rate ${showName}`}
    >
      <div
        className="bg-surface rounded-2xl max-w-sm w-full shadow-2xl animate-slide-up sm:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-text-muted/10">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={showName}
              className="w-10 h-14 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-14 bg-background rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14m0 0V10m0 4H5a2 2 0 01-2-2V8a2 2 0 012-2h10v8z" />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-text-main text-sm leading-tight truncate">{showName}</h2>
            <p className="text-text-muted text-xs mt-0.5">Rate this show</p>
          </div>
          <button
            onClick={handleClose}
            className="text-text-muted hover:text-text-main transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Like / Dislike */}
              <div>
                <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wide">Did you like it?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLiked(liked === true ? null : true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                      liked === true
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'border-text-muted/20 text-text-muted hover:border-green-500/30 hover:text-green-400'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={liked === true ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Liked it
                  </button>
                  <button
                    onClick={() => setLiked(liked === false ? null : false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                      liked === false
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'border-text-muted/20 text-text-muted hover:border-red-500/30 hover:text-red-400'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={liked === false ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                    Not for me
                  </button>
                </div>
              </div>

              {/* Score */}
              <div>
                <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wide">Score</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setScore(score === n ? null : n)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                        score === n
                          ? 'bg-primary/20 border-primary/60 text-primary'
                          : 'border-text-muted/20 text-text-muted hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status (watchlist context only) */}
              {context === 'watchlist' && (
                <div>
                  <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wide">Status</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.keys(STATUS_CONFIG) as WatchStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          status === s
                            ? `${STATUS_CONFIG[s].color} border-current`
                            : 'border-text-muted/20 text-text-muted hover:border-text-muted/40'
                        }`}
                      >
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-text-muted/10">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 py-2.5 rounded-xl border border-text-muted/20 text-text-muted text-sm hover:border-text-muted/40 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
}
