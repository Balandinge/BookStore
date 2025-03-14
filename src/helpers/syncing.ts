import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { removeBookmark, setBookmarkItems } from "../redux/modules/bookmarks";
import { AppDispatch, RootState } from "../types/store";
import { db } from "../firebase";
import { Book } from "../types/book";
import { setCartItems } from "../redux/modules/cart";

export const removeBookmarkWithSync = (isbn13: string, userId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(removeBookmark(isbn13));
    const state = getState();
    const bookmarkItems = state.bookmarks.items;
    dispatch(updateBookmarksInFirestore(userId, bookmarkItems));
  };
};

export const syncBookmarksWithFirestore = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    const bookmarksRef = doc(db, "bookmarks", userId);
    try {
      const docSnap = await getDoc(bookmarksRef);
      if (docSnap.exists()) {
        const bookmarksData = docSnap.data() as { items: Book[] };
        dispatch(setBookmarkItems(bookmarksData.items || []));
      } else {
        dispatch(setBookmarkItems([]));
      }

      const unsubscribe = onSnapshot(bookmarksRef, (docSnap) => {
        if (docSnap.exists()) {
          const bookmarksData = docSnap.data() as { items: Book[] };
          dispatch(setBookmarkItems(bookmarksData.items || []));
        } else {
          dispatch(setBookmarkItems([]));
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Ошибка синхронизации закладок:", err);
    }
  };
};

export const initializeSyncWithFirestore = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(syncCartWithFirestore(userId));
    dispatch(syncBookmarksWithFirestore(userId));
  };
};

export const syncCartWithFirestore = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    const cartRef = doc(db, "carts", userId);
    try {
      const docSnap = await getDoc(cartRef);
      if (docSnap.exists()) {
        const cartData = docSnap.data() as { items: Book[] };
        dispatch(setCartItems(cartData.items || []));
      } else {
        dispatch(setCartItems([]));
      }

      const unsubscribe = onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) {
          const cartData = docSnap.data() as { items: Book[] };
          dispatch(setCartItems(cartData.items || []));
        } else {
          dispatch(setCartItems([]));
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Ошибка синхронизации корзины:", err);
    }
  };
};

export const updateBookmarksInFirestore = (userId: string, items: Book[]) => {
  return async (dispatch: AppDispatch) => {
    const bookmarksRef = doc(db, "bookmarks", userId);
    await setDoc(bookmarksRef, { items }, { merge: true });
    dispatch(setBookmarkItems(items));
  };
};
