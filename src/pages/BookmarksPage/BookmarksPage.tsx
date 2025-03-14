import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./BookmarksPage.module.css";
import { Heart } from "lucide-react";
import { AppDispatch, RootState } from "../../types/store";
import {
  removeBookmarkWithSync,
  syncBookmarksWithFirestore,
} from "../../helpers/syncing";

const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const bookmarks = useSelector((state: RootState) => state.bookmarks.items);

  useEffect(() => {
    if (user) {
      dispatch(syncBookmarksWithFirestore(user.uid));
    } else {
      dispatch({ type: "bookmarks/clearBookmarks" });
    }
  }, [dispatch, user]);

  const handleRemoveBookmark = (isbn13: string) => {
    if (user) {
      dispatch(removeBookmarkWithSync(isbn13, user.uid));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (bookmarks.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.bookmarksContainer}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src="/Arrow.png" alt="Back" />
          </button>
          <h1 className={styles.bookmarksTitle}>Bookmarks</h1>
          <p className={styles.emptyMessage}>Your bookmarks list is empty</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.bookmarksContainer}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src="/Arrow.png" alt="Back" />
        </button>
        <h1 className={styles.bookmarksTitle}>Bookmarks</h1>
        <div className={styles.bookmarksItems}>
          {bookmarks.map((book) => (
            <div key={book.isbn13} className={styles.bookmarkItem}>
              <div className={styles.imageContainer}>
                <img
                  src={book.image}
                  alt={book.title}
                  className={styles.itemImage}
                />
              </div>
              <h2
                className={styles.itemTitle}
                onClick={() => navigate(`/book/${book.isbn13}`)}
              >
                {book.title}
              </h2>
              <div className={styles.itemPrice}>{book.price}</div>
              <div className={styles.rating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={styles.star}
                    style={{
                      color:
                        i < parseFloat(book.rating || "0")
                          ? "#000000"
                          : "rgba(231, 231, 231, 1)",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className={styles.bookDetails}>
                {book.authors && <span>by {book.authors}</span>}
                {book.publisher && <span>, {book.publisher}</span>}
                {book.year && <span>, {book.year}</span>}
              </div>
              <button
                className={styles.bookmarkButton}
                onClick={() => handleRemoveBookmark(book.isbn13)}
              >
                <Heart
                  className={styles.bookmarkIcon}
                  fill="rgba(49, 48, 55, 1)"
                  color="rgba(49, 48, 55, 1)"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BookmarksPage;
