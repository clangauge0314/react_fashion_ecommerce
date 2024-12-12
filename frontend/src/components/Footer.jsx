import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-footer.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer>
      <div className="max-w-screen-2xl container mx-auto xl:px-28 px-4">
        <div className="mt-20 mb-10 flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="md:w-[400px]">
            <Link to="/" onClick={handleScrollToTop}>
              <img src={logo} alt="" />
            </Link>
          </div>

          <div className="text-Black">
            <h4 className="font-semibold mb-3">CATEGORY</h4>
            <div className="space-y-2">
              <Link
                to="/category/MARNI バッグ"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                MARNI バッグ
              </Link>
              <Link
                to="/category/AMI PARIS バッグ"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                AMI PARIS バッグ
              </Link>
              <Link
                to="/category/MARC JACOBS バッグ"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                MARC JACOBS バッグ
              </Link>
              <Link
                to="/category/Y-3 バッグ"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                Y-3 バッグ
              </Link>
              <Link
                to="/category/A.P.C. バッグ"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                A.P.C. バッグ
              </Link>
              <Link
                to="/category/Alexander Wang バッグ"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                Alexander Wang バッグ
              </Link>
              <Link
                to="/category/その他 ブランドバッグ"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                その他 ブランドバッグ
              </Link>
              <Link
                to="/category/アパレル"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                アパレル
              </Link>
            </div>
          </div>

          <div className="text-Black">
            <h4 className="font-semibold mb-3">CUSTOMER SERVICES</h4>
            <div className="space-y-2">
              <Link
                to="/aboutus"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                サービスについて
              </Link>
              <Link
                to="/contactus"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
                お問い合わせ
              </Link>
              <Link
                to="/contactus"
                className="text-sm block hover:text-orange-500"
                onClick={handleScrollToTop}
              >
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
