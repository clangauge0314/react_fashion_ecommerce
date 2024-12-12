import React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { lazy } from "react";
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const Announce = lazy(() => import("./pages/home/Announce"));

function App() {
  return (
    <>
      <Navbar />
      <Announce />
      <div className="max-w-screen-2xl mx-auto">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
