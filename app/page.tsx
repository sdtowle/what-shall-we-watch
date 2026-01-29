'use client';

import { useState } from 'react';
import { Show, Mode } from '@/lib/types';
import ShowCard from '@/components/ShowCard';
import ModeSelector from '@/components/ModeSelector';
import GenreSelector from '@/components/GenreSelector';
import SpinButton from '@/components/SpinButton';

export default function Home() {
  const [show, setShow] = useState<Show | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    // Reset genre if switching to food mode and current genre isn't available
    if (newMode === 'food') {
      const foodGenres = [35, 10764, 16, 10767];
      if (selectedGenre && !foodGenres.includes(selectedGenre)) {
        setSelectedGenre(null);
      }
    }
  };

  const handlePickShow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (mode) params.set('mode', mode);
      if (selectedGenre) params.set('genre', selectedGenre.toString());

      const response = await fetch(`/api/shows?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch show');
      }

      setShow(data.show);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            What Shall We Watch?
          </h1>
          <p className="text-text-muted">
            Let us pick your next binge-worthy show
          </p>
        </header>

        {/* Filters */}
        <section className="space-y-4">
          <div className="flex justify-center">
            <ModeSelector mode={mode} onChange={handleModeChange} />
          </div>

          <GenreSelector
            selectedGenre={selectedGenre}
            mode={mode}
            onChange={setSelectedGenre}
          />
        </section>

        {/* Spin Button */}
        <div className="flex justify-center">
          <SpinButton onClick={handlePickShow} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center p-4 rounded-xl bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        {/* Show Card */}
        {show && !isLoading && (
          <section className="pt-4">
            <ShowCard show={show} />
          </section>
        )}

        {/* Empty State */}
        {!show && !isLoading && !error && (
          <div className="text-center py-12 text-text-muted">
            <div className="text-6xl mb-4">📺</div>
            <p>Press the button to discover your next show!</p>
          </div>
        )}
      </div>
    </main>
  );
}
