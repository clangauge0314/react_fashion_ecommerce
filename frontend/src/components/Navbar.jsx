import React, { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { title: "Category 1", path: "/" },
    { title: "Category 2", path: "/" },
    { title: "Category 3", path: "/" },
    { title: "Category 4", path: "/" },
    { title: "Category 5", path: "/" },
    { title: "Category 6", path: "/" },
  ];

  return (
    <header className="max-w-full mx-auto xl:px-48 lg:px-10 px-4 absolute top-0 right-0 left-0">
      <nav className="flex items-center justify-between w-full md:py-4 pt-6 pb-3">
        <div className="flex items-center space-x-4">
          <FaSearch className="text-Black w-5 h-5 hidden md:block" />
        </div>

        <a href="/" className="flex-1 flex justify-center relative">
          <img
            src={logo}
            alt="logo"
            style={{ width: "200px", height: "140px" }}
            className="object-contain h-24 md:h-24 absolute top-1/2 transform -translate-y-1/2"
          />
        </a>

        <div className="sm:hidden">
          <button onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? (
              <FaTimes className="w-5 h-5 text-Black" />
            ) : (
              <FaBars className="w-5 h-5 text-Black" />
            )}
          </button>
        </div>
      </nav>

      <hr />

      <div className="lg:hidden">
        <ul
          className={`bg-Black text-white px-4 py-2 rounded ${
            isMenuOpen ? "" : "hidden"
          }`}
        >
          {navItems.map(({ title, path }) => (
            <li
              key={title}
              className="hover:text-orange-500 my-3 cursor-pointer"
            >
              <Link to={path}>{title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
