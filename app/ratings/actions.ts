'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { UserRating } from '@/lib/types';

export async function saveRating(
  tmdbShowId: number,
  score: number | null,
  liked: boolean | null
): Promise<{ success: boolean; error?: string }> {
  if (score !== null && (score < 1 || score > 10)) {
    return { success: false, error: 'Score must be between 1 and 10' };
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to rate shows' };
  }

  const { error } = await supabase
    .from('user_ratings')
    .upsert(
      {
        user_id: user.id,
        tmdb_show_id: tmdbShowId,
        score,
        liked,
        rated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,tmdb_show_id' }
    );

  if (error) {
    console.error('Error saving rating:', error);
    return { success: false, error: 'Failed to save rating' };
  }

  revalidatePath('/watchlist');
  return { success: true };
}

export async function getUserRating(tmdbShowId: number): Promise<UserRating | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_ratings')
    .select('*')
    .eq('user_id', user.id)
    .eq('tmdb_show_id', tmdbShowId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserRating;
}
