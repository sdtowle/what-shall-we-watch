export interface Show {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  genres: Genre[];
  episode_run_time: number[];
  number_of_seasons: number;
  isTrending: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBShowBasic {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
}

export interface TMDBShowDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  genres: Genre[];
  episode_run_time: number[];
  number_of_seasons: number;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type Mode = 'food' | 'freetime' | null;

export const FOOD_GENRES = [35, 10764, 16, 10767]; // Comedy, Reality, Animation, Talk
export const ALL_GENRES = [
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 10759, name: 'Action & Adventure' },
  { id: 9648, name: 'Mystery' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 16, name: 'Animation' },
  { id: 10764, name: 'Reality' },
  { id: 10767, name: 'Talk' },
];

export const MIN_RATING = 6.0;
