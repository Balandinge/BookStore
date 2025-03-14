import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../../types/book";
import { BookmarksState } from "../../types/bookmarks";

const initialState: BookmarksState = {
  items: [],
};

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    addBookmark(state, action: PayloadAction<Book>) {
      return {
        ...state,
        items: state.items.some((item) => item.isbn13 === action.payload.isbn13)
          ? state.items
          : [...state.items, action.payload],
      };
    },
    removeBookmark(state, action: PayloadAction<string>) {
      return {
        ...state,
        items: state.items.filter((item) => item.isbn13 !== action.payload),
      };
    },
    setBookmarkItems(state, action: PayloadAction<Book[]>) {
      return { ...state, items: action.payload };
    },
    clearBookmarks(state) {
      return { ...state, items: [] };
    },
  },
});

export const { addBookmark, removeBookmark, setBookmarkItems, clearBookmarks } =
  bookmarksSlice.actions;
export default bookmarksSlice.reducer;
