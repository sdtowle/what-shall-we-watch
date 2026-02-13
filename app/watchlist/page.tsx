'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ShowSearch from '@/components/ShowSearch';
import WatchlistShowCard from '@/components/WatchlistShowCard';
import { useShowDetails } from '@/hooks/useShowDetails';
import { getWatchlist } from './actions';
import type { SavedShow, WatchStatus } from '@/lib/watchlist';
import { STATUS_CONFIG } from '@/lib/watchlist';

type FilterTab = 'all' | WatchStatus;

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shows, setShows] = useState<SavedShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const fetchShows = async () => {
    setLoading(true);
    const data = await getWatchlist();
    setShows(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchShows();
  }, [user, authLoading, router]);

  const handleRemove = (id: string) => {
    setShows((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: WatchStatus) => {
    setShows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const tmdbIds = useMemo(() => shows.map((s) => s.tmdb_show_id), [shows]);
  const { details, loading: detailsLoading } = useShowDetails(tmdbIds);

  const filteredShows =
    activeFilter === 'all'
      ? shows
      : shows.filter((s) => s.status === activeFilter);

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    ...Object.entries(STATUS_CONFIG).map(([key, config]) => ({
      key: key as FilterTab,
      label: config.label,
    })),
  ];

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text-main mb-6">My Watchlist</h1>

      <div className="mb-6">
        <ShowSearch onShowAdded={fetchShows} />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
              activeFilter === tab.key
                ? 'bg-primary text-background font-medium'
                : 'bg-surface text-text-muted hover:text-text-main'
            }`}
          >
            {tab.label}
            {tab.key === 'all'
              ? ` (${shows.length})`
              : ` (${shows.filter((s) => s.status === tab.key).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredShows.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg mb-2">
            {activeFilter === 'all'
              ? 'Your watchlist is empty'
              : `No shows with status "${STATUS_CONFIG[activeFilter as WatchStatus].label}"`}
          </p>
          {activeFilter === 'all' && (
            <p className="text-text-muted text-sm">
              Search for shows above or discover one from the{' '}
              <button
                onClick={() => router.push('/')}
                className="text-primary hover:underline"
              >
                homepage
              </button>
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredShows.map((show) => (
            <WatchlistShowCard
              key={show.id}
              show={show}
              enrichedData={details[show.tmdb_show_id.toString()]}
              detailsLoading={detailsLoading}
              onRemove={handleRemove}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
