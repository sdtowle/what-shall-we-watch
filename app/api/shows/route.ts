import { NextRequest, NextResponse } from 'next/server';
import { getRandomShow, getTrendingIds } from '@/lib/tmdb';
import { Mode } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('mode') as Mode;
    const genreParam = searchParams.get('genre');
    const genreId = genreParam ? parseInt(genreParam, 10) : null;

    // Get trending IDs to mark trending shows
    const trendingIds = await getTrendingIds();

    // Get a random show with filters applied
    const show = await getRandomShow(mode, genreId, trendingIds);

    if (!show) {
      return NextResponse.json(
        { error: 'No shows found matching your criteria' },
        { status: 404 }
      );
    }

    return NextResponse.json({ show });
  } catch (error) {
    console.error('Error fetching shows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shows' },
      { status: 500 }
    );
  }
}
