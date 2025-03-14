import React from "react";
import styles from "./BookCard.module.css";
import { BookCardProps } from "../../types/bookcard";

const BookCard: React.FC<BookCardProps> = ({
  title,
  price,
  image,
  onClick,
}) => {
  return (
    <div className={styles.bookCard} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.bookImage} />
      </div>
      <h2 className={styles.bookTitle}>{title}</h2>
      <div className={styles.bookPrice}>{price}</div>
    </div>
  );
};

export default BookCard;
