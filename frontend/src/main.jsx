import React from "react";
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./components/LoadingSpinner";

const Home = lazy(() => import("./pages/home/Home.jsx"));
const SingleProduct = lazy(() => import("./pages/home/SingleProduct.jsx"));
const CategoryProducts = lazy(() => import("./pages/home/CategoryProducts.jsx"));
const AboutUs = lazy(() => import("./pages/home/AboutUs.jsx"));
const ContactUs = lazy(() => import("./pages/home/ContactUs.jsx"));
const Posts = lazy(() => import("./pages/home/Posts.jsx"));
const SinglePost = lazy(() => import("./pages/home/SinglePost.jsx"));

const AdminPage = lazy(() => import("./pages/admin/AdminPage.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const CreateProduct = lazy(() => import("./pages/admin/CreateProduct.jsx"));
const AdminContactUs = lazy(() => import("./pages/admin/AdminContactUs.jsx"));
const AdminOrder = lazy(() => import("./pages/admin/AdminOrder.jsx"));
const AdminPost = lazy(() => import("./pages/admin/AdminPost.jsx"));

const validateToken = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("トークンが見つかりません。ログインしてください。");
    return redirect("/admin");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_NODEJS_API_URL}/api/auth/verify`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.data.valid) {
      alert("無効なトークンです。再ログインしてください。");
      return redirect("/admin");
    }

    return null;
  } catch (error) {
    alert("認証に失敗しました。もう一度お試しください。");
    return redirect("/admin");
  }
};

const checkAdminAuth = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NODEJS_API_URL}/api/auth/verify`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.valid) {
        return redirect("/admin/dashboard");
      }
    } catch (error) {
      return null;
    }
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="px-2 sm:px-4">
              <Home />
            </div>
          </Suspense>
        ),
      },
      {
        path: "/product/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="px-2 sm:px-4">
              <SingleProduct />
            </div>
          </Suspense>
        ),
      },
      {
        path: "/category/:category",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="px-2 sm:px-4">
              <CategoryProducts />
            </div>
          </Suspense>
        ),
      },
      {
        path: "/aboutus",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AboutUs />
          </Suspense>
        ),
      },
      {
        path: "/contactus",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ContactUs />
          </Suspense>
        ),
      },
      {
        path: "/post/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SinglePost />
          </Suspense>
        ),
      },
      {
        path: "/posts",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Posts />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminPage />
      </Suspense>
    ),
    loader: checkAdminAuth,
  },
  {
    path: "/admin/dashboard",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminDashboard />
      </Suspense>
    ),
    loader: validateToken,
  },
  {
    path: "/admin/create",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <CreateProduct />
      </Suspense>
    ),
    loader: validateToken,
  },
  {
    path: "/admin/contact",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminContactUs />
      </Suspense>
    ),
    loader: validateToken,
  },
  {
    path: "/admin/order",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminOrder />
      </Suspense>
    ),
    loader: validateToken,
  },
  {
    path: "/admin/post",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminPost />
      </Suspense>
    ),
    loader: validateToken,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
