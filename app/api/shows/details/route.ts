import { NextRequest, NextResponse } from 'next/server';
import { getEnrichedShowData } from '@/lib/tmdb';
import type { EnrichedShowData } from '@/lib/types';

const MAX_IDS = 20;

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids');
  const region = request.nextUrl.searchParams.get('region') || 'GB';

  if (!idsParam) {
    return NextResponse.json({ error: 'ids parameter is required' }, { status: 400 });
  }

  const ids = idsParam.split(',').map(Number).filter((id) => !isNaN(id) && id > 0);

  if (ids.length === 0) {
    return NextResponse.json({ error: 'No valid IDs provided' }, { status: 400 });
  }

  if (ids.length > MAX_IDS) {
    return NextResponse.json({ error: `Maximum ${MAX_IDS} IDs allowed` }, { status: 400 });
  }

  const results = await Promise.allSettled(
    ids.map((id) => getEnrichedShowData(id, region))
  );

  const data: Record<string, EnrichedShowData> = {};
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      data[ids[index].toString()] = result.value;
    }
  });

  return NextResponse.json({ data });
}
