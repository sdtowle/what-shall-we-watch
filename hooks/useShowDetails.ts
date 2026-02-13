import { useState, useEffect, useMemo } from 'react';
import type { EnrichedShowData } from '@/lib/types';

export function useShowDetails(tmdbIds: number[]) {
  const [details, setDetails] = useState<Record<string, EnrichedShowData>>({});
  const [loading, setLoading] = useState(false);

  const idsKey = useMemo(
    () => [...tmdbIds].sort((a, b) => a - b).join(','),
    [tmdbIds]
  );

  useEffect(() => {
    if (!idsKey) return;

    let cancelled = false;

    async function fetchDetails() {
      setLoading(true);
      try {
        const response = await fetch(`/api/shows/details?ids=${idsKey}`);
        if (response.ok && !cancelled) {
          const json = await response.json();
          setDetails(json.data);
        }
      } catch {
        // Silently fail — cards fall back to basic view
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetails();

    return () => { cancelled = true; };
  }, [idsKey]);

  return { details, loading };
}
