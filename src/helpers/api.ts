import axios from "axios";
import { Book } from "../types/book";

const API_BASE_URL = "https://api.itbook.store/1.0";

export const fetchBookByIsbn = async (isbn13: string): Promise<Book> => {
  const response = await axios.get(`${API_BASE_URL}/books/${isbn13}`);
  return response.data as Book;
};

export const fetchNewReleases = async (): Promise<Book[]> => {
  const response = await axios.get(`${API_BASE_URL}/new`);
  return response.data.books as Book[];
};

export const searchBooks = async (
  query: string,
  page: number = 1
): Promise<{ books: Book[]; total: string }> => {
  const response = await axios.get(`${API_BASE_URL}/search/${query}/${page}`);
  return response.data as { books: Book[]; total: string };
};
