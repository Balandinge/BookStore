import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book, BooksState } from "../../types/book";

const initialState: BooksState = {
  currentBook: null,
  newReleases: [],
  loading: false,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setCurrentBook(state, action: PayloadAction<Book>) {
      return {
        ...state,
        currentBook: action.payload,
        loading: false,
      };
    },
    setNewReleases(state, action: PayloadAction<Book[]>) {
      return {
        ...state,
        newReleases: action.payload,
        loading: false,
      };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      return { ...state, loading: action.payload };
    },
  },
});

export const { setCurrentBook, setNewReleases, setLoading } =
  booksSlice.actions;
export default booksSlice.reducer;
