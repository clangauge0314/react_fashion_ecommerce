import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import SingleProduct from "./pages/home/SingleProduct.jsx";
import CategoryProducts from "./pages/home/CategoryProducts.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CreateProduct from "./pages/admin/CreateProduct.jsx";

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
  },
  {
    path: "/admin/create",
    element: <CreateProduct />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
