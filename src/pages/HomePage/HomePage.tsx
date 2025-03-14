import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchNewReleases } from "../../helpers/api";
import { setNewReleases, setLoading } from "../../redux/modules/books";
import BookCard from "../../components/BookCard/BookCard";
import styles from "./HomePage.module.css";
import { NewsletterSubscription } from "../../components/NewsletterSubscription/NewsletterSubscription";
import { AppDispatch, RootState } from "../../types/store";
import {
  syncBookmarksWithFirestore,
  syncCartWithFirestore,
} from "../../helpers/syncing";

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { newReleases, loading } = useSelector(
    (state: RootState) => state.books
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchNewReleases().then((books) => {
      dispatch(setNewReleases(books));
    });

    if (user) {
      dispatch(syncCartWithFirestore(user.uid));
      dispatch(syncBookmarksWithFirestore(user.uid));
    }
  }, [dispatch, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>NEW RELEASES BOOKS</h1>
      <div className={styles.grid}>
        {newReleases.map((book) => (
          <BookCard
            key={book.isbn13}
            title={book.title}
            price={book.price}
            image={book.image}
            onClick={() => navigate(`/book/${book.isbn13}`)}
          />
        ))}
      </div>
      <NewsletterSubscription />
    </main>
  );
};

export default HomePage;
