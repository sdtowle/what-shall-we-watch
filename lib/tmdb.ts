import { TMDBShowBasic, TMDBShowDetails, TMDBResponse, TMDBWatchProvidersResponse, EnrichedShowData, Show, FOOD_GENRES, MIN_RATING, Mode } from './types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY environment variable is not set');
  }
  return apiKey;
}

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = getApiKey();
  const searchParams = new URLSearchParams({ api_key: apiKey, ...params });
  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;

  const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getTrendingShows(): Promise<TMDBShowBasic[]> {
  const data = await fetchFromTMDB<TMDBResponse<TMDBShowBasic>>('/trending/tv/week');
  return data.results;
}

export async function getPopularShows(page: number = 1): Promise<TMDBShowBasic[]> {
  const data = await fetchFromTMDB<TMDBResponse<TMDBShowBasic>>('/tv/popular', { page: page.toString() });
  return data.results;
}

export async function getShowDetails(id: number): Promise<TMDBShowDetails> {
  return fetchFromTMDB<TMDBShowDetails>(`/tv/${id}`);
}

export function filterByMode(shows: TMDBShowBasic[], mode: Mode): TMDBShowBasic[] {
  if (!mode) return shows;

  if (mode === 'food') {
    return shows.filter(show =>
      show.genre_ids.some(genreId => FOOD_GENRES.includes(genreId))
    );
  }

  // 'freetime' mode - all genres allowed
  return shows;
}

export function filterByGenre(shows: TMDBShowBasic[], genreId: number | null): TMDBShowBasic[] {
  if (!genreId) return shows;
  return shows.filter(show => show.genre_ids.includes(genreId));
}

export function filterByRating(shows: TMDBShowBasic[]): TMDBShowBasic[] {
  return shows.filter(show => show.vote_average >= MIN_RATING);
}

export function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

export async function getRandomShow(
  mode: Mode,
  genreId: number | null,
  trendingIds: Set<number>
): Promise<Show | null> {
  // Get both trending and popular shows
  const [trending, popular1, popular2] = await Promise.all([
    getTrendingShows(),
    getPopularShows(1),
    getPopularShows(2),
  ]);

  // Combine all shows, marking trending ones
  const allShowsBasic = [...trending, ...popular1, ...popular2];

  // Remove duplicates based on ID
  const uniqueShows = Array.from(
    new Map(allShowsBasic.map(show => [show.id, show])).values()
  );

  // Apply filters
  let filtered = filterByRating(uniqueShows);
  filtered = filterByMode(filtered, mode);
  filtered = filterByGenre(filtered, genreId);

  // Pick a random show
  const selected = pickRandom(filtered);

  if (!selected) return null;

  // Get full details for the selected show
  const details = await getShowDetails(selected.id);

  return {
    id: details.id,
    name: details.name,
    overview: details.overview,
    poster_path: details.poster_path,
    vote_average: details.vote_average,
    first_air_date: details.first_air_date,
    genres: details.genres,
    episode_run_time: details.episode_run_time,
    number_of_seasons: details.number_of_seasons,
    isTrending: trendingIds.has(details.id),
  };
}

export async function getTrendingIds(): Promise<Set<number>> {
  const trending = await getTrendingShows();
  return new Set(trending.map(show => show.id));
}

export async function getWatchProviders(id: number, region: string = 'GB'): Promise<TMDBWatchProvidersResponse['results'][string] | null> {
  const data = await fetchFromTMDB<TMDBWatchProvidersResponse>(`/tv/${id}/watch/providers`);
  return data.results[region] ?? null;
}

export async function getEnrichedShowData(id: number, region: string = 'GB'): Promise<EnrichedShowData> {
  const [details, providerData] = await Promise.all([
    getShowDetails(id),
    getWatchProviders(id, region),
  ]);

  return {
    overview: details.overview,
    vote_average: details.vote_average,
    first_air_date: details.first_air_date,
    genres: details.genres,
    number_of_seasons: details.number_of_seasons,
    episode_run_time: details.episode_run_time,
    providers: providerData?.flatrate ?? [],
  };
}

export async function searchShows(query: string): Promise<TMDBShowBasic[]> {
  if (!query.trim()) return [];
  const data = await fetchFromTMDB<TMDBResponse<TMDBShowBasic>>('/search/tv', { query });
  return data.results;
}
