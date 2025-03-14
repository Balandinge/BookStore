import {
  configureStore,
  combineReducers,
  UnknownAction,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import booksReducer from "./modules/books";
import bookmarksReducer, { addBookmark } from "./modules/bookmarks";
import searchReducer from "./modules/search";
import authReducer from "./modules/auth";
import cartReducer, { setCartItems } from "./modules/cart";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Book } from "../types/book";
import { fetchBookByIsbn } from "../helpers/api";
import { AppDispatch, RootState } from "../types/store";
import { updateBookmarksInFirestore } from "../helpers/syncing";

const rootReducer = combineReducers({
  books: booksReducer,
  cart: cartReducer,
  bookmarks: bookmarksReducer,
  search: searchReducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "bookmarks"],
};

const persistedReducer = persistReducer<
  ReturnType<typeof rootReducer>,
  UnknownAction
>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export const updateCartInFirestore = (userId: string, items: Book[]) => {
  return async (dispatch: AppDispatch) => {
    const cartRef = doc(db, "carts", userId);
    await setDoc(cartRef, { items }, { merge: true });
    dispatch(setCartItems(items));
  };
};

export const addToCartWithSync = (book: Book, userId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const currentCart = getState().cart.items;
    const bookIndex = currentCart.findIndex(
      (item) => item.isbn13 === book.isbn13
    );

    let updatedCart;
    if (bookIndex >= 0) {
      updatedCart = currentCart.map((item, index) =>
        index === bookIndex
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...book, quantity: 1 }];
    }

    dispatch(setCartItems(updatedCart));
    dispatch(updateCartInFirestore(userId, updatedCart));
  };
};

export const updateCartItemWithSync = (
  isbn13: string,
  quantity: number,
  userId: string
) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const currentCart = getState().cart.items;
    const updatedCart = currentCart.map((item) =>
      item.isbn13 === isbn13 ? { ...item, quantity } : item
    );

    dispatch(setCartItems(updatedCart));
    dispatch(updateCartInFirestore(userId, updatedCart));
  };
};

export const removeFromCartWithSync = (isbn13: string, userId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const currentCart = getState().cart.items;
    const updatedCart = currentCart.filter((item) => item.isbn13 !== isbn13);

    dispatch(setCartItems(updatedCart));
    dispatch(updateCartInFirestore(userId, updatedCart));
  };
};

export const addBookmarkWithSync = (book: Book, userId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const fullBookData = await fetchBookByIsbn(book.isbn13);
    const updatedBook = {
      ...book,
      authors: fullBookData?.authors || "Unknown author",
      publisher: fullBookData?.publisher || "Unknown publisher",
      year: fullBookData?.year || "N/A",
      rating: fullBookData?.rating || "0",
    };

    dispatch(addBookmark(updatedBook));

    const state = getState();
    const bookmarkItems = state.bookmarks.items;

    dispatch(updateBookmarksInFirestore(userId, bookmarkItems));
  };
};
