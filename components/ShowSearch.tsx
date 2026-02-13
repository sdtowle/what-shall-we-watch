'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { addToWatchlist } from '@/app/watchlist/actions';
import { useToast } from '@/contexts/ToastContext';

interface SearchResult {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
}

interface ShowSearchProps {
  onShowAdded: () => void;
}

export default function ShowSearch({ onShowAdded }: ShowSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function search() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/shows/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    search();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddShow = async (show: SearchResult) => {
    setAddingId(show.id);
    const result = await addToWatchlist(show.id, show.name, show.poster_path);

    if (result.success) {
      showToast(`"${show.name}" added to watchlist`);
      setQuery('');
      setResults([]);
      setIsOpen(false);
      onShowAdded();
    } else {
      showToast(result.error || 'Failed to add show', 'error');
    }

    setAddingId(null);
  };

  const getYear = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).getFullYear().toString();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for a show to add..."
          className="w-full px-4 py-2 pl-10 bg-background border border-text-muted/20 rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-surface border border-text-muted/20 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {results.map((show) => (
            <button
              key={show.id}
              onClick={() => handleAddShow(show)}
              disabled={addingId === show.id}
              className="w-full flex items-center gap-3 p-2 hover:bg-background transition-colors text-left disabled:opacity-50"
            >
              {show.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${show.poster_path}`}
                  alt={show.name}
                  className="w-10 h-14 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-14 bg-background rounded flex items-center justify-center">
                  <span className="text-text-muted text-xs">N/A</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main truncate">
                  {show.name}
                </p>
                <p className="text-xs text-text-muted">{getYear(show.first_air_date)}</p>
              </div>
              {addingId === show.id ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-5 h-5 text-primary shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && query && !isLoading && results.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-surface border border-text-muted/20 rounded-lg shadow-xl p-4 text-center text-text-muted text-sm">
          No shows found
        </div>
      )}
    </div>
  );
}
