import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../../types/book";
import { SearchState } from "../../types/search";

const initialState: SearchState = {
  results: [],
  total: "0",
  currentPage: 1,
  loading: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchResults(
      state,
      action: PayloadAction<{ books: Book[]; total: string }>
    ) {
      return {
        ...state,
        results: action.payload.books,
        total: action.payload.total,
        loading: false,
      };
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      return { ...state, currentPage: action.payload };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      return { ...state, loading: action.payload };
    },
  },
});

export const { setSearchResults, setCurrentPage, setLoading } =
  searchSlice.actions;
export default searchSlice.reducer;
