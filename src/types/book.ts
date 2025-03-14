export interface Book {
  quantity?: number;
  title: string;
  subtitle: string;
  authors: string;
  publisher: string;
  isbn13: string;
  pages: string;
  year: string;
  rating: string;
  desc: string;
  price: string;
  image: string;
}

export interface BooksState {
  currentBook: Book | null;
  newReleases: Book[];
  loading: boolean;
}
