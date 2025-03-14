import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import HomePage from "../pages/HomePage/HomePage";
import BookPage from "../pages/BookPage/BookPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import AuthPage from "../pages/AuthPage/AuthPage";
import CartPage from "../pages/CartPage/CartPage";
import BookmarksPage from "../pages/BookmarksPage/BookmarksPage";

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/book/:isbn13", element: <BookPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/auth", element: <AuthPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export const AppRouter = () => <RouterProvider router={router} />;
