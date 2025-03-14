import { User } from "firebase/auth";

export interface AppUser {
  uid: User["uid"];
  email: User["email"];
}

export interface AuthState {
  user: AppUser | null;
  loading: boolean;
}
