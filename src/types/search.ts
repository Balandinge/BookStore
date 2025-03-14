import { Book } from "./book";

export interface SearchResponse {
  books: Book[];
  total: string;
}
export interface SearchState {
  results: Book[];
  total: string;
  currentPage: number;
  loading: boolean;
}
