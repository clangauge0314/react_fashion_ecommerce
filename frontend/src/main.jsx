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

// Lazy Loading으로 페이지 로드
const Home = lazy(() => import("./pages/home/Home.jsx"));
const SingleProduct = lazy(() => import("./pages/home/SingleProduct.jsx"));
const CategoryProducts = lazy(() =>
  import("./pages/home/CategoryProducts.jsx")
);
const AdminPage = lazy(() => import("./pages/admin/AdminPage.jsx"));
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard.jsx")
);
const CreateProduct = lazy(() => import("./pages/admin/CreateProduct.jsx"));

const validateToken = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("トークンが見つかりません。ログインしてください。");
    return redirect("/admin");
  }

  try {
    const response = await axios.post(
      "http://183.107.128.217:3000/api/auth/verify",
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/product/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SingleProduct />
          </Suspense>
        ),
      },
      {
        path: "/category/:category",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CategoryProducts />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminPage />
      </Suspense>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminDashboard />
      </Suspense>
    ),
    loader: validateToken, // 유효성 검증
  },
  {
    path: "/admin/create",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CreateProduct />
      </Suspense>
    ),
    loader: validateToken, // 유효성 검증
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
