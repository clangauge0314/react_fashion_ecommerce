import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-footer.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="max-w-screen-2xl container mx-auto xl:px-28 px-4">
        <div className="mt-20 mb-10 flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="md:w-[400px]">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>

          <div className="text-Black">
            <h4 className="font-semibold mb-3">CATEGORY</h4>
            <div className="space-y-2">
              <Link
                to="/category/MARNI バッグ"
                className="text-sm block hover:text-orange-500"
              >
                MARNI バッグ
              </Link>
              <Link
                to="/category/AMI PARIS バッグ"
                className="text-sm block hover:text-orange-500"
              >
                AMI PARIS バッグ
              </Link>
              <Link
                to="/category/MARC JACOBS バッグ"
                className="text-sm block hover:text-orange-500"
              >
                MARC JACOBS バッグ
              </Link>
              <Link
                to="/category/Y-3 バッグ"
                className="text-sm block hover:text-orange-500"
              >
                Y-3 バッグ
              </Link>
              <Link
                to="/category/A.P.C. バッグ"
                className="text-sm block hover:text-orange-500"
              >
                A.P.C. バッグ
              </Link>
              <Link
                to="/category/Alexander Wang バッグ"
                className="text-sm block hover:text-orange-500"
              >
                Alexander Wang バッグ
              </Link>
              <Link
                to="/category/その他 ブランドバッグ"
                className="text-sm block hover:text-orange-500"
              >
                その他 ブランドバッグ
              </Link>
              <Link
                to="/category/アパレル"
                className="text-sm block hover:text-orange-500"
              >
                アパレル
              </Link>
            </div>
          </div>

          <div className="text-Black">
            <h4 className="font-semibold mb-3">CUSTOMER SERVICES</h4>
            <div className="space-y-2">
              <Link to="/" className="text-sm block hover:text-orange-500">
                お問い合わせ
              </Link>
              <Link to="/" className="text-sm block hover:text-orange-500">
                サービスについて
              </Link>
              <Link to="/" className="text-sm block hover:text-orange-500">
                よくあるご質問
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-Black">
        <p className="text-white text-center items-center py-3">
          © {currentYear} Mami Select
        </p>
      </div>
    </footer>
  );
};

export default Footer;
