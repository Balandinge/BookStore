import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { setUser, setLoading } from "../../redux/modules/auth";
import { ChevronLeft } from "lucide-react";
import styles from "./AuthPage.module.css";
import { AppDispatch, RootState } from "../../types/store";
import { initializeSyncWithFirestore } from "../../helpers/syncing";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(setLoading(false));
      if (firebaseUser) {
        dispatch(
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email || "" })
        );
        dispatch(initializeSyncWithFirestore(firebaseUser.uid));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (user) {
        if (newPassword && currentPassword) {
          const credential = EmailAuthProvider.credential(
            user.email || "",
            currentPassword
          );
          await reauthenticateWithCredential(auth.currentUser!, credential);
          await updatePassword(auth.currentUser!, newPassword);
          setCurrentPassword("");
          setNewPassword("");
        }
      } else {
        if (isLoginForm) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          alert("Sign up succeeded");
          navigate(-1);
          setEmail("");
          setPassword("");
        }
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    dispatch(setLoading(true));
    try {
      await auth.signOut();
      dispatch(setUser(null));
      navigate("/auth");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSwitchToSignIn = () => {
    setEmail("");
    setPassword("");
    setIsLoginForm(true);
  };

  const handleSwitchToSignUp = () => {
    setEmail("");
    setPassword("");
    setIsLoginForm(false);
  };

  if (!user) {
    return (
      <main className={styles.main}>
        <div className={styles.authContainer}>
          <div className={styles.authTabs}>
            <button
              className={`${styles.tabButton} ${
                isLoginForm ? styles.activeTab : ""
              }`}
              onClick={handleSwitchToSignIn}
            >
              SIGN IN
            </button>
            <button
              className={`${styles.tabButton} ${
                !isLoginForm ? styles.activeTab : ""
              }`}
              onClick={handleSwitchToSignUp}
            >
              SIGN UP
            </button>
            <div
              className={styles.activeLine}
              style={{
                left: isLoginForm ? "0" : "50%",
              }}
            />
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className={styles.input}
            />
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={styles.input}
            />
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "LOADING..." : isLoginForm ? "SIGN IN" : "SIGN UP"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div
        className={`${styles.authContainer} ${styles.authContainerAuthenticated}`}
      >
        <div className={styles.backButton} onClick={handleBack}>
          <ChevronLeft className={styles.backIcon} />
        </div>
        <h1 className={styles.accountTitle}>ACCOUNT</h1>
        <h2 className={styles.passwordTitle}>PASSWORD</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className={styles.input}
          />
          <label className={styles.label}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className={styles.input}
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.saveButton}
          >
            {loading ? "SAVING..." : "SAVE CHANGES"}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className={styles.logoutButton}
          >
            {loading ? "LOGING OUt..." : "LOG OUT"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AuthPage;
