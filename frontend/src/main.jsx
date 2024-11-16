import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

import Home from "./pages/home/Home.jsx";
import SingleProduct from "./pages/home/SingleProduct.jsx";
import CategoryProducts from "./pages/home/CategoryProducts.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CreateProduct from "./pages/admin/CreateProduct.jsx";
import axios from "axios";

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
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <SingleProduct />,
      },
      {
        path: "/category/:category",
        element: <CategoryProducts />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    loader: validateToken, // 유효성 검증
  },
  {
    path: "/admin/create",
    element: <CreateProduct />,
    loader: validateToken, // 유효성 검증
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);