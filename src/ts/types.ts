export type FilterName = 'Muscles' | 'Body parts' | 'Equipment';

export type ExerciseQueryKey = 'muscles' | 'bodypart' | 'equipment';

export interface PaginatedResponse<T> {
  page: number | string;
  perPage: number | string;
  totalPages: number;
  results: T[];
}

export interface FilterItem {
  filter: FilterName;
  name: string;
  imgURL: string;
}

export interface Exercise {
  _id: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  name: string;
  target: string;
  description: string;
  rating: number;
  burnedCalories: number;
  time: number;
  popularity: number;
}

export interface Quote {
  author: string;
  quote: string;
}

export interface RatingPayload {
  rate: number;
  email: string;
  review: string;
}
