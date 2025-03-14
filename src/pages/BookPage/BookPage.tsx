import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookByIsbn } from "../../helpers/api";
import { setCurrentBook, setLoading } from "../../redux/modules/books";
import { addToCartWithSync, addBookmarkWithSync } from "../../redux/store";
import { Heart } from "lucide-react";
import styles from "./BookPage.module.css";
import { NewsletterSubscription } from "../../components/NewsletterSubscription/NewsletterSubscription";
import { AppDispatch, RootState } from "../../types/store";
import {
  removeBookmarkWithSync,
  syncBookmarksWithFirestore,
  syncCartWithFirestore,
} from "../../helpers/syncing";

const BookPage: React.FC = () => {
  const { isbn13 } = useParams<{ isbn13: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentBook, loading } = useSelector(
    (state: RootState) => state.books
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const bookmarks = useSelector((state: RootState) => state.bookmarks.items);

  useEffect(() => {
    if (isbn13) {
      dispatch(setLoading(true));
      fetchBookByIsbn(isbn13).then((data) => {
        dispatch(setCurrentBook(data));
      });

      if (user) {
        dispatch(syncCartWithFirestore(user.uid));
        dispatch(syncBookmarksWithFirestore(user.uid));
      }
    }
  }, [isbn13, dispatch, user]);

  const handleAddToCart = () => {
    if (currentBook && user) {
      dispatch(addToCartWithSync(currentBook, user.uid));
      alert("The book has been added to the cart");
    } else {
      navigate("/auth");
    }
  };

  const handleAddBookmark = () => {
    if (currentBook && user) {
      dispatch(addBookmarkWithSync(currentBook, user.uid));
    } else {
      navigate("/auth");
    }
  };

  const handleRemoveBookmark = () => {
    if (currentBook && isbn13 && user) {
      dispatch(removeBookmarkWithSync(isbn13, user.uid));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div>Загрузка...</div>;
  if (!currentBook) return <div>Книга не найдена</div>;

  const isBookmarked = bookmarks.some(
    (item) => item.isbn13 === currentBook.isbn13
  );
  const rating = parseFloat(currentBook.rating) || 0;

  return (
    <main className={styles.main}>
      <div className={styles.bookContainer}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src="/Arrow.png" alt="Back" className={styles.backIcon} />
        </button>
        <h1 className={styles.bookTitle}>{currentBook.title}</h1>
        <div className={styles.bookContent}>
          <div className={styles.bookImageContainer}>
            <img
              src={currentBook.image}
              alt={currentBook.title}
              className={styles.bookImage}
            />
            <button
              className={styles.bookmarkButton}
              onClick={isBookmarked ? handleRemoveBookmark : handleAddBookmark}
            >
              <Heart
                className={styles.bookmarkIcon}
                fill={isBookmarked ? "rgba(49, 48, 55, 1)" : "none"}
                color={
                  isBookmarked
                    ? "rgba(49, 48, 55, 1)"
                    : "rgba(168, 168, 168, 1)"
                }
              />
            </button>
          </div>
          <div className={styles.bookInfo}>
            <div className={styles.priceRatingContainer}>
              <div className={styles.bookPrice}>{currentBook.price}</div>
              <div className={styles.bookRating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={styles.star}
                    style={{
                      color: i < rating ? "#000000" : "rgba(231, 231, 231, 1)",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Authors</div>
              <div className={styles.infoValue}>{currentBook.authors}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Publisher</div>
              <div className={styles.infoValue}>{currentBook.publisher}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Year</div>
              <div className={styles.infoValue}>{currentBook.year}</div>
            </div>
            <button
              className={styles.addToCartButton}
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <div className={styles.descriptionSection}>
          <h2 className={styles.descriptionTitle}>Description</h2>
          <p className={styles.descriptionText}>{currentBook.desc}</p>
        </div>
        <NewsletterSubscription
          onSubscribe={(email) => console.log("Subscribed:", email)}
        />
      </div>
    </main>
  );
};

export default BookPage;
