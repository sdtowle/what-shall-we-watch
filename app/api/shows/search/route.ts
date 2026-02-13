import { NextRequest, NextResponse } from 'next/server';
import { searchShows } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || !query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchShows(query);
    const limitedResults = results.slice(0, 10).map((show) => ({
      id: show.id,
      name: show.name,
      poster_path: show.poster_path,
      first_air_date: show.first_air_date,
    }));

    return NextResponse.json({ results: limitedResults });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search shows' }, { status: 500 });
  }
}
