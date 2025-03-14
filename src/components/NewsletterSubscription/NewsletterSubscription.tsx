import React from "react";
import styles from "./NewsletterSubscription.module.css";
import { NewsletterSubscriptionProps } from "../../types/newslettersubscription";

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  onSubscribe,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input") as HTMLInputElement;
    if (input && onSubscribe) {
      onSubscribe(input.value);
      input.value = "";
    }
  };

  return (
    <div className={styles.subscribeSection}>
      <h2 className={styles.subscribeTitle}>Subscribe to Newsletter</h2>
      <p className={styles.subscribeDescription}>
        Be the first to know about new IT books, upcoming releases, exclusive
        offers and more.
      </p>
      <form onSubmit={handleSubmit} className={styles.subscribeInputContainer}>
        <input
          type="email"
          placeholder="Your email"
          className={styles.subscribeInput}
        />
        <button type="submit" className={styles.subscribeButton}>
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};
