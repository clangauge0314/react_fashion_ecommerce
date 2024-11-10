import React from "react";
import bannerImg from "../../assets/banner.jpg";
import { FaShoppingBag } from "react-icons/fa";

const Banner = () => {
  return (
    <div className="bg-primaryBG py-12 xl:px-28 px-4">
      <div className="py-28 flex flex-col md:flex-row justify-between items-center gap-14 md:translate-x-20">
        <div className="md:w-1/2 ml-auto">
          <h1 className="text-5xl font-light mb-5">Collections</h1>
          <p className="text-xl mb-7">
            You can explore and shop many different collections from various
            brands.
          </p>
          <button className="bg-Black hover:bg-orange-500 px-8 py-4 text-white font-semibold rounded-sm flex items-center gap-2">
            <FaShoppingBag className="inline-flex" />
            Shop Now
          </button>
        </div>
        <div className="md:w-1/2 ml-auto">
          <img src={bannerImg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
