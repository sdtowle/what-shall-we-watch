'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { WatchStatus, SavedShow } from '@/lib/watchlist';

export async function getWatchlist(): Promise<SavedShow[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('saved_shows')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }

  return data as SavedShow[];
}

export async function addToWatchlist(
  tmdbShowId: number,
  showName: string,
  posterPath: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to save shows' };
  }

  const { error } = await supabase.from('saved_shows').insert({
    user_id: user.id,
    tmdb_show_id: tmdbShowId,
    show_name: showName,
    poster_path: posterPath,
    status: 'want_to_watch',
  });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Show is already in your watchlist' };
    }
    console.error('Error adding to watchlist:', error);
    return { success: false, error: 'Failed to add show to watchlist' };
  }

  revalidatePath('/watchlist');
  return { success: true };
}

export async function updateShowStatus(
  savedShowId: string,
  newStatus: WatchStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const { error } = await supabase
    .from('saved_shows')
    .update({ status: newStatus })
    .eq('id', savedShowId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating status:', error);
    return { success: false, error: 'Failed to update status' };
  }

  revalidatePath('/watchlist');
  return { success: true };
}

export async function removeFromWatchlist(
  savedShowId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const { error } = await supabase
    .from('saved_shows')
    .delete()
    .eq('id', savedShowId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error removing from watchlist:', error);
    return { success: false, error: 'Failed to remove show' };
  }

  revalidatePath('/watchlist');
  return { success: true };
}

export async function isShowInWatchlist(tmdbShowId: number): Promise<boolean> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data } = await supabase
    .from('saved_shows')
    .select('id')
    .eq('user_id', user.id)
    .eq('tmdb_show_id', tmdbShowId)
    .single();

  return !!data;
}
