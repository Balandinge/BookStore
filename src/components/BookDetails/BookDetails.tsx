import React from "react";
import { ChevronLeft } from "lucide-react";
import styles from "./BookDetails.module.css";
import { BookDetailsProps } from "../../types/bookdetails";

export const BookDetails: React.FC<BookDetailsProps> = ({
  title,
  price,
  rating,
  authors,
  publisher,
  year,
  image,
  desc,
  onAddToCart,
  onAddBookmark,
  onRemoveBookmark,
  isBookmarked,
}) => {
  const parsedRating = parseFloat(rating) || 0;

  return (
    <div className={styles.bookContainer}>
      <button
        className={styles.backButton}
        onClick={() => window.history.back()}
      >
        <ChevronLeft className={styles.backIcon} />
      </button>
      <h1 className={styles.bookTitle}>{title}</h1>
      <div className={styles.bookImageContainer}>
        <img src={image} alt={title} className={styles.bookImage} />
        <button
          className={styles.bookmarkButton}
          onClick={isBookmarked ? onRemoveBookmark : onAddBookmark}
        >
          ♥
        </button>
      </div>
      <div className={styles.bookInfo}>
        <div className={styles.bookPrice}>{price}</div>
        <div className={styles.bookRating}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={styles.star}
              style={{
                color: i < parsedRating ? "#000000" : "rgba(231, 231, 231, 1)",
              }}
            >
              ★
            </span>
          ))}
        </div>
        <div className={styles.infoLabel}>Authors</div>
        <div className={styles.infoValue}>{authors}</div>
        <div className={styles.infoLabel}>Publisher</div>
        <div className={styles.infoValue}>{publisher}</div>
        <div className={styles.infoLabel}>Year</div>
        <div className={styles.infoValue}>
          {year || new Date().getFullYear()}
        </div>
        <button className={styles.addToCartButton} onClick={onAddToCart}>
          ADD TO CART
        </button>
      </div>
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>Description</h2>
        <p className={styles.descriptionText}>{desc}</p>
      </div>
    </div>
  );
};
