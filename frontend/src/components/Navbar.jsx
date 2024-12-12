import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiMenuAlt3 } from "react-icons/hi";

const MenuLinks = [
  {
    id: 1,
    name: "ホーム",
    link: "/",
  },
  {
    id: 2,
    name: "今月のおすすめ",
    link: "/category/all"
  },
  {
    id: 3,
    name: "サービスについて",
    link: "/aboutus",
  },
  {
    id: 4,
    name: "お問い合わせ",
    link: "/contactus",
  },
];

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-white shadow">
      <div className="container mx-auto px-6 sm:px-10 md:px-16 md:mx-30 lg:px-32">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-20">
            <a href="/">
              <img
                src={logo}
                alt="Logo"
                className="w-28 sm:w-36 md:w-44 lg:w-52 h-auto"
              />
            </a>

            <div className="hidden xl:block">
              <ul className="flex items-center gap-8 md:gap-20 lg:gap-10">
                {MenuLinks.map((data) => (
                  <li key={data.id}>
                    <a
                      href={data.link}
                      className="inline-block font-semibold text-gray-600 hover:text-black text-base md:text-base"
                    >
                      {data.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-6 md:ml-10 md:gap-10 lg:gap-12">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="relative text-gray-600 hover:text-black focus:outline-none"
              >
                <IoMdNotificationsOutline className="text-3xl" />
                <span className="absolute top-0 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <div
                className={`absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border transition-all duration-300 z-50 ${
                  isDropdownOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
              >
                <ul className="text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Notification 1
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Notification 2
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Notification 3
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={toggleMenu}
                className="xl:hidden text-gray-600 hover:text-black focus:outline-none"
              >
                <HiMenuAlt3 className="text-3xl" />
              </button>

              <div
                className={`absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border transition-all duration-300 z-50 ${
                  isMenuOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
              >
                <ul className="text-gray-700">
                  {MenuLinks.map((data) => (
                    <li
                      key={data.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <a href={data.link}>{data.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
