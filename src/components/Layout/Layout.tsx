import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { useSelector } from "react-redux";
import styles from "./Layout.module.css";
import { RootState } from "../../types/store";

export const Layout = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <img
          src="/Bookstore.png"
          alt="BOOKSTORE"
          className={styles.logo}
          onClick={() => navigate("/")}
        />

        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search"
              className={styles.searchInput}
            />
            <Search className={styles.searchIcon} onClick={handleSearch} />
          </div>
        </div>

        <div className={styles.icons}>
          <Heart
            className={styles.icon}
            onClick={() => navigate("/bookmarks")}
          />
          <ShoppingBag
            className={styles.icon}
            onClick={() => navigate("/cart")}
          />
          <User className={styles.icon} onClick={() => navigate("/auth")}>
            {user ? "Профиль" : "Войти"}
          </User>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>© 2025 Bookstore</p>
        <p className={styles.footerText}>All Rights Reserved</p>
      </footer>
    </div>
  );
};
