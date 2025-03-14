import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchBooks } from "../../helpers/api";
import {
  setSearchResults,
  setCurrentPage,
  setLoading,
} from "../../redux/modules/search";
import BookCard from "../../components/BookCard/BookCard";
import styles from "./SearchPage.module.css";
import { AppDispatch, RootState } from "../../types/store";

const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const { results, total, currentPage, loading } = useSelector(
    (state: RootState) => state.search
  );

  useEffect(() => {
    if (query) {
      dispatch(setLoading(true));
      searchBooks(query, page).then((data) => {
        dispatch(setSearchResults(data));
        dispatch(setCurrentPage(page));
      });
    } else {
      dispatch(setSearchResults({ books: [], total: "0" }));
    }
  }, [query, page, dispatch]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({ q: query, page: newPage.toString() });
    }
  };

  const totalPages = Math.ceil(parseInt(total) / 10);

  const getPaginationDisplay = () => {
    const pagesToShow: (number | string)[] = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pagesToShow.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 1) {
        pagesToShow.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pagesToShow.push(
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pagesToShow;
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <main>
      {query ? (
        results.length === 0 ? (
          <div className={styles.empty}>Found nothing</div>
        ) : (
          <>
            <h1 className={styles.searchTitle}>
              {query.toUpperCase()} SEARCH RESULTS
            </h1>
            <p className={styles.searchCount}>Found {total} books</p>
            <div className={styles.grid}>
              {results.map((book) => (
                <BookCard
                  key={book.isbn13}
                  title={book.title}
                  price={book.price}
                  image={book.image}
                  onClick={() => navigate(`/book/${book.isbn13}`)}
                />
              ))}
            </div>
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.prevButton}
              >
                <img src="/Prev.png" alt="Prev" className={styles.prevIcon} />
                <span className={currentPage === 1 ? styles.disabled : ""}>
                  Prev
                </span>
              </button>
              <div className={styles.pageNumbers}>
                {getPaginationDisplay().map((pageNum, index) =>
                  typeof pageNum === "string" ? (
                    <span key={index} className={styles.dots}>
                      {pageNum}
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={
                        currentPage === pageNum
                          ? styles.activePage
                          : styles.inactivePage
                      }
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.nextButton}
              >
                <span
                  className={currentPage === totalPages ? styles.disabled : ""}
                >
                  Next
                </span>
                <img src="/Next.png" alt="Next" className={styles.nextIcon} />
              </button>
            </div>
          </>
        )
      ) : (
        <div className={styles.empty}>Search</div>
      )}
    </main>
  );
};

export default SearchPage;
