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

const AdminPage = lazy(() => import("./pages/admin/AdminPage.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const CreateProduct = lazy(() => import("./pages/admin/CreateProduct.jsx"));
const AdminContactUs = lazy(() => import("./pages/admin/AdminContactUs.jsx"));
const AdminOrder = lazy(() => import("./pages/admin/AdminOrder.jsx"));
const NoticeBoard = lazy(() => import("./pages/home/NoticeBoard.jsx"));

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
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/product/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SingleProduct />
          </Suspense>
        ),
      },
      {
        path: "/category/:category",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CategoryProducts />
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
        path: "/noticeboard",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NoticeBoard />
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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
