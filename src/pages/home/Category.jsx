import React from "react";
import { Link } from "react-router-dom";

import Logo1 from "../../assets/brand/brand1.png";
import Logo2 from "../../assets/brand/brand2.png";
import Logo3 from "../../assets/brand/brand3.png";
import Logo4 from "../../assets/brand/brand4.png";
import Logo5 from "../../assets/brand/brand5.png";

import Image1 from "../../assets/images/image1.png";
import Image2 from "../../assets/images/image2.png";
import Image3 from "../../assets/images/image3.png";
import Image4 from "../../assets/images/image4.png";
import Image5 from "../../assets/images/image5.png";

const companyLogo = [
  { id: 1, img: Logo1 },
  { id: 2, img: Logo2 },
  { id: 3, img: Logo3 },
  { id: 4, img: Logo4 },
  { id: 5, img: Logo5 },
];

const Category = () => {
  return (
    <div className="max-w-screen-2xl mx-auto container xl:px-28 px-4 py-28">
      <div className="flex items-center justify-around flex-wrap gap-5 py-5">
        {companyLogo.map(({ id, img }) => (
          <div key={id}>
            <img src={img} alt="" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
        <p className="font-semibold uppercase md:rotate-90 text-center bg-black text-white md:p-1.5 p-2 rounded-sm inline-flex">
          Explore new and popular styles
        </p>
        <div>
          <Link to="/">
            <img src={Image1} alt="" className="w-full hover:scale-105 transition-all duration-200"/>
          </Link>
        </div>
        <div className="md:w-1/2">
          <div className="grid grid-cols-2 gap-2">
            <Link to="/">
              <img src={Image2} alt="" className="w-full hover:scale-105 transition-all duration-200"/>
            </Link>
            <Link to="/">
              <img src={Image3} alt="" className="w-full hover:scale-105 transition-all duration-200"/>
            </Link>
            <Link to="/">
              <img src={Image4} alt="" className="w-full hover:scale-105 transition-all duration-200"/>
            </Link>
            <Link to="/">
              <img src={Image5} alt="" className="w-full hover:scale-105 transition-all duration-200"/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
