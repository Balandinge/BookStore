export interface BookDetailsProps {
  title: string;
  price: string;
  rating: string;
  authors: string;
  publisher: string;
  year: string;
  image: string;
  desc: string;
  isbn13: string;
  onAddToCart: () => void;
  onAddBookmark: () => void;
  onRemoveBookmark: () => void;
  isBookmarked: boolean;
}
