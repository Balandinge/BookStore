import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItemWithSync,
  removeFromCartWithSync,
  updateCartInFirestore,
} from "../../redux/store";
import { CartItem } from "../../types/cart";
import styles from "./CartPage.module.css";
import { AppDispatch, RootState } from "../../types/store";
import { syncCartWithFirestore } from "../../helpers/syncing";
import { setCartItems } from "../../redux/modules/cart";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  ) as CartItem[];

  useEffect(() => {
    if (user) {
      dispatch(syncCartWithFirestore(user.uid));
    } else {
      dispatch({ type: "cart/clearCart" });
    }
  }, [dispatch, user]);

  const handleRemoveFromCart = (isbn13: string) => {
    if (user) {
      dispatch(removeFromCartWithSync(isbn13, user.uid));
    }
  };

  const handleIncreaseQuantity = (isbn13: string) => {
    if (user) {
      const item = cartItems.find((item) => item.isbn13 === isbn13);
      if (item) {
        const newQuantity = (item.quantity || 1) + 1;
        dispatch(updateCartItemWithSync(isbn13, newQuantity, user.uid));
      }
    }
  };

  const handleDecreaseQuantity = (isbn13: string) => {
    if (user) {
      const item = cartItems.find((item) => item.isbn13 === isbn13);
      if (item && (item.quantity || 1) > 1) {
        const newQuantity = (item.quantity || 1) - 1;
        dispatch(updateCartItemWithSync(isbn13, newQuantity, user.uid));
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const totalPrice = cartItems
    .reduce((sum, item) => {
      const price = parseFloat(item.price.replace("$", "")) || 0;
      return sum + price * (item.quantity || 1);
    }, 0)
    .toFixed(2);

  const getItemTotal = (item: CartItem) => {
    const price = parseFloat(item.price.replace("$", "")) || 0;
    const total = price * (item.quantity || 1);
    return total.toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.cartContainer}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src="/Arrow.png" alt="Back" />
          </button>
          <h1 className={styles.cartTitle}>Cart</h1>
          <p className={styles.emptyMessage}>Your cart is empty</p>
        </div>
      </main>
    );
  }
  const handleCheckout = () => {
    if (user) {
      alert("Your order will be processed soon");
      dispatch(setCartItems([]));
      dispatch(updateCartInFirestore(user.uid, []));
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.cartContainer}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src="/Arrow.png" alt="Back" />
        </button>
        <h1 className={styles.cartTitle}>Cart</h1>
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.isbn13} className={styles.cartItem}>
              <div className={styles.imageContainer}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.itemImage}
                />
              </div>
              <h2 className={styles.itemTitle}>{item.title}</h2>
              <div className={styles.quantityControl}>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleDecreaseQuantity(item.isbn13)}
                >
                  <img
                    src="/Minus.png"
                    alt="Minus"
                    className={styles.quantityIcon}
                  />
                </button>
                <span className={styles.quantityText}>
                  {item.quantity || 1}
                </span>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleIncreaseQuantity(item.isbn13)}
                >
                  <img
                    src="/Plus.png"
                    alt="Plus"
                    className={styles.quantityIcon}
                  />
                </button>
              </div>
              <div className={styles.itemTotal}>${getItemTotal(item)}</div>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveFromCart(item.isbn13)}
              >
                <img
                  src="/Cancel.png"
                  alt="Remove"
                  className={styles.removeIcon}
                />
              </button>
            </div>
          ))}
        </div>
        <div className={styles.cartSummary}>
          <div className={styles.totalContainer}>
            <p className={styles.totalLabel}>Total:</p>
            <p className={styles.totalPrice}>${totalPrice}</p>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
