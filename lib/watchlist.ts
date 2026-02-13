export type WatchStatus = 'want_to_watch' | 'watching' | 'dropped';

export interface SavedShow {
  id: string;
  user_id: string;
  tmdb_show_id: number;
  show_name: string;
  poster_path: string | null;
  status: WatchStatus;
  added_at: string;
}

export const STATUS_CONFIG: Record<WatchStatus, { label: string; color: string }> = {
  want_to_watch: { label: 'Want to Watch', color: 'bg-primary/20 text-primary' },
  watching: { label: 'Watching', color: 'bg-green-500/20 text-green-400' },
  dropped: { label: 'Dropped', color: 'bg-red-500/20 text-red-400' },
};
